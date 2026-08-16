from __future__ import annotations

import pytest
from app.narrative_models import NarrativeNode, PayoffLink, Series, LedgerEntry, Excerpt
from app.graph_engine import DualLayerGraphEngine


@pytest.fixture
def non_linear_series() -> Series:
    # Ep 1 (2000, true_time=0.1), Ep 2 (2010, true_time=0.9), Ep 3 (2004, true_time=0.4)
    nodes = [
        NarrativeNode(id="n-ep1", episode=1, perceived_index=1, true_time=0.1, summary="Meeting in 2000.", entities=["char:raj"], valence=0.1),
        NarrativeNode(id="n-ep2", episode=2, perceived_index=2, true_time=0.9, summary="Climax in 2010.", entities=["char:raj"], valence=-0.5),
        NarrativeNode(id="n-ep3", episode=3, perceived_index=3, true_time=0.4, summary="Flashback reveal in 2004.", entities=["char:raj"], valence=0.8),
    ]
    payoffs = [
        PayoffLink(node_id="n-ep1", target_id="n-ep3", episode=3, rationale="Payoff for 2000 clue in 2004 flashback", verified=True)
    ]
    return Series(
        id="non-linear-series",
        title="Maharaja Non-Linear",
        genre="thriller",
        total_episodes=3,
        ongoing=True,
        nodes=nodes,
        entries=[],
        payoffs=payoffs,
        excerpts=[],
    )


def test_dual_layer_graph_builds_true_and_perceived_graphs(non_linear_series: Series):
    engine = DualLayerGraphEngine.from_series(non_linear_series)

    # G_perceived order: n-ep1 -> n-ep2 -> n-ep3
    perceived_order = engine.topological_sort_perceived()
    assert perceived_order == ["n-ep1", "n-ep2", "n-ep3"]

    # G_true chronological order: n-ep1 (0.1) -> n-ep3 (0.4) -> n-ep2 (0.9)
    true_order = engine.topological_sort_true()
    assert true_order == ["n-ep1", "n-ep3", "n-ep2"]


def test_dual_layer_graph_finds_downstream_payoffs(non_linear_series: Series):
    engine = DualLayerGraphEngine.from_series(non_linear_series)

    payoffs = engine.find_downstream_payoffs("n-ep1")
    assert len(payoffs) == 1
    assert payoffs[0]["target_id"] == "n-ep3"
    assert payoffs[0]["verified"] is True


def test_dual_layer_graph_cycle_detection():
    engine = DualLayerGraphEngine()
    engine.add_node("A", true_time=0.1, perceived_index=1)
    engine.add_node("B", true_time=0.2, perceived_index=2)
    engine.add_edge("A", "B", edge_type="causal")

    assert engine.has_cycles(graph_type="true") is False

    # Add cycle
    engine.add_edge("B", "A", edge_type="causal")
    assert engine.has_cycles(graph_type="true") is True
