from __future__ import annotations

from pathlib import Path
import pytest

from app.narrative_models import Excerpt, LedgerEntry, NarrativeNode, PayoffLink, Series
from app.relational_store import RelationalSeriesStore


@pytest.fixture
def sample_series() -> Series:
    nodes = [
        NarrativeNode(id="n-1", episode=1, perceived_index=1, true_time=0.1, summary="Clue planted.", entities=["char:raj", "prop:key"], valence=0.5, excerpt_id="ex-1"),
        NarrativeNode(id="n-2", episode=2, perceived_index=2, true_time=0.2, summary="Contradiction observed.", entities=["char:raj"], valence=-0.2, excerpt_id="ex-2"),
    ]
    entries = [
        LedgerEntry(id="le-1", kind="promise", description="Find the key", episodes=[1], excerpt_ids=["ex-1"], urgency=4, promise_kind="mystery", entities=["char:raj"]),
        LedgerEntry(id="le-2", kind="contradiction", description="Raj asleep vs running", episodes=[1, 2], excerpt_ids=["ex-1", "ex-2"], urgency=5, promise_kind="causal", entities=["char:raj"]),
    ]

    payoffs = [
        PayoffLink(node_id="n-1", target_id="n-2", episode=2, rationale="Twist setup", verified=True)
    ]
    excerpts = [
        Excerpt(id="ex-1", episode=1, text="Raj placed the key in the drawer."),
        Excerpt(id="ex-2", episode=2, text="Raj was running across the bridge."),
    ]
    return Series(
        id="test-series-1",
        title="The Test Series",
        genre="mystery",
        total_episodes=2,
        ongoing=True,
        source_version="v2.0-custom",
        episode_writers={"1": "writer-alice", "2": "writer-bob"},
        episode_languages={"1": "en", "2": "hi"},
        nodes=nodes,
        entries=entries,
        payoffs=payoffs,
        excerpts=excerpts,
    )



def test_relational_store_save_and_load_roundtrip(tmp_path: Path, sample_series: Series):
    db_path = tmp_path / "test.db"
    store = RelationalSeriesStore(db_url=f"sqlite:///{db_path}")

    # Save series
    store.save(sample_series)

    # Load back
    loaded = store.load("test-series-1")

    assert loaded.id == sample_series.id
    assert loaded.title == sample_series.title
    assert loaded.genre == sample_series.genre
    assert loaded.total_episodes == sample_series.total_episodes
    assert loaded.ongoing == sample_series.ongoing
    assert loaded.source_version == "v2.0-custom"
    assert loaded.episode_writers == {"1": "writer-alice", "2": "writer-bob"}
    assert loaded.episode_languages == {"1": "en", "2": "hi"}


    # Verify nodes
    assert len(loaded.nodes) == 2
    assert loaded.nodes[0].id == "n-1"
    assert loaded.nodes[0].true_time == 0.1
    assert loaded.nodes[0].entities == ["char:raj", "prop:key"]

    # Verify ledger entries
    assert len(loaded.entries) == 2
    assert loaded.entries[0].kind == "promise"
    assert loaded.entries[0].episodes == [1]

    # Verify payoffs and excerpts
    assert len(loaded.payoffs) == 1
    assert loaded.payoffs[0].verified is True
    assert len(loaded.excerpts) == 2
    assert loaded.excerpts[0].text == "Raj placed the key in the drawer."


def test_relational_store_lists_multiple_series(tmp_path: Path, sample_series: Series):
    store = RelationalSeriesStore(db_url=f"sqlite:///{tmp_path / 'multi.db'}")
    store.save(sample_series)

    series_2 = sample_series.model_copy(update={"id": "test-series-2", "title": "Second Title"})
    store.save(series_2)

    series_list = store.list_series()
    assert len(series_list) == 2
    ids = [s["series_id"] for s in series_list]
    assert "test-series-1" in ids
    assert "test-series-2" in ids
