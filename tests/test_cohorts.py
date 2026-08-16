from __future__ import annotations

from app.cohorts import COHORTS, BlindEvaluator, CohortRunner, blind_variants, divergence_by_episode, structural_reaction
from app.retrieval_models import CohortRequest


def test_five_cohorts_weight_different_things():
    assert len(COHORTS) == 5
    weights = [tuple(sorted(cohort.weights.items())) for cohort in COHORTS]
    assert len(set(weights)) == 5, "cohorts must differ structurally, not just in prose"


def test_blinding_strips_the_variant_label():
    rows = [
        {"id": 1, "variant": "original", "text": "a"},
        {"id": 2, "variant": "rewrite", "text": "b"},
    ]
    blinded, unblind_map = blind_variants(rows, seed=1)

    # Verify leak is closed: no original ids or variant key that could disclose variant
    assert all("variant" not in row for row in blinded), "variant key must be stripped"
    assert all("id" not in row for row in blinded), "original id must be removed (blocks value-based leak)"
    assert all(row["variant_blinded"] is True for row in blinded), "mark rows as blinded"

    # Verify opaque blind_ids have no information content
    blind_ids = {row["blind_id"] for row in blinded}
    assert blind_ids == {0, 1}, "opaque sequential blind_ids required"

    # Verify unblind map allows recovery of original row order
    assert len(unblind_map) == 2, "unblind_map must cover all rows"
    assert set(unblind_map.keys()) == {0, 1}, "blind_ids must be 0..n-1"
    assert set(unblind_map.values()) == {0, 1}, "must map to all original indices"


def test_blind_variants_round_trip():
    """Verify that unblind_map allows caller to recover original row identity."""
    rows = [
        {"id": 1, "variant": "original", "text": "a", "score": 0.5},
        {"id": 2, "variant": "rewrite", "text": "b", "score": 0.7},
        {"id": 3, "variant": "original", "text": "c", "score": 0.6},
    ]
    blinded, unblind_map = blind_variants(rows, seed=42)

    # Caller can reconstruct which original row corresponds to each blinded row
    for blinded_row in blinded:
        original_idx = unblind_map[blinded_row["blind_id"]]
        original_row = rows[original_idx]
        # Text and score are preserved for evaluation
        assert blinded_row["text"] == original_row["text"]
        assert blinded_row["score"] == original_row["score"]


def test_divergence_finds_where_cohorts_disagree():
    """A scene everyone dislikes is weak. A scene one cohort dislikes is a
    trade-off the writer should make deliberately."""
    reactions = [
        {"episode": 12, "cohort_id": "mystery", "engagement": 0.2},
        {"episode": 12, "cohort_id": "binge", "engagement": 0.9},
        {"episode": 13, "cohort_id": "mystery", "engagement": 0.8},
        {"episode": 13, "cohort_id": "binge", "engagement": 0.85},
    ]
    divergence = divergence_by_episode(reactions)
    assert divergence[12] > divergence[13]


def test_structural_reactions_change_with_weighted_features_not_prose_profiles():
    features = {
        "open_obligation_count": 4,
        "mean_urgency": 4,
        "broken_count": 0,
        "overdue_count": 1,
        "sentiment_velocity": 0.6,
        "perceived_time_jump": 0.0,
    }
    reactions = [structural_reaction(cohort, 12, features) for cohort in COHORTS]
    assert len({round(reaction.engagement, 6) for reaction in reactions}) >= 3
    assert all(reaction.feature_rationale for reaction in reactions)
    assert all(reaction.backend == "local-structural" for reaction in reactions)


def test_blind_evaluator_is_reproducible_and_strips_variant_labels():
    request = CohortRequest(series_id="s", version_id="v1", boundaries=(1, 2), personas=("p1",), seed=11)
    rows = CohortRunner(lambda boundary, persona_id, variant_id: 0.4).generate(request)
    first = BlindEvaluator(seed=11).evaluate(rows)
    second = BlindEvaluator(seed=11).evaluate(rows)
    assert first == second
    assert first.presented_variant_ids != first.original_variant_ids
    assert first.synthetic is True
