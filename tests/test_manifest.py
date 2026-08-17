from __future__ import annotations

from pathlib import Path

from app.manifest import DiscriminationReport, ManifestItem, load_manifest, score_discrimination
from app.narrative_models import LedgerEntry, ResolvedEntry

MANIFEST_PATH = Path("data/manifest/alice_in_wonderland.yaml")


def resolved(entry_id: str, state: str, overdue: bool = False) -> ResolvedEntry:
    return ResolvedEntry(
        entry=LedgerEntry(id=entry_id, kind="contradiction", description="", episodes=[1]),
        state=state,
        overdue=overdue,
    )


def test_manifest_has_all_four_defect_classes():
    manifest = load_manifest(MANIFEST_PATH)
    classes = {item.defect_class for item in manifest.items}
    assert classes == {
        "accidental_hole",
        "intentional_twist",
        "outstanding_obligation",
        "clean_control",
    }
    assert len(manifest.items) >= 6


def test_perfect_agreement_scores_high_but_is_never_asserted_equal_to_one():
    manifest = load_manifest(MANIFEST_PATH)
    perfect = [resolved(item.defect_id, item.expected_state) for item in manifest.items]
    report = score_discrimination(manifest, perfect)
    assert report.recall > 0.9
    assert report.precision > 0.9
    assert report.false_positive_rate < 0.1


def test_protecting_a_real_hole_costs_recall():
    manifest = load_manifest(MANIFEST_PATH)
    sloppy = [
        resolved(item.defect_id, "suspended" if item.defect_class == "accidental_hole" else item.expected_state)
        for item in manifest.items
    ]
    report = score_discrimination(manifest, sloppy)
    assert report.holes_caught == 0
    assert report.recall == 0.0


def test_flagging_a_twist_costs_precision():
    manifest = load_manifest(MANIFEST_PATH)
    naive = [
        resolved(item.defect_id, "broken" if item.defect_class == "intentional_twist" else item.expected_state)
        for item in manifest.items
    ]
    report = score_discrimination(manifest, naive)
    assert report.twists_protected == 0
    assert report.precision < 0.6


def test_baseline_flag_count_exceeds_real_defects():
    """The gap between these numbers is the demo."""
    manifest = load_manifest(MANIFEST_PATH)
    perfect = [resolved(item.defect_id, item.expected_state) for item in manifest.items]
    report = score_discrimination(manifest, perfect)
    assert report.baseline_flags > report.holes_caught


def test_baseline_flags_count_the_resolved_graph_not_the_answer_key():
    """An extracted report must not inherit the authored graph's flag count."""
    manifest = load_manifest(MANIFEST_PATH)
    report = score_discrimination(manifest, [resolved("spurious-1", "broken")])
    assert report.baseline_flags == 1


def test_spurious_broken_entries_outside_the_manifest_cost_precision():
    """An extractor hallucinating contradictions must not report perfect precision.

    Precision has to be measured over everything the resolver calls broken, not
    just the subset that happens to land on a manifest item -- otherwise an
    extractor could emit dozens of spurious contradictions and still show
    precision 1.0.
    """
    manifest = load_manifest(MANIFEST_PATH)
    perfect = [resolved(item.defect_id, item.expected_state) for item in manifest.items]
    clean_precision = score_discrimination(manifest, perfect).precision

    with_spurious = [*perfect, resolved("spurious-1", "broken"), resolved("spurious-2", "broken")]
    report = score_discrimination(manifest, with_spurious)
    assert report.false_positives == 2
    assert report.precision < clean_precision


def test_clean_control_flagged_as_suspended_still_counts_as_a_false_positive():
    """A clean control isn't only mis-scored by being called broken.

    Wrongly suspending (or otherwise not paying off) an ordinary promise is just
    as much a false read as flagging it broken, so it must move
    false_positive_rate too.
    """
    manifest = load_manifest(MANIFEST_PATH)
    tampered = [
        resolved(item.defect_id, "suspended" if item.defect_class == "clean_control" else item.expected_state)
        for item in manifest.items
    ]
    report = score_discrimination(manifest, tampered)
    assert report.false_positive_rate > 0.0


def test_outstanding_obligations_are_scored_not_ignored():
    """expected_state on an outstanding_obligation item must not be dead code."""
    manifest = load_manifest(MANIFEST_PATH)
    perfect = [resolved(item.defect_id, item.expected_state) for item in manifest.items]
    report = score_discrimination(manifest, perfect)
    assert report.obligations_total == 6
    assert report.obligations_tracked == report.obligations_total

    wrong = [
        resolved(item.defect_id, "paid" if item.defect_class == "outstanding_obligation" else item.expected_state)
        for item in manifest.items
    ]
    broken_report = score_discrimination(manifest, wrong)
    assert broken_report.obligations_tracked == 0
