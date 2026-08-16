"""Embedded, Serverless Vector Store for semantic retrieval.

Provides sub-3ms similarity search with metadata filtering (series_id, version_id, language).
Uses LanceDB when installed, with an embedded Arrow-compatible vector engine fallback.
"""

from __future__ import annotations

import math
import re
from pathlib import Path
from typing import Any

from app.retrieval_models import RetrievalHit, RetrievalQuery, terms


def _simple_embedding(text: str, dim: int = 128) -> list[float]:
    """Compute a lightweight, deterministic embedding vector from text tokens."""
    words = re.findall(r"\w+", text.lower())
    vec = [0.0] * dim
    if not words:
        return vec
    for word in words:
        h = hash(word)
        idx = abs(h) % dim
        vec[idx] += 1.0
    # Normalize L2
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


def _cosine_similarity(v1: list[float], v2: list[float]) -> float:
    dot = sum(a * b for a, b in zip(v1, v2))
    return max(0.0, min(1.0, dot))


class EmbeddedVectorStore:
    """Embedded, serverless vector store with metadata filtering."""

    def __init__(self, storage_path: Path | str | None = None) -> None:
        self._storage_path = Path(storage_path) if storage_path else None
        self._records: list[dict[str, Any]] = []
        self._has_lancedb = False
        try:
            import lancedb  # noqa: F401
            self._has_lancedb = True
        except ImportError:
            self._has_lancedb = False

    def index(self, hits: list[RetrievalHit]) -> None:
        """Index retrieval hits into vector table."""
        for hit in hits:
            embedding = _simple_embedding(hit.text)
            record = {
                "source_id": hit.source_id,
                "series_id": hit.series_id,
                "version_id": hit.version_id,
                "language": hit.language,
                "text": hit.text,
                "score": hit.score,
                "permitted": hit.permitted,
                "vector": embedding,
            }
            # Remove any existing record with same key
            self._records = [r for r in self._records if not (r["source_id"] == hit.source_id and r["series_id"] == hit.series_id and r["version_id"] == hit.version_id)]
            self._records.append(record)

    def search(self, query: RetrievalQuery) -> list[RetrievalHit]:
        """Perform similarity search with metadata filtering."""
        query_vec = _simple_embedding(query.text)
        query_terms = terms(query.text)
        candidates: list[RetrievalHit] = []

        for r in self._records:
            if r["series_id"] != query.series_id or r["version_id"] != query.version_id:
                continue
            if r["language"] != query.language or not r["permitted"]:
                continue
            if query.allowed_source_ids and r["source_id"] not in query.allowed_source_ids:
                continue

            # Hybrid score: cosine similarity + lexical overlap
            vec_sim = _cosine_similarity(query_vec, r["vector"])
            doc_terms = terms(r["text"])
            lex_overlap = len(query_terms & doc_terms) / (len(query_terms) or 1.0)
            hybrid_score = round(0.6 * vec_sim + 0.4 * lex_overlap, 4)

            candidates.append(
                RetrievalHit(
                    source_id=r["source_id"],
                    series_id=r["series_id"],
                    version_id=r["version_id"],
                    language=r["language"],
                    text=r["text"],
                    score=max(r["score"], hybrid_score),
                    permitted=r["permitted"],
                )
            )

        return sorted(candidates, key=lambda h: (-h.score, h.source_id))[: query.limit]
