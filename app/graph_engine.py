"""Dual-Layer Graph Traversal Engine using NetworkX.

Constructs and traverses G_true (Chronological Universe Timeline) and
G_perceived (Audience Presentation Order) with microsecond in-memory performance.
"""

from __future__ import annotations

from typing import Any, Literal
import networkx as nx

from app.narrative_models import NarrativeNode, PayoffLink, Series


class DualLayerGraphEngine:
    """In-memory dual-layer narrative graph traversal engine."""

    def __init__(self) -> None:
        self._g_true = nx.DiGraph()
        self._g_perceived = nx.DiGraph()
        self._nodes_meta: dict[str, dict[str, Any]] = {}
        self._payoffs: list[dict[str, Any]] = []

    @classmethod
    def from_series(cls, series: Series) -> "DualLayerGraphEngine":
        """Build dual-layer graph from a Series model."""
        engine = cls()

        # 1. Add all nodes
        for node in series.nodes:
            engine.add_node(
                node_id=node.id,
                true_time=node.true_time,
                perceived_index=node.perceived_index,
                episode=node.episode,
                summary=node.summary,
                entities=node.entities,
                valence=node.valence,
                excerpt_id=node.excerpt_id,
            )

        # 2. Build G_perceived presentation edges (sorted by perceived_index)
        perceived_sorted = sorted(series.nodes, key=lambda n: (n.perceived_index, n.episode))
        for i in range(len(perceived_sorted) - 1):
            engine.add_perceived_edge(perceived_sorted[i].id, perceived_sorted[i + 1].id, edge_type="presentation_flow")

        # 3. Build G_true chronological edges (sorted by true_time, ignoring None)
        timed_nodes = [n for n in series.nodes if n.true_time is not None]
        true_sorted = sorted(timed_nodes, key=lambda n: n.true_time or 0.0)
        for i in range(len(true_sorted) - 1):
            engine.add_true_edge(true_sorted[i].id, true_sorted[i + 1].id, edge_type="chronological_flow")

        # 4. Add Payoff Links
        for payoff in series.payoffs:
            engine.add_payoff(
                source_id=payoff.node_id,
                target_id=payoff.target_id,
                episode=payoff.episode,
                rationale=payoff.rationale,
                verified=payoff.verified,
            )

        return engine

    def add_node(
        self,
        node_id: str,
        true_time: float | None = None,
        perceived_index: int = 1,
        **attrs: Any,
    ) -> None:
        meta = {"node_id": node_id, "true_time": true_time, "perceived_index": perceived_index, **attrs}
        self._nodes_meta[node_id] = meta
        self._g_true.add_node(node_id, **meta)
        self._g_perceived.add_node(node_id, **meta)

    def add_true_edge(self, source_id: str, target_id: str, edge_type: str = "causal", **attrs: Any) -> None:
        self._g_true.add_edge(source_id, target_id, edge_type=edge_type, **attrs)

    def add_perceived_edge(self, source_id: str, target_id: str, edge_type: str = "presentation", **attrs: Any) -> None:
        self._g_perceived.add_edge(source_id, target_id, edge_type=edge_type, **attrs)

    def add_edge(self, source_id: str, target_id: str, edge_type: str = "causal", **attrs: Any) -> None:
        """Add edge to both true and perceived graphs."""
        self.add_true_edge(source_id, target_id, edge_type=edge_type, **attrs)
        self.add_perceived_edge(source_id, target_id, edge_type=edge_type, **attrs)

    def add_payoff(self, source_id: str, target_id: str, episode: int, rationale: str, verified: bool) -> None:
        payoff_data = {
            "source_id": source_id,
            "target_id": target_id,
            "episode": episode,
            "rationale": rationale,
            "verified": verified,
        }
        self._payoffs.append(payoff_data)
        self.add_edge(source_id, target_id, edge_type="plant_payoff", episode=episode, rationale=rationale, verified=verified)


    def get_true_graph(self) -> nx.DiGraph:
        return self._g_true

    def get_perceived_graph(self) -> nx.DiGraph:
        return self._g_perceived

    def topological_sort_true(self) -> list[str]:
        """Return nodes sorted by chronological universe truth."""
        # Sort nodes by true_time (handling None by placing at end)
        nodes = list(self._g_true.nodes())
        return sorted(nodes, key=lambda n: (self._nodes_meta.get(n, {}).get("true_time") is None, self._nodes_meta.get(n, {}).get("true_time") or 0.0))

    def topological_sort_perceived(self) -> list[str]:
        """Return nodes sorted by audience revelation order."""
        nodes = list(self._g_perceived.nodes())
        return sorted(nodes, key=lambda n: self._nodes_meta.get(n, {}).get("perceived_index", 0))

    def has_cycles(self, graph_type: Literal["true", "perceived"] = "true") -> bool:
        """Detect causal or presentation circular dependencies."""
        g = self._g_true if graph_type == "true" else self._g_perceived
        try:
            return not nx.is_directed_acyclic_graph(g)
        except Exception:
            return True

    def find_downstream_payoffs(self, node_id: str) -> list[dict[str, Any]]:
        """Find all registered and reachable payoff resolutions for a node."""
        return [p for p in self._payoffs if p["source_id"] == node_id]

    def find_contradiction_path(self, start_node_id: str, target_node_id: str) -> list[str]:
        """Find the shortest causal path connecting two contradictory nodes."""
        try:
            return list(nx.shortest_path(self._g_true, source=start_node_id, target=target_node_id))
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return []

    def entity_timeline_subgraph(self, entity_id: str) -> list[dict[str, Any]]:
        """Extract the chronological timeline of events for a specific entity."""
        matching_nodes = [
            meta for meta in self._nodes_meta.values()
            if entity_id in meta.get("entities", [])
        ]
        return sorted(matching_nodes, key=lambda m: (m.get("true_time") is None, m.get("true_time") or 0.0))
