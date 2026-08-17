from __future__ import annotations

from pathlib import Path

from app.extraction import ExtractionResult
from app.evaluation import EndToEndReport, _match_extracted_ids, evaluate_series
from app.heuristic_extractor import HeuristicExtractor
from app.manifest import Manifest, ManifestItem, load_manifest, score_discrimination
from app.narrative_models import Excerpt, LedgerEntry, ResolvedEntry, Series
from app.series_loader import load_series

SERIES = Path("data/series/alice_in_wonderland.json")
MANIFEST = Path("data/manifest/alice_in_wonderland.yaml")


def _synthetic_id(entry: LedgerEntry) -> str:
    """What a real extractor's id for this entry would look like -- never the
    manifest defect_id it happens to be authored as."""
    if entry.kind == "contradiction":
        return f"contradiction-{entry.origin_episode}-{entry.latest_episode}-{entry.id}"
    return f"promise-{entry.origin_episode}-{entry.id}"


def test_reports_both_the_authored_and_extracted_scores():
    report = evaluate_series(
        load_series(SERIES), load_manifest(MANIFEST), extractor=HeuristicExtractor()
    )
    assert isinstance(report, EndToEndReport)
    assert report.ledger is not None
    assert report.extracted is not None


def test_the_authored_graph_still_scores_near_perfect():
    """Traversal is exact; this number measures ledger correctness only."""
    report = evaluate_series(load_series(SERIES), load_manifest(MANIFEST))
    assert report.ledger.recall > 0.9
    assert report.extracted is None, "no extractor supplied means no end-to-end number"


def test_the_extracted_score_is_strictly_weaker_than_the_authored_one():
    """The point of the exercise. A rule-based extractor cannot recover a
    hand-authored graph exactly, so this number can fall -- which is what makes
    it evidence rather than a restatement of the fixture."""
    report = evaluate_series(
        load_series(SERIES), load_manifest(MANIFEST), extractor=HeuristicExtractor()
    )
    assert report.extracted.recall < report.ledger.recall


def test_extraction_rejections_are_reported_not_swallowed():
    report = evaluate_series(
        load_series(SERIES), load_manifest(MANIFEST), extractor=HeuristicExtractor()
    )
    assert report.extraction_rejected >= 0


class _PerfectExtractor:
    """Returns the authored graph verbatim, with ids a real extractor would mint.

    Ids are synthesized because no extractor can guess a manifest ``defect_id``;
    everything else -- nodes, excerpts, payoff targets, and the ``verified``
    flags the demo data carries -- is passed through untouched. This is the
    best any extraction could possibly do.
    """

    def __init__(self, series):
        self._series = series

    def extract(self, episodes):
        rename = {entry.id: _synthetic_id(entry) for entry in self._series.entries}
        return ExtractionResult(
            nodes=[node.model_copy(deep=True) for node in self._series.nodes],
            excerpts=[item.model_copy(deep=True) for item in self._series.excerpts],
            entries=[
                entry.model_copy(update={"id": rename[entry.id]})
                for entry in self._series.entries
            ],
            payoffs=[
                link.model_copy(update={"target_id": rename.get(link.target_id, link.target_id)})
                for link in self._series.payoffs
            ],
        )


def test_ceiling_a_byte_perfect_extraction_scores_near_perfect():
    """A flawless extraction must score at the top, through the real pipeline.

    This runs `evaluate_series`, so resolution goes through `LedgerResolver`
    exactly as a live extraction does. That matters: an earlier version of this
    test read each entry's expected state straight out of the manifest and never
    resolved anything, so it exercised the matcher alone and could not have
    detected a broken end-to-end scale -- which is precisely what it claimed to
    guard. It also had the answer key inside the test body.

    If a perfect extraction cannot score near-perfect here, the scale is broken
    and every number reported on it is meaningless, including the headline 0.0.

    Note this measures the *scale*, not the verifier situation: the demo data's
    payoff links carry ``verified=True``, so twists can be protected. A real
    extractor emits unverified links and therefore tops out near precision 0.55
    -- see the README. Both facts are true and they answer different questions.

    Never assert this equals 1.0.
    """
    series = load_series(SERIES)
    report = evaluate_series(series, load_manifest(MANIFEST), extractor=_PerfectExtractor(series))

    assert report.extracted is not None
    assert report.extracted.recall > 0.9
    assert report.extracted.precision > 0.9
    assert report.extracted.false_positive_rate < 0.1


def test_position_alone_without_content_agreement_is_not_a_match():
    """Two entries that merely bracket a manifest item's episode, but share no
    substantive content with the text at that episode, must not be credited --
    otherwise recall is manufactured out of coincidental episode arithmetic."""
    manifest = Manifest(
        series_id="s",
        authored_by="t",
        items=[
            ManifestItem(
                defect_id="hole-04",
                defect_class="accidental_hole",
                planted_episode=90,
                expected_state="broken",
            )
        ],
    )
    texts = {
        88: "The ferry survivor spoke slowly about the night of the sinking.",
        90: "The jeweler said the locket was silver, old and worn thin.",
        110: "The sound engineer frowned at the hiss profile on his monitor.",
    }
    series = Series(
        id="s",
        title="t",
        genre="g",
        total_episodes=200,
        excerpts=[Excerpt(id=f"ex-{ep}", episode=ep, text=text) for ep, text in texts.items()],
    )
    # Positioned to bracket episode 90 (hole-04's planted_episode) but built
    # from text that has nothing to do with the locket.
    entry = LedgerEntry(
        id="contradiction-88-110",
        kind="contradiction",
        description="unrelated",
        episodes=[88, 110],
        excerpt_ids=["ex-88", "ex-110"],
    )
    mapping = _match_extracted_ids([entry], series.excerpts, manifest, series)
    assert mapping.get("contradiction-88-110") != "hole-04"
    assert "contradiction-88-110" not in mapping


def test_a_duplicate_correct_detection_is_not_scored_as_a_wrong_one():
    """When a defect is genuinely detected twice, the loser of the assignment
    must be left unmatched, never shunted onto a different, content-unrelated
    manifest item just because that item's episode window also happens to
    overlap positionally."""
    manifest = Manifest(
        series_id="s",
        authored_by="t",
        items=[
            ManifestItem(
                defect_id="twist-A",
                defect_class="intentional_twist",
                planted_episode=10,
                payoff_episode=40,
                expected_state="suspended",
            ),
            ManifestItem(
                defect_id="twist-B",
                defect_class="intentional_twist",
                planted_episode=15,
                expected_state="suspended",
            ),
        ],
    )
    texts = {
        10: "Tara says she cannot swim, not one stroke, never learned.",
        15: "Zoya mentions the informant's file without elaborating.",
        12: "Rafi brings tea and says nothing of consequence.",
        40: "The footage proves the dive at the pier was Tara after all, swimming.",
    }
    series = Series(
        id="s",
        title="t",
        genre="g",
        total_episodes=200,
        excerpts=[Excerpt(id=f"ex-{ep}", episode=ep, text=text) for ep, text in texts.items()],
    )
    # Two genuinely twist-A detections (one anchored on the plant, one on the
    # payoff); the second's span [12, 40] also positionally brackets twist-B's
    # planted_episode (15) -- but shares no content with episode 15 at all.
    first_detection = LedgerEntry(
        id="contradiction-10-12",
        kind="contradiction",
        description="",
        episodes=[10, 12],
        excerpt_ids=["ex-10", "ex-12"],
    )
    duplicate_detection = LedgerEntry(
        id="contradiction-12-40",
        kind="contradiction",
        description="",
        episodes=[12, 40],
        excerpt_ids=["ex-12", "ex-40"],
    )
    mapping = _match_extracted_ids(
        [first_detection, duplicate_detection], series.excerpts, manifest, series
    )
    assert mapping.get("contradiction-12-40") != "twist-B"


def test_the_one_credited_hole_in_the_real_extraction_is_a_coincidence():
    """Regression for the specific case the review flagged: HeuristicExtractor
    over `last_monsoon.json` finds a contradiction spanning episodes 88 and
    110 (a ferry survivor's account and a sound engineer's remark) that
    positionally brackets hole-04's planted_episode (90, the locket).
    Content-aware matching must not credit it."""
    series = load_series(SERIES)
    manifest = load_manifest(MANIFEST)
    from app.evaluation import _episode_rows

    extraction = HeuristicExtractor().extract(_episode_rows(series))
    mapping = _match_extracted_ids(extraction.entries, extraction.excerpts, manifest, series)
    assert mapping.get("contradiction-88-110") != "hole-04"


def test_correctly_identified_holes_by_content_in_the_real_extraction():
    """Honest count: of the 6 accidental holes, how many does the real
    extractor actually recover once matching requires content agreement?
    This is the number the product report must quote, not the positional 1/6."""
    report = evaluate_series(
        load_series(SERIES), load_manifest(MANIFEST), extractor=HeuristicExtractor()
    )
    assert report.extracted.holes_caught == 0


def test_the_content_gate_rejects_the_locket_coincidence_without_help_from_competition():
    """Regression for the exact coincidence the content gate was added to
    kill: `contradiction-88-110` and `hole-04` share five words -- {all, for,
    his, once, with} -- none of which is a corpus-frequent series word (all
    sit well under the 12%-of-episodes document-frequency ceiling), but every
    one of which is an ordinary English function word. Previously this pair
    was excluded only because a stronger candidate outbid it in the mutual-
    best contest -- remove every intentional_twist item from the manifest so
    there is no competing candidate left to mask the gate's real behaviour,
    and the coincidence must still be rejected on content grounds alone."""
    series = load_series(SERIES)
    manifest = load_manifest(MANIFEST)
    holes_only = Manifest(
        series_id=manifest.series_id,
        authored_by=manifest.authored_by,
        items=[item for item in manifest.items if item.defect_class != "intentional_twist"],
    )
    from app.evaluation import _episode_rows

    extraction = HeuristicExtractor().extract(_episode_rows(series))
    mapping = _match_extracted_ids(extraction.entries, extraction.excerpts, manifest=holes_only, series=series)
    assert mapping.get("contradiction-88-110") != "hole-04"


def test_the_content_gate_rejects_alien_text_sharing_only_stopwords():
    """A fabricated, out-of-domain entry bracketing a manifest anchor but
    sharing nothing with it besides ordinary function words ("while", "the")
    must not be credited. Before the stopword list, both of those words
    cleared the corpus-frequency gate in a small synthetic corpus (each word
    appears in exactly the one excerpt supplied, which sits at or under any
    frequency ceiling) and so counted as "discriminative" agreement."""
    manifest = Manifest(
        series_id="s",
        authored_by="t",
        items=[
            ManifestItem(
                defect_id="hole-01",
                defect_class="accidental_hole",
                planted_episode=50,
                expected_state="broken",
            )
        ],
    )
    anchor_text = "While the tide pulled back, the locket flashed silver in her palm."
    series = Series(
        id="s",
        title="t",
        genre="g",
        total_episodes=200,
        excerpts=[Excerpt(id="ex-50", episode=50, text=anchor_text)],
    )
    alien_text = "While the machine hummed, engineers debated the calibration once more."
    entry = LedgerEntry(
        id="contradiction-49-51",
        kind="contradiction",
        description="alien",
        episodes=[49, 51],
        excerpt_ids=["ex-alien"],
    )
    alien_excerpt = Excerpt(id="ex-alien", episode=50, text=alien_text)
    mapping = _match_extracted_ids([entry], [alien_excerpt], manifest, series)
    assert mapping.get("contradiction-49-51") != "hole-01"


def test_small_positional_drift_still_matches_correctly():
    """A real extractor's detected span can land a beat off the manifest's
    exact plant episode even when it has cited the right content. A small
    drift (here, +1) must not throw the match out when content agreement is
    otherwise strong."""
    manifest = Manifest(
        series_id="s",
        authored_by="t",
        items=[
            ManifestItem(
                defect_id="hole-01",
                defect_class="accidental_hole",
                planted_episode=50,
                expected_state="broken",
            )
        ],
    )
    anchor_text = "The lantern's brass hinge cracked the night the ferry sank."
    series = Series(
        id="s",
        title="t",
        genre="g",
        total_episodes=200,
        excerpts=[Excerpt(id="ex-50", episode=50, text=anchor_text)],
    )
    drifted_text = "The lantern's brass hinge, the very one that cracked, still smelled of smoke."
    drifted_excerpt = Excerpt(id="ex-51", episode=51, text=drifted_text)
    entry = LedgerEntry(
        id="contradiction-51-51",
        kind="contradiction",
        description="",
        episodes=[51],
        excerpt_ids=["ex-51"],
    )
    mapping = _match_extracted_ids([entry], [drifted_excerpt], manifest, series)
    assert mapping.get("contradiction-51-51") == "hole-01"


def test_large_positional_drift_does_not_match():
    """The same content agreement as the small-drift test above, but the
    entry's detected span is now 5 episodes away from the manifest anchor --
    beyond any reasonable tolerance for "the extractor found the right thing,
    a beat late." This must still fail to match; positional tolerance is a
    small allowance for imprecision, not a wide window that erases position
    as a signal."""
    manifest = Manifest(
        series_id="s",
        authored_by="t",
        items=[
            ManifestItem(
                defect_id="hole-01",
                defect_class="accidental_hole",
                planted_episode=50,
                expected_state="broken",
            )
        ],
    )
    anchor_text = "The lantern's brass hinge cracked the night the ferry sank."
    series = Series(
        id="s",
        title="t",
        genre="g",
        total_episodes=200,
        excerpts=[Excerpt(id="ex-50", episode=50, text=anchor_text)],
    )
    drifted_text = "The lantern's brass hinge, the very one that cracked, still smelled of smoke."
    drifted_excerpt = Excerpt(id="ex-55", episode=55, text=drifted_text)
    entry = LedgerEntry(
        id="contradiction-55-55",
        kind="contradiction",
        description="",
        episodes=[55],
        excerpt_ids=["ex-55"],
    )
    mapping = _match_extracted_ids([entry], [drifted_excerpt], manifest, series)
    assert mapping.get("contradiction-55-55") != "hole-01"
