from __future__ import annotations

import pytest

from app.ingestion_models import (
    EpisodeInput,
    SubmissionInput,
    parse_submission_json,
    parse_submission_ndjson,
)
from app.ingestion_repository import InMemorySubmissionRepository
from app.ingestion import IngestionCoordinator
from app.extraction import ExtractionResult
from app.narrative_models import NarrativeNode


def test_ndjson_parser_rejects_duplicate_episode_numbers():
    raw = b'{"episode_number": 1, "text": "a"}\n{"episode_number": 1, "text": "b"}\n'
    with pytest.raises(ValueError, match="duplicate episode_number"):
        parse_submission_ndjson(raw.splitlines())


def test_json_parser_normalizes_episode_order():
    result = parse_submission_json(
        b'{"series_id":"s1","title":"S","genre":"thriller","episodes":['
        b'{"episode_number":2,"text":"b"},{"episode_number":1,"text":"a"}]}'
    )
    assert [episode.episode_number for episode in result.episodes] == [1, 2]


def test_repository_is_idempotent_for_same_source_hash():
    repository = InMemorySubmissionRepository()
    submission = SubmissionInput(
        series_id="s1",
        title="S",
        genre="thriller",
        episodes=[EpisodeInput(episode_number=1, text="one")],
    )
    first = repository.create_submission(submission, source_hash="abc")
    second = repository.create_submission(submission, source_hash="abc")
    assert first.job_id == second.job_id
    assert len(repository.list_work_items(first.job_id, "fast")) == 1


class _Extractor:
    def __init__(self, failing_episode_numbers: set[int] | None = None):
        self.failing_episode_numbers = failing_episode_numbers or set()

    def extract_fast(self, episode: EpisodeInput, job_id: str) -> None:
        return None

    def extract_deep(self, episode: EpisodeInput, job_id: str) -> None:
        if episode.episode_number in self.failing_episode_numbers:
            raise TimeoutError("temporary extraction failure")


def test_repository_accumulates_extraction_results_per_stage():
    repository = InMemorySubmissionRepository()
    submission = SubmissionInput(
        series_id="s1",
        title="S",
        genre="thriller",
        episodes=[EpisodeInput(episode_number=1, text="one"), EpisodeInput(episode_number=2, text="two")],
    )
    job = repository.create_submission(submission, source_hash="abc")

    repository.record_extraction(
        job.job_id, 1, "deep",
        ExtractionResult(nodes=[NarrativeNode(id="n1", episode=1, perceived_index=1, summary="a")]),
    )
    repository.record_extraction(
        job.job_id, 2, "deep",
        ExtractionResult(nodes=[NarrativeNode(id="n2", episode=2, perceived_index=2, summary="b")], rejected=1),
    )

    accumulated = repository.accumulated_result(job.job_id, "deep")
    assert [node.id for node in accumulated.nodes] == ["n1", "n2"]
    assert accumulated.rejected == 1

    empty = repository.accumulated_result(job.job_id, "fast")
    assert empty.nodes == []
    assert empty.rejected == 0


from app.ingestion import RealIngestionExtractor
from app.narrative_models import Series


def test_real_extractor_fills_fast_stage_from_synopsis_with_scaled_confidence():
    repository = InMemorySubmissionRepository()
    submission = SubmissionInput(
        series_id="s1", title="S", genre="thriller",
        episodes=[EpisodeInput(episode_number=1, text="Full body text.", synopsis="Ana promises to return.")],
    )
    job = repository.create_submission(submission, source_hash="abc")
    extractor = RealIngestionExtractor(repository)

    extractor.extract_fast(submission.episodes[0], job.job_id)

    result = repository.accumulated_result(job.job_id, "fast")
    assert len(result.entries) >= 1
    assert all(entry.confidence == 0.4 for entry in result.entries)


def test_real_extractor_deep_stage_falls_back_to_heuristic_without_openai_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    repository = InMemorySubmissionRepository()
    submission = SubmissionInput(
        series_id="s1", title="S", genre="thriller",
        episodes=[EpisodeInput(episode_number=1, text="Ana promises to return to the ferry.")],
    )
    job = repository.create_submission(submission, source_hash="abc")
    extractor = RealIngestionExtractor(repository)

    extractor.extract_deep(submission.episodes[0], job.job_id)

    result = repository.accumulated_result(job.job_id, "deep")
    assert result.backend is None  # HeuristicExtractor sets no backend label


def test_real_extractor_deep_stage_uses_llm_when_openai_key_present(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")

    def fake_transport(*, endpoint, token, model, prompt):
        return '{"nodes": [], "entries": [], "payoffs": [], "excerpts": []}'

    repository = InMemorySubmissionRepository()
    submission = SubmissionInput(
        series_id="s1", title="S", genre="thriller",
        episodes=[EpisodeInput(episode_number=1, text="Ana promises to return.")],
    )
    job = repository.create_submission(submission, source_hash="abc")
    extractor = RealIngestionExtractor(repository, transport=fake_transport)

    extractor.extract_deep(submission.episodes[0], job.job_id)

    result = repository.accumulated_result(job.job_id, "deep")
    assert result.backend == "openai"


def test_coordinator_series_assembles_from_accumulated_deep_result():
    repository = InMemorySubmissionRepository()
    submission = SubmissionInput(
        series_id="s1", title="S", genre="thriller",
        episodes=[EpisodeInput(episode_number=1, text="Ana promises to return to the ferry.")],
    )
    coordinator = IngestionCoordinator(repository=repository, extractor=RealIngestionExtractor(repository))
    job = coordinator.submit(submission)
    coordinator.run_fast(job.job_id)
    coordinator.run_deep(job.job_id)

    series = coordinator.series(job.job_id)
    assert isinstance(series, Series)
    assert series.id == "s1"
    assert series.total_episodes == 1


def test_deep_retry_only_reprocesses_failed_items():
    submission = SubmissionInput(
        series_id="s1",
        title="S",
        genre="thriller",
        episodes=[EpisodeInput(episode_number=n, text=str(n)) for n in range(1, 4)],
    )
    extractor = _Extractor({2})
    coordinator = IngestionCoordinator(
        repository=InMemorySubmissionRepository(), extractor=extractor
    )
    job = coordinator.submit(submission)
    coordinator.run_fast(job.job_id)
    failed = coordinator.run_deep(job.job_id)
    assert failed.failed_episodes == [2]
    extractor.failing_episode_numbers.clear()
    complete = coordinator.retry(job.job_id)
    assert complete.completed_episodes == 3
    assert complete.reprocessed_episodes == [2]
