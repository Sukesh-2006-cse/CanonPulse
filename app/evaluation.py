"""Two separable numbers, not one hollow one.

`data/series/last_monsoon.json` ships with its `entries` and `payoffs`
pre-populated by the same script that was conditioned on the manifest answer
key. Resolving *those* against the manifest measures nothing but that graph
traversal is exact -- it never exercises extraction, because extraction never
ran. This module reports that number honestly (as ``ledger``) and, when an
extractor is supplied, a second number (``extracted``) that rebuilds the graph
from episode text first and only then resolves and scores it. ``extracted`` is
the number that can fall, which is what makes it evidence.

KNOWN LIMITATION on how strong the ``extracted`` number is allowed to look:
`_episode_rows` feeds the extractor ``node.summary`` alongside the excerpt
text, and that summary is generator output that was itself conditioned on the
manifest -- it sometimes states a defect outright (e.g. episode 60's summary
narrates "Despite swearing weeks ago that she cannot swim, Tara dives...").
So "derived from episode text" is weaker than it sounds: part of the input is
answer key, not blind prose. This does not make the extracted number
worthless -- the extractor still has to notice and correctly pair the
language -- but it means a higher ``extracted`` score is not proof the
extractor would do as well on prose that was not manifest-shaped.

THE MATCHING RULE (the one load-bearing judgement here -- argue with this, not
with the code):

Extracted `LedgerEntry` ids are synthetic (``contradiction-12-88``,
``promise-30-obligation``, ...); they never equal a manifest `defect_id`, so
`score_discrimination` cannot join the two by id. An extracted entry is
credited with recovering manifest item ``X`` only when all three hold:

  1. Kind compatibility. ``contradiction`` entries may only match
     ``accidental_hole`` or ``intentional_twist`` items; ``promise`` entries
     may only match ``outstanding_obligation`` or ``clean_control`` items --
     a promise can never "recover" a plot hole no matter where it falls.

  2. Position, with a small tolerance. One of ``X``'s own anchor episodes
     falls inside the entry's detected span, widened by
     ``_POSITION_TOLERANCE`` episodes on either end (``entry.origin_episode -
     _POSITION_TOLERANCE <= anchor <= entry.latest_episode +
     _POSITION_TOLERANCE``). The anchor is ``X.planted_episode``, and for an
     ``intentional_twist`` also ``X.payoff_episode`` when present -- a twist
     is defined by *both* ends (the plant and the reveal that later resolves
     it), and a real detection may bracket either one depending on which pair
     of episodes the extractor's own rules happened to pair up. An earlier
     version of this rule used exact containment with zero tolerance, on the
     reasoning that a wider window would let unrelated things match by
     coincidence. That reasoning predates content agreement (below) doing any
     work: with exact containment, a byte-perfect extraction whose episode
     numbers were uniformly off by one collapsed from 20/20 correct matches
     to 2/20 (recall 1.000 -> 0.333) with content agreement carrying none of
     the load, because position rejected the pair before content was ever
     consulted. Now that every candidate must also clear the content gate,
     a couple of episodes of positional slack means "the right thing, found
     a beat late" rather than "something unrelated happened to be nearby."

  3. Content agreement. Position alone is not evidence: two *unrelated*
     contradictions -- different characters, different threads -- can share
     nothing but the coincidence that one's planted episode falls between the
     other's detected span. (This happened for real: `HeuristicExtractor`
     over this series produces a contradiction spanning episodes 88 and 110 --
     a ferry survivor's account and a sound engineer's remark -- that used to
     get credited with hole-04, a locket described brass at episode 2 and
     silver at episode 90, purely because 88 <= 90 <= 110. That pair does
     *not* "share nothing content-wise", as an earlier version of this
     docstring claimed: it shares five words -- "all", "for", "his", "once",
     "with" -- every one of them an ordinary English function word, none of
     them evidence the two passages are about the same thing. It was excluded
     from the final report only because a stronger, unrelated candidate
     outbid it in the mutual-best contest below, not because the content gate
     itself caught it; remove the competing candidate and the coincidence
     comes straight back.) So a match additionally requires the entry and the
     manifest item to share at least ``_MIN_SHARED_DISCRIMINATIVE_WORDS``
     *discriminative* words: lowercase content words drawn from the entry's
     own cited excerpts, intersected with words drawn from the series'
     excerpts at ``X``'s own anchor episode(s), after discarding (a) words
     common enough across the whole series (character names who narrate
     constantly, recurring nouns) to carry no distinguishing signal on their
     own, and (b) ordinary English stopwords (``_STOPWORDS``), which a
     corpus-frequency ceiling alone cannot catch -- a word can be common in
     English generally while still being rare enough in a 220-episode corpus
     to look "discriminative" by frequency alone. Sharing "Asha" -- present
     in a third of this series' episodes -- proves nothing; neither does
     sharing "his" or "once", however rare they are in this particular
     corpus. Sharing "silver" or "locket" does. Requiring two independent
     discriminative words rather than one is a second, orthogonal safeguard:
     it makes a single unlucky content-word coincidence far less likely to
     survive on its own, on top of (not instead of) the stopword and
     frequency filters.

Assignment: matching is a **stable, order-independent one-to-one assignment**,
not first-come-first-served. Every kind-compatible, position-valid,
content-agreeing (entry, item) pair is a candidate, weighted by the *overlap
coefficient* of the two word sets (shared words / the smaller set's size), not
the raw shared-word count -- a wide entry citing two full episodes of prose
would otherwise out-count a small, precise one just by having a bigger bag of
words to coincidentally share. An entry is only matched to the item that is
its highest-weight candidate *and* for which that entry is, in turn, the
item's own highest-weight candidate (ties broken by id, deterministically) --
i.e. every match is each side's mutual best. This is what stops a genuine second
detection of an already-claimed item from being silently reassigned to a
different, merely nearby item: previously, greedy first-come processing let a
duplicate, correct detection of twist-02 get shunted onto twist-04 (because
twist-02 was already claimed and twist-04's planted episode happened to also
fall in the duplicate's span), which then resolved ``broken`` and counted as
a false positive against a twist it never actually touched. Under mutual-best
matching that duplicate is simply left unmatched -- an honest extra flag, not
a wrong attribution.

A matched entry is not automatically scored as a hit: it is only *renamed* to
the manifest's `defect_id` before scoring, so `score_discrimination`'s
existing precision/recall/false-positive logic runs unchanged on top of it.
Whether it then counts as recovered still depends on the state the resolver
assigned it -- and over this series, 0 of 5 twists ever resolve `suspended`,
for a mix of two distinct reasons, not the single one an earlier version of
this docstring claimed ("every extracted `PayoffLink` is `verified=False`, so
none can protect a contradiction"). That statement is true of
`HeuristicExtractor` but is not what is actually deciding this result for most
of these twists. The real, per-twist breakdown: 2 of the 5 (twist-03,
twist-04) are never located at all -- no contradiction entry's span even
brackets their episodes with content agreement, so there is nothing to
resolve one way or the other. Of the 3 that are located, 2 (twist-02,
twist-05) get no `PayoffLink` emitted for them by the extractor at all --
`HeuristicExtractor`'s payoff rule never finds a resolution-language episode
whose salient words intersect theirs, so again there is no link to verify or
distrust. Only the third (twist-01) actually reaches the point this
docstring used to describe: a real payoff link is extracted for it, and it is
the `verified=False` default that stops it from protecting the contradiction.
Re-running with a verifier that trusts every extracted link confirms this
split -- it raises `twists_protected` from 0 to exactly 1, not to 5, because
verification was only ever the bottleneck for one of the five. (This module
does not ship or call such a verifier; the check above was run once, by hand,
to confirm which cause was operative, not to change what gets scored.)

Also worth naming plainly: ``obligations_tracked`` in the extracted report is
not a strong extraction-quality signal. 97 of the 101 entries
`HeuristicExtractor` emits over this series are promises, and the large
majority of those fire on nothing more specific than "the episode's text
contains a question mark". Promise spans are single-episode, so the position
containment above collapses to exact episode equality -- there is no
imprecision left for content agreement to filter out. `obligations_tracked`
is close to free; it should not be read as evidence the extractor understands
obligations.
"""

from __future__ import annotations

import re
from collections import defaultdict

from pydantic import BaseModel

from app.extraction import Extractor
from app.ledger import LedgerResolver
from app.manifest import DiscriminationReport, Manifest, ManifestItem, score_discrimination
from app.narrative_models import Excerpt, LedgerEntry, ResolvedEntry, Series

_KIND_TO_MANIFEST_CLASSES: dict[str, set[str]] = {
    "contradiction": {"accidental_hole", "intentional_twist"},
    "promise": {"outstanding_obligation", "clean_control"},
}

_WORD_PATTERN = re.compile(r"[A-Za-z']+")
# A word appearing in more than this fraction of the series' episodes (e.g. a
# narrator's own name, or "rain" in a monsoon-set series) carries no
# distinguishing power for matching -- it would let a match manufacture
# itself out of the two texts merely being about the same series.
_COMMON_WORD_FRACTION = 0.12

# Ordinary function words (articles, pronouns, prepositions, auxiliaries,
# conjunctions, contractions) that are "discriminative" only by the corpus-
# frequency test above -- with 220 short excerpts, the frequency ceiling is
# ~26 documents, and words like "while", "once" or "his" are common enough in
# ordinary prose to sit under that ceiling without ever meaning anything.
# Measured: two random unrelated episode excerpts share at least one such
# word 14% of the time (42/300 probes); a fabricated alien-domain paragraph
# ("Quantum lattice compilers...") shared only "while" with 20 real anchors
# and would otherwise have passed the gate at every single one. No document-
# frequency threshold can fix this because these words are frequent in
# English generally, not in this series specifically -- some of them (e.g.
# "his", at 7/220 episodes) are individually *rare enough* in this corpus to
# clear a frequency ceiling entirely. They have to be named directly.
_STOPWORDS: frozenset[str] = frozenset(
    {
        "a", "about", "above", "after", "again", "against", "all", "am", "an",
        "and", "any", "are", "aren't", "as", "at", "be", "because", "been",
        "before", "being", "below", "between", "both", "but", "by", "can",
        "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does",
        "doesn't", "doing", "don't", "down", "during", "each", "few", "for",
        "from", "further", "had", "hadn't", "has", "hasn't", "have",
        "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
        "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
        "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
        "it", "it's", "its", "itself", "let's", "me", "more", "most",
        "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on",
        "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
        "out", "over", "own", "said", "same", "shan't", "she", "she'd",
        "she'll", "she's", "should", "shouldn't", "so", "some", "such",
        "than", "that", "that's", "the", "their", "theirs", "them",
        "themselves", "then", "there", "there's", "these", "they", "they'd",
        "they'll", "they're", "they've", "this", "those", "through", "to",
        "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd",
        "we'll", "we're", "we've", "went", "were", "weren't", "what", "what's",
        "when", "when's", "where", "where's", "which", "while", "who",
        "who's", "whom", "why", "why's", "will", "with", "won't", "would",
        "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
        "yours", "yourself", "yourselves",
    }
)

# Sharing exactly one discriminative word is still weak evidence at this
# corpus's scale: `contradiction-88-110` and `hole-04` share five
# after-stopword words purely by chance (`{all, for, his, once, with}` before
# the stopword list above removes them); requiring a second, independent word
# of agreement makes a single unlucky coincidence far less likely to survive
# on its own, on top of (not instead of) the stopword and frequency filters.
_MIN_SHARED_DISCRIMINATIVE_WORDS = 2

# A real extractor's own episode-span detection is imprecise by a episode or
# two even when it has correctly identified the right piece of content (its
# rules pick the nearest sentence boundary, not the manifest's exact plant
# line). Exact containment made that imprecision fatal: drifting every
# detected episode number by +1 collapsed a byte-perfect extraction's recall
# from 1.000 to 0.333, with content agreement carrying none of the load
# because it was never consulted -- position alone threw the match out first.
# Now that every candidate must *also* clear the content gate above, a small
# amount of positional slack no longer means "two unrelated things happened
# to land near each other" -- it means "the right thing, off by a beat."
_POSITION_TOLERANCE = 2


class EndToEndReport(BaseModel):
    """Both numbers side by side. ``extracted`` is ``None`` iff no extractor
    was supplied -- callers must not accidentally compare a real end-to-end
    number against a stand-in."""

    ledger: DiscriminationReport
    extracted: DiscriminationReport | None = None
    extraction_rejected: int = 0


def _episode_rows(series: Series) -> list[dict]:
    """Build the extractor's input from episode prose only.

    **Excerpts only. Never ``node.summary``.** Summaries are generator output
    conditioned on the defect manifest, and they frequently state a defect
    outright ("Despite swearing weeks ago that she cannot swim, Tara dives").
    Feeding them to the extractor hands it the answer key.

    That is not hypothetical. When summaries were included, seven of the nine
    promise-class manifest anchors had their promise language *only* in the
    summary and none in the prose -- so ``false_positive_rate`` and
    ``obligations_tracked`` were being manufactured from the manifest rather
    than measured: 1.0 and 6/6 with summaries, 0.0 and 2/6 without. The
    contradiction detections were byte-identical either way, so the headline
    recall and precision never depended on the leak; two numbers reported
    beside them did.

    A metric derived from the answer key cannot fail, and a metric that cannot
    fail is not evidence. This is the fourth time that defect has surfaced in
    this project in a different disguise -- see SESSION_HANDOFF.md.
    """
    return [
        {"episode": excerpt.episode, "synopsis": excerpt.text}
        for excerpt in sorted(series.excerpts, key=lambda item: item.episode)
    ]


def _content_words(text: str) -> set[str]:
    """Lowercase content-bearing tokens (len > 2), no coreference, no stemming.

    Deliberately crude bag-of-words -- it exists only to gate a position match
    on *some* shared content, not to do real similarity scoring.
    """
    return {match.lower() for match in _WORD_PATTERN.findall(text) if len(match) > 2}


def _document_frequencies(series: Series) -> dict[str, int]:
    """How many of the series' own episodes each lowercase word appears in."""
    freq: dict[str, int] = defaultdict(int)
    for excerpt in series.excerpts:
        for word in _content_words(excerpt.text):
            freq[word] += 1
    return freq


def _discriminative(words: set[str], freq: dict[str, int], total_episodes: int) -> set[str]:
    """Drop words too common across the series, or too common in English
    generally, to distinguish anything.

    Two independent filters, because they catch different failures:
    corpus-frequency drops words that are common *in this series*
    (recurring character names, setting nouns); the stopword list drops
    words that are common in English regardless of corpus size ("his",
    "once", "while") and that a 220-document, 26-episode frequency ceiling
    is too permissive to ever catch on its own.
    """
    fraction = 0.35 if total_episodes <= 30 else _COMMON_WORD_FRACTION
    ceiling = max(2, int(total_episodes * fraction))
    return {
        word
        for word in words
        if freq.get(word, 0) <= ceiling and word not in _STOPWORDS
    }


def _entry_content_words(entry: LedgerEntry, excerpt_text_by_id: dict[str, str]) -> set[str]:
    """Words drawn from the excerpts an entry itself cites and its description."""
    words: set[str] = set()
    if entry.description:
        words |= _content_words(entry.description)
    for excerpt_id in entry.excerpt_ids:
        text = excerpt_text_by_id.get(excerpt_id)
        if text:
            words |= _content_words(text)
    if not words:
        words = {entity.lower() for entity in entry.entities}
    return words


def _manifest_item_anchors(item: ManifestItem) -> list[int]:
    """The episode(s) that define this manifest item's own content."""
    anchors = [item.planted_episode] if item.planted_episode is not None else []
    if item.defect_class == "intentional_twist" and item.payoff_episode is not None:
        anchors.append(item.payoff_episode)
    return anchors


def _manifest_item_content_words(item: ManifestItem, episode_text: dict[int, str]) -> set[str]:
    words: set[str] = set()
    if item.notes:
        words |= _content_words(item.notes)
    for episode in _manifest_item_anchors(item):
        words |= _content_words(episode_text.get(episode, ""))
    return words


def _match_extracted_ids(
    entries: list[LedgerEntry],
    excerpts: list[Excerpt],
    manifest: Manifest,
    series: Series,
) -> dict[str, str]:
    """Content-aware, order-independent match from extracted entry id ->
    manifest defect_id. See the module docstring for the full rule.

    ``excerpts`` are the excerpts belonging to the graph ``entries`` came from
    (so an entry's own excerpt_ids resolve to real text); ``series`` is the
    original, authored series, whose excerpts supply both the corpus-wide word
    frequencies and the text at each manifest item's own anchor episode(s).
    """
    excerpt_text_by_id = {excerpt.id: excerpt.text for excerpt in excerpts}
    episode_text = {excerpt.episode: excerpt.text for excerpt in series.excerpts}
    freq = _document_frequencies(series)
    total_episodes = len(series.excerpts) or 1

    item_words = {
        item.defect_id: _discriminative(
            _manifest_item_content_words(item, episode_text), freq, total_episodes
        )
        for item in manifest.items
    }

    # (overlap_coefficient, entry_id, defect_id) candidates -- every
    # kind-compatible, position-valid, content-agreeing pair. The overlap
    # *coefficient* (shared / smaller of the two word sets), not the raw
    # shared-word count, is the weight: a wide-spanning entry citing two full
    # episodes of prose will out-count a small, precise one on raw overlap
    # just by having a bigger bag of words to coincidentally share, even after
    # the corpus-frequency filter. Normalising by the smaller set means a
    # small entry whose entire vocabulary sits inside the item's is scored on
    # par with (or above) a large entry that only partially overlaps it.
    candidates: list[tuple[float, str, str]] = []
    for entry in entries:
        allowed_classes = _KIND_TO_MANIFEST_CLASSES.get(entry.kind, set())
        if not allowed_classes:
            continue
        entry_words = _discriminative(
            _entry_content_words(entry, excerpt_text_by_id), freq, total_episodes
        )
        if not entry_words:
            continue
        for item in manifest.items:
            if item.defect_class not in allowed_classes:
                continue
            anchors = _manifest_item_anchors(item)
            if not any(
                entry.origin_episode - _POSITION_TOLERANCE
                <= anchor
                <= entry.latest_episode + _POSITION_TOLERANCE
                for anchor in anchors
            ):
                continue
            words = item_words[item.defect_id]
            shared = entry_words & words
            if len(shared) < _MIN_SHARED_DISCRIMINATIVE_WORDS:
                continue
            coefficient = len(shared) / min(len(entry_words), len(words))
            candidates.append((coefficient, entry.id, item.defect_id))

    if not candidates:
        return {}

    # Mutual-best assignment: a match survives only if it is simultaneously
    # the strongest candidate for its entry and the strongest for its item.
    # Ties broken by id so the result never depends on iteration order.
    best_item_for_entry: dict[str, tuple[float, str]] = {}
    best_entry_for_item: dict[str, tuple[float, str]] = {}
    for weight, entry_id, defect_id in candidates:
        item_key = (weight, defect_id)
        if item_key > best_item_for_entry.get(entry_id, (-1.0, "")):
            best_item_for_entry[entry_id] = item_key
        entry_key = (weight, entry_id)
        if entry_key > best_entry_for_item.get(defect_id, (-1.0, "")):
            best_entry_for_item[defect_id] = entry_key

    mapping: dict[str, str] = {}
    for weight, entry_id, defect_id in candidates:
        if best_item_for_entry.get(entry_id) == (weight, defect_id) and best_entry_for_item.get(
            defect_id
        ) == (weight, entry_id):
            mapping[entry_id] = defect_id
    return mapping


def _rescored(resolved: list[ResolvedEntry], mapping: dict[str, str]) -> list[ResolvedEntry]:
    """Rename matched entries' ids to the manifest defect_id they recovered.

    Unmatched entries keep their synthetic id, so they remain outside
    ``manifest_ids`` in ``score_discrimination`` and are counted as spurious
    false positives, exactly as an unmatched extractor invention should be.
    """
    rescored: list[ResolvedEntry] = []
    for resolved_entry in resolved:
        new_id = mapping.get(resolved_entry.entry.id)
        if new_id is None:
            rescored.append(resolved_entry)
            continue
        renamed_entry = resolved_entry.entry.model_copy(update={"id": new_id})
        rescored.append(resolved_entry.model_copy(update={"entry": renamed_entry}))
    return rescored


def evaluate_series(
    series: Series, manifest: Manifest, extractor: Extractor | None = None
) -> EndToEndReport:
    """Score the series twice: ledger correctness, then (optionally) end-to-end.

    1. Ledger: resolve the series' authored ``entries``/``payoffs`` as-is and
       score against ``manifest``. This is graph traversal only; it never
       touches extraction and should stay near-perfect.
    2. Extracted: when ``extractor`` is supplied, rebuild ``entries``,
       ``payoffs``, ``nodes`` and ``excerpts`` from the series' episode text
       via the extractor, resolve *that* graph, and score it against the same
       manifest using the content-aware match described in the module
       docstring. Omitting ``extractor`` omits this number entirely (``None``)
       rather than faking one.
    """
    resolver = LedgerResolver()
    ledger_report = score_discrimination(manifest, resolver.resolve_series(series))

    if extractor is None:
        return EndToEndReport(ledger=ledger_report, extracted=None, extraction_rejected=0)

    extraction = extractor.extract(_episode_rows(series))
    extracted_series = series.model_copy(
        update={
            "nodes": extraction.nodes,
            "entries": extraction.entries,
            "payoffs": extraction.payoffs,
            "excerpts": extraction.excerpts,
        }
    )
    resolved = resolver.resolve_series(extracted_series)
    mapping = _match_extracted_ids(extraction.entries, extraction.excerpts, manifest, series)
    extracted_report = score_discrimination(manifest, _rescored(resolved, mapping))

    return EndToEndReport(
        ledger=ledger_report,
        extracted=extracted_report,
        extraction_rejected=extraction.rejected,
    )
