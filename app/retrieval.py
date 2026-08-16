"""Local retrieval providers."""

from __future__ import annotations

from typing import Any, Protocol

from app.retrieval_models import RetrievalHit, RetrievalQuery, terms


class Retriever(Protocol):
    def search(self, query: RetrievalQuery) -> list[RetrievalHit]: ...


class LocalRetriever:
    def __init__(self, hits: list[RetrievalHit]) -> None:
        self._hits = hits

    def search(self, query: RetrievalQuery) -> list[RetrievalHit]:
        query_terms = terms(query.text)
        results = []
        for hit in self._hits:
            if hit.series_id != query.series_id or hit.version_id != query.version_id:
                continue
            if hit.language != query.language or not hit.permitted:
                continue
            if query.allowed_source_ids and hit.source_id not in query.allowed_source_ids:
                continue
            overlap = len(query_terms & terms(hit.text))
            if not overlap:
                continue
            results.append(hit.model_copy(update={"score": max(hit.score, overlap / len(query_terms))}))
        return sorted(results, key=lambda hit: (-hit.score, hit.source_id))[: query.limit]


class LanceDBRetriever:
    """Embedded, serverless vector search retriever using LanceDB or embedded store."""

    def __init__(self, vector_store: Any | None = None) -> None:
        if vector_store is not None:
            self._store = vector_store
        else:
            from app.vector_store import EmbeddedVectorStore

            self._store = EmbeddedVectorStore()

    def search(self, query: RetrievalQuery) -> list[RetrievalHit]:
        return self._store.search(query)

