"""Episode text -> dual-layer graph.

The only model-driven path into the ledger. Everything downstream is
deterministic, so extraction quality is the system's ceiling.

Runs as one batched ai_query over Delta rows rather than N sequential calls --
at 300 episodes that difference is what makes series-scale analysis tractable.
"""

from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Protocol

from pydantic import BaseModel, Field, ValidationError

from app.narrative_models import Excerpt, LedgerEntry, NarrativeNode, PayoffLink
from app.extraction_models import ExtractionContext, ExtractionFailure, ExtractionRunMetadata, SourceCitation


class ExtractionResult(BaseModel):
    nodes: list[NarrativeNode] = Field(default_factory=list)
    entries: list[LedgerEntry] = Field(default_factory=list)
    payoffs: list[PayoffLink] = Field(default_factory=list)
    excerpts: list[Excerpt] = Field(default_factory=list)
    rejected: int = 0
    # None for deterministic extractors (FakeExtractor, HeuristicExtractor).
    # LLMExtractor sets this to "local" or "openai".
    backend: str | None = None
    citations: list[SourceCitation] = Field(default_factory=list)
    metadata: ExtractionRunMetadata | None = None
    failures: list[ExtractionFailure] = Field(default_factory=list)

    def retryable_failures(self) -> list[ExtractionFailure]:
        return [failure for failure in self.failures if failure.retryable]


def attach_provenance(
    result: ExtractionResult,
    episodes: list[dict],
    context: ExtractionContext,
    *,
    run_id: str | None = None,
    started_at: datetime | None = None,
    latency_ms: float | None = None,
    attempt: int = 1,
) -> ExtractionResult:
    """Bind every extracted excerpt to an immutable source version."""
    source_text = {
        int(row["episode"]): str(row.get("synopsis") or row.get("body") or "")
        for row in episodes
        if isinstance(row, dict) and row.get("episode") is not None
    }
    source_rows = {
        int(row["episode"]): row
        for row in episodes
        if isinstance(row, dict) and row.get("episode") is not None
    }
    result.citations = [
        SourceCitation.from_text(
            series_id=context.series_id,
            version_id=context.version_id,
            episode_number=excerpt.episode,
            text=source_text.get(excerpt.episode, excerpt.text),
            source_path=source_rows.get(excerpt.episode, {}).get("source_path"),
            source_pages=source_rows.get(excerpt.episode, {}).get("source_pages", []),
            source_element_ids=source_rows.get(excerpt.episode, {}).get("source_element_ids", []),
        )
        for excerpt in result.excerpts
    ]
    started = started_at or datetime.now(timezone.utc)
    elapsed = latency_ms if latency_ms is not None else 0.0
    result.metadata = ExtractionRunMetadata(
        run_id=run_id or f"extract-{context.version_id}-{context.source_hash[:8]}",
        source_hash=context.source_hash,
        version_id=context.version_id,
        model_name=context.model_name,
        prompt_version=context.prompt_version,
        started_at=started,
        finished_at=started,
        latency_ms=elapsed,
        attempt=attempt,
    )
    return result


class Extractor(Protocol):
    def extract(self, episodes: list[dict]) -> ExtractionResult: ...


def parse_extraction_row(raw: str) -> dict | None:
    """Parse one model response. Returns None on malformed output.

    Models occasionally emit prose around JSON or truncate mid-object. Dropping
    the row keeps the batch alive; the resulting graph is partial, which the
    ledger handles, rather than absent, which it does not.
    """
    try:
        parsed = json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return None
    return parsed if isinstance(parsed, dict) else None


class FakeExtractor:
    """Deterministic extractor for tests and offline demo mode."""

    def extract(self, episodes: list[dict]) -> ExtractionResult:
        nodes: list[NarrativeNode] = []
        excerpts: list[Excerpt] = []
        for row in episodes:
            episode = int(row["episode"])
            text = row.get("synopsis") or row.get("body") or ""
            nodes.append(
                NarrativeNode(
                    id=f"n-{episode}",
                    episode=episode,
                    perceived_index=episode,
                    summary=text[:200],
                    excerpt_id=f"ex-{episode}",
                )
            )
            excerpts.append(Excerpt(id=f"ex-{episode}", episode=episode, text=text))
        return ExtractionResult(nodes=nodes, excerpts=excerpts)



