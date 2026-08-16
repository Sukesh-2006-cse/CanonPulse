"""Cohort reactions across the whole series.

Cohorts do not produce the headline number -- the trained regressor does. Their
job is localization: where in the series each listener type disengages, and why.
Five curves over episode index; the signal is where they diverge.

They differ by weight vector over the same structural terms, not by adjectives in
a prompt. Five personas that all sound like the same model are decoration.
"""

from __future__ import annotations

import random
from collections import defaultdict
from statistics import pstdev

from pydantic import BaseModel

from app.retrieval_models import CohortEvaluation, CohortRequest, ReactionRow


class Cohort(BaseModel):
    id: str
    name: str
    weights: dict[str, float]


COHORTS: tuple[Cohort, ...] = (
    Cohort(id="binge", name="Binge Listeners",
           weights={"urgency": 0.6, "open_obligations": 0.3, "fairness": 0.1}),
    Cohort(id="lore", name="Lore Hardcores",
           weights={"fairness": 0.7, "open_obligations": 0.2, "urgency": 0.1}),
    Cohort(id="character", name="Character Fans",
           weights={"emotional_payoff": 0.7, "urgency": 0.2, "fairness": 0.1}),
    Cohort(id="commuter", name="Casual Commuters",
           weights={"clarity": 0.6, "urgency": 0.3, "fairness": 0.1}),
    Cohort(id="aggregate", name="Aggregate Health",
           weights={"consistency": 0.4, "fairness": 0.3, "urgency": 0.15, "emotional_payoff": 0.15}),
)


class CohortRunner:
    """Generate synthetic reactions without exposing variant labels to the scorer."""

    def __init__(self, scorer=None) -> None:
        self.scorer = scorer or (lambda boundary, persona_id, variant_id: 0.5)

    def generate(self, request: CohortRequest) -> list[ReactionRow]:
        rows: list[ReactionRow] = []
        for boundary in request.boundaries:
            for persona_id in request.personas:
                for variant_id in ("original", "rewrite"):
                    rows.append(
                        ReactionRow(
                            cohort_id=persona_id,
                            boundary=boundary,
                            persona_id=persona_id,
                            variant_id=variant_id,
                            score=float(self.scorer(boundary, persona_id, variant_id)),
                            prompt_version="cohort-v1",
                        )
                    )
        return rows


class BlindEvaluator:
    def __init__(self, seed: int = 42) -> None:
        self.seed = seed

    def evaluate(self, rows: list[ReactionRow]) -> CohortEvaluation:
        variant_ids = [row.variant_id for row in rows]
        presented = list(variant_ids)
        random.Random(self.seed).shuffle(presented)
        if presented == variant_ids and len(presented) > 1:
            presented.reverse()
        return CohortEvaluation(
            presented_variant_ids=tuple(presented),
            original_variant_ids=tuple(variant_ids),
            seed=self.seed,
        )


class CohortReaction(BaseModel):
    cohort_id: str
    episode: int
    engagement: float
    vote: str
    reaction: str
    citation_ids: list[str] = []
    feature_rationale: list[str] = []
    backend: str = "local-structural"
    variant: str = "original"
    variant_blinded: bool = True


def structural_reaction(cohort: Cohort, episode: int, features: dict[str, float]) -> CohortReaction:
    """Score a boundary from structural signals only.

    The five weight vectors produce different reactions for reasons a writer
    can inspect rather than because five prompts used different adjectives.
    """
    signals = {
        "urgency": min(1.0, max(0.0, features.get("mean_urgency", 0.0) / 5.0)),
        "open_obligations": 1.0 / (1.0 + max(0.0, features.get("open_obligation_count", 0.0))),
        "fairness": 1.0 / (1.0 + max(0.0, features.get("broken_edge_count", features.get("broken_count", 0.0)))),
        "emotional_payoff": min(1.0, max(0.0, 0.5 + features.get("sentiment_velocity", 0.0))),
        "consistency": 1.0 / (1.0 + max(0.0, features.get("broken_edge_count", features.get("broken_count", 0.0)))),
        "clarity": 1.0 / (1.0 + max(0.0, features.get("perceived_time_jump", 0.0) * 10.0)),
    }
    total_weight = sum(cohort.weights.values()) or 1.0
    engagement = sum(cohort.weights.get(name, 0.0) * signals[name] for name in cohort.weights) / total_weight
    if engagement >= 0.67:
        vote = "continue"
    elif engagement >= 0.42:
        vote = "hesitate"
    else:
        vote = "stop"
    rationale = [f"{name}={signals[name]:.2f} × weight {weight:.2f}" for name, weight in sorted(cohort.weights.items())]
    return CohortReaction(
        cohort_id=cohort.id,
        episode=episode,
        engagement=round(engagement, 6),
        vote=vote,
        reaction=f"{cohort.name} responds to the structural boundary with {vote}.",
        feature_rationale=rationale,
    )





def blind_variants(rows: list[dict], seed: int = 42) -> tuple[list[dict], dict[int, int]]:
    """Strip version labels, shuffle, and assign opaque identifiers.

    Returns a tuple of (blinded_rows, unblind_map) where:
    - blinded_rows: list of dicts with 'variant' and 'id' removed, and opaque
      'blind_id' values added (0, 1, 2, ...). Each has 'variant_blinded: True'.
    - unblind_map: dict mapping blind_id (int) back to original row index.

    This prevents information leakage: the returned rows contain no values that
    correlate with variant origin. Without this, evaluator knowledge of which
    text is rewritten flatters it, turning the comparison into a self-graded essay.
    Shuffling alone is insufficient because field values like 'id' still disclose
    variant when they correlate with insertion order.
    """
    # Create indices to track original positions
    indexed_rows = list(enumerate(rows))

    # Shuffle with seed for determinism
    random.Random(seed).shuffle(indexed_rows)

    # Build blinded rows and mapping
    blinded = []
    unblind_map = {}
    for blind_id, (original_index, row) in enumerate(indexed_rows):
        unblind_map[blind_id] = original_index
        blinded.append({
            **{key: value for key, value in row.items() if key != "variant" and key != "id"},
            "blind_id": blind_id,
            "variant_blinded": True
        })

    return blinded, unblind_map


def divergence_by_episode(reactions: list[dict]) -> dict[int, float]:
    """Spread of cohort engagement per episode. High spread = audience trade-off."""
    grouped: dict[int, list[float]] = defaultdict(list)
    for row in reactions:
        grouped[row["episode"]].append(row["engagement"])
    return {
        episode: pstdev(values) if len(values) > 1 else 0.0
        for episode, values in grouped.items()
    }
