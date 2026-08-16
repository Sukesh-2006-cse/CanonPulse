"""Local, deterministic implementation of CanonPulse's two-speed ingest seam.

The production adapter can persist the same lifecycle in Delta.  This module
keeps the public contract useful offline: a synopsis graph is available as
soon as submission validation completes and a deep run is promoted atomically
only after its complete graph has been built.
"""

from __future__ import annotations

import hashlib
import json
from typing import Literal

from pydantic import BaseModel, Field, model_validator

from app.extraction import ExtractionResult
from app.heuristic_extractor import HeuristicExtractor
from app.ingestion_models import (
    EpisodeInput,
    IngestionJob,
    IngestionStatus,
    SubmissionInput,
    submission_source_hash,
)
from app.ingestion_repository import InMemorySubmissionRepository, SubmissionRepository
from app.llm_config import openai_config
from app.llm_extractor import LLMExtractor, Transport
from app.narrative_models import Series


class SubmissionEpisode(BaseModel):
    episode: int = Field(ge=1)
    synopsis: str = Field(min_length=1)
    body: str | None = None
    writer_id: str = "unknown"
    language: str = "en"


class Submission(BaseModel):
    series_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    genre: str = Field(min_length=1)
    episodes: list[SubmissionEpisode] = Field(min_length=1, max_length=300)
    ongoing: bool = True

    @model_validator(mode="after")
    def _episodes_are_ordered_and_unique(self) -> "Submission":
        numbers = [episode.episode for episode in self.episodes]
        if numbers != sorted(numbers) or len(numbers) != len(set(numbers)):
            raise ValueError("episodes must be unique and sorted")
        return self


class IngestJob(BaseModel):
    job_id: str
    series_id: str
    status: Literal["received", "validated", "synopsis_ready", "complete", "failed"]
    deep_status: Literal["pending", "running", "complete", "failed"] = "pending"
    accepted: int = 0
    rejected: int = 0
    retried: int = 0
    series: Series
    error: str | None = None


def _series_from_result(submission: Submission, result, *, source_version: str) -> Series:
    writer_map = {str(item.episode): item.writer_id for item in submission.episodes}
    language_map = {str(item.episode): item.language for item in submission.episodes}
    return Series(
        id=submission.series_id,
        title=submission.title,
        genre=submission.genre,
        total_episodes=max(item.episode for item in submission.episodes),
        ongoing=submission.ongoing,
        nodes=result.nodes,
        entries=result.entries,
        payoffs=result.payoffs,
        excerpts=result.excerpts,
        source_version=source_version,
        episode_writers=writer_map,
        episode_languages=language_map,
    )


class IngestService:
    """Idempotent in-memory job store used by local mode and API tests."""

    def __init__(self) -> None:
        self._jobs: dict[str, IngestJob] = {}
        self._submissions: dict[str, Submission] = {}

    @staticmethod
    def _job_id(submission: Submission) -> str:
        encoded = json.dumps(submission.model_dump(), sort_keys=True).encode()
        return hashlib.sha256(encoded).hexdigest()[:16]

    @staticmethod
    def _source_version(submission: Submission, deep: bool) -> str:
        payload = {"deep": deep, **submission.model_dump()}
        return hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()

    @staticmethod
    def _rows(submission: Submission, *, deep: bool) -> list[dict]:
        return [
            {
                "episode": item.episode,
                "synopsis": item.synopsis,
                "body": item.body if deep else None,
            }
            for item in submission.episodes
        ]

    def submit(self, submission: Submission) -> IngestJob:
        job_id = self._job_id(submission)
        if job_id in self._jobs:
            return self._jobs[job_id].model_copy(deep=True)
        self._submissions[job_id] = submission.model_copy(deep=True)
        result = SynopsisExtractor().extract(self._rows(submission, deep=False))
        job = IngestJob(
            job_id=job_id,
            series_id=submission.series_id,
            status="synopsis_ready",
            accepted=len(result.nodes),
            rejected=result.rejected,
            series=_series_from_result(
                submission, result, source_version=self._source_version(submission, False)
            ),
        )
        self._jobs[job_id] = job
        return job.model_copy(deep=True)

    def get(self, job_id: str) -> IngestJob:
        try:
            return self._jobs[job_id].model_copy(deep=True)
        except KeyError as exc:
            raise KeyError(f"unknown ingest job: {job_id}") from exc

    def run_deep(self, job_id: str) -> IngestJob:
        job = self._jobs[job_id]
        if job.deep_status == "complete":
            return job.model_copy(deep=True)
        submission = self._submissions[job_id]
        job.deep_status = "running"
        result = HeuristicExtractor().extract(self._rows(submission, deep=True))
        promoted = _series_from_result(
            submission, result, source_version=self._source_version(submission, True)
        )
        job.series = promoted
        job.status = "complete"
        job.deep_status = "complete"
        job.accepted = len(result.nodes)
        job.rejected = result.rejected
        self._jobs[job_id] = job
        return job.model_copy(deep=True)


class SynopsisExtractor:
    """Fast bounded adapter used before full episode bodies are available."""

    backend = "synopsis-local"

    def extract(self, episodes: list[dict]):
        result = HeuristicExtractor().extract(
            [{"episode": row["episode"], "synopsis": row.get("synopsis", "")} for row in episodes]
        )
        for entry in result.entries:
            entry.confidence = 0.4
        result.backend = self.backend
        return result


def _series_from_submission_input(submission: SubmissionInput, result: ExtractionResult, *, source_version: str) -> Series:
    writer_map = {str(episode.episode_number): episode.writer_id for episode in submission.episodes}
    language_map = {str(episode.episode_number): episode.language for episode in submission.episodes}
    return Series(
        id=submission.series_id,
        title=submission.title,
        genre=submission.genre,
        total_episodes=max(episode.episode_number for episode in submission.episodes),
        ongoing=submission.ongoing,
        nodes=result.nodes,
        entries=result.entries,
        payoffs=result.payoffs,
        excerpts=result.excerpts,
        source_version=source_version,
        episode_writers=writer_map,
        episode_languages=language_map,
    )


class RealIngestionExtractor:
    """Fast/deep extractor wired into IngestionCoordinator's real lifecycle.

    Fast stays HeuristicExtractor-over-synopsis-only (confidence-scaled), same
    as SynopsisExtractor. Deep uses OpenAI/local LLM when configured, and
    falls back to HeuristicExtractor over the full body when not configured.
    """

    def __init__(
        self,
        repository: SubmissionRepository,
        transport: Transport | None = None,
    ) -> None:
        self._repository = repository
        self._transport = transport

    def extract_fast(self, episode: EpisodeInput, job_id: str) -> None:
        result = HeuristicExtractor().extract(
            [{"episode": episode.episode_number, "synopsis": episode.synopsis or ""}]
        )
        for entry in result.entries:
            entry.confidence = 0.4
        self._repository.record_extraction(job_id, episode.episode_number, "fast", result)

    def extract_deep(self, episode: EpisodeInput, job_id: str) -> None:
        rows = [{"episode": episode.episode_number, "body": episode.text}]
        openai_cfg = openai_config()
        if openai_cfg is not None:
            result = LLMExtractor(
                endpoint=openai_cfg.endpoint,
                token=openai_cfg.token,
                model=openai_cfg.model,
                cache_path="data/extraction_cache/deep_ingest_openai.json",
                transport=self._transport,
            ).extract(rows)
        else:
            result = HeuristicExtractor().extract(rows)
        self._repository.record_extraction(job_id, episode.episode_number, "deep", result)


class IngestionCoordinator:
    """Resumable fast/deep lifecycle over a repository-backed submission."""

    def __init__(self, repository: SubmissionRepository | None = None, extractor=None) -> None:
        self.repository = repository or InMemorySubmissionRepository()
        self.extractor = extractor or _DefaultIngestionExtractor()
        self._submissions: dict[str, SubmissionInput] = {}

    def submit(self, submission: SubmissionInput) -> IngestionJob:
        source_hash = submission_source_hash(submission)
        job = self.repository.create_submission(submission, source_hash)
        self._submissions[job.job_id] = submission
        return job

    def run_fast(self, job_id: str) -> IngestionStatus:
        job = self.repository.jobs[job_id] if isinstance(self.repository, InMemorySubmissionRepository) else None
        if job and job.status == "cancelled":
            return self._status(job_id)
        for item in self.repository.list_work_items(job_id, "fast"):
            if item.status == "complete":
                continue
            episode = self._episode(job_id, item.episode_number)
            self.repository.update_work_item(job_id, item.episode_number, "fast", "running")
            try:
                self.extractor.extract_fast(episode, job_id)
            except Exception as exc:  # noqa: BLE001 - persisted as row-level failure
                self.repository.update_work_item(job_id, item.episode_number, "fast", "failed", str(exc))
            else:
                self.repository.update_work_item(job_id, item.episode_number, "fast", "complete")
        self.repository.promote_fast_ledger(job_id)
        return self._status(job_id)

    def run_deep(self, job_id: str, episode_numbers: list[int] | None = None) -> IngestionStatus:
        job = self.repository.jobs[job_id] if isinstance(self.repository, InMemorySubmissionRepository) else None
        if job and job.status == "cancelled":
            return self._status(job_id)
        if job:
            job.status = "deep_running"
        for item in self.repository.list_work_items(job_id, "deep"):
            if item.status == "complete" or (episode_numbers is not None and item.episode_number not in episode_numbers):
                continue
            episode = self._episode(job_id, item.episode_number)
            self.repository.update_work_item(job_id, item.episode_number, "deep", "running")
            try:
                self.extractor.extract_deep(episode, job_id)
            except Exception as exc:  # noqa: BLE001 - persisted as row-level failure
                self.repository.update_work_item(job_id, item.episode_number, "deep", "failed", str(exc))
            else:
                self.repository.update_work_item(job_id, item.episode_number, "deep", "complete")
        if job:
            failed = [item.episode_number for item in self.repository.list_work_items(job_id, "deep") if item.status == "failed"]
            job.failed_episodes = failed
            job.completed_episodes = sum(item.status == "complete" for item in self.repository.list_work_items(job_id, "deep"))
            job.status = "partial" if failed else "complete"
        return self._status(job_id)

    def retry(self, job_id: str) -> IngestionStatus:
        failed = [item.episode_number for item in self.repository.list_work_items(job_id, "deep") if item.status in {"failed", "stale"}]
        status = self.run_deep(job_id, failed)
        if isinstance(self.repository, InMemorySubmissionRepository):
            self.repository.jobs[job_id].reprocessed_episodes = failed
            status.reprocessed_episodes = failed
        return status

    def cancel(self, job_id: str) -> IngestionStatus:
        if isinstance(self.repository, InMemorySubmissionRepository):
            self.repository.jobs[job_id].status = "cancelled"
            for stage in ("fast", "deep"):
                for item in self.repository.list_work_items(job_id, stage):
                    if item.status in {"queued", "stale"}:
                        self.repository.update_work_item(job_id, item.episode_number, stage, "cancelled")
        return self._status(job_id)

    def series(self, job_id: str, stage: str = "deep") -> Series:
        submission = self._submissions[job_id]
        result = self.repository.accumulated_result(job_id, stage)
        source_version = hashlib.sha256(f"{job_id}:{stage}".encode()).hexdigest()
        return _series_from_submission_input(submission, result, source_version=source_version)

    def _episode(self, job_id: str, episode_number: int) -> EpisodeInput:
        return next(item for item in self._submissions[job_id].episodes if item.episode_number == episode_number)

    def _status(self, job_id: str) -> IngestionStatus:
        if isinstance(self.repository, InMemorySubmissionRepository):
            job = self.repository.jobs[job_id]
            return IngestionStatus(
                job_id=job.job_id,
                status=job.status,
                completed_episodes=job.completed_episodes,
                failed_episodes=job.failed_episodes,
                reprocessed_episodes=job.reprocessed_episodes,
            )
        raise RuntimeError("status adapter is not configured")


class _DefaultIngestionExtractor:
    def extract_fast(self, episode: EpisodeInput, job_id: str) -> None:
        return None

    def extract_deep(self, episode: EpisodeInput, job_id: str) -> None:
        return None
