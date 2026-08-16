from __future__ import annotations

from pathlib import Path
import pytest

from app.retrieval_models import RetrievalHit, RetrievalQuery
from app.vector_store import EmbeddedVectorStore
from app.retrieval import LanceDBRetriever


def test_embedded_vector_store_indexes_and_searches(tmp_path: Path):
    store = EmbeddedVectorStore(storage_path=tmp_path / "vectors")

    hits = [
        RetrievalHit(source_id="doc-1", series_id="s1", version_id="v1", language="en", text="Inspector found a golden key in the lighthouse", score=0.0, permitted=True),
        RetrievalHit(source_id="doc-2", series_id="s1", version_id="v1", language="en", text="Heavy storm flooded the docks", score=0.0, permitted=True),
        RetrievalHit(source_id="doc-3", series_id="s1", version_id="v2", language="en", text="Another version text", score=0.0, permitted=True),
        RetrievalHit(source_id="doc-4", series_id="s1", version_id="v1", language="hi", text="तूफान आ गया", score=0.0, permitted=True),
    ]

    store.index(hits)

    retriever = LanceDBRetriever(vector_store=store)

    query = RetrievalQuery(
        text="golden key lighthouse",
        series_id="s1",
        version_id="v1",
        language="en",
        allowed_source_ids=(),
        limit=2,
    )


    results = retriever.search(query)
    assert len(results) > 0
    assert results[0].source_id == "doc-1"
    assert results[0].series_id == "s1"
    assert results[0].version_id == "v1"
    assert results[0].language == "en"
