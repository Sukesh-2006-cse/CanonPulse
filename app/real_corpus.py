"""Real prose, real structural extraction, still-synthetic engagement labels.

scripts/fetch_gutenberg_corpus.py downloads real public-domain novels from a
sanctioned Project Gutenberg mirror. This module runs the *real* extraction
pipeline over them -- app.heuristic_extractor builds an actual dual-layer
graph per book, app.features.FeatureExtractor computes real structural
features at each chapter boundary -- rather than fabricating feature values
from a formula the way app.training_corpus does.

What it cannot do is attach a real reader-engagement label: none of these
books have per-chapter retention telemetry. So continue_rate here is the same
documented formula training_corpus.py uses (see its module docstring for the
full generative-process writeup), applied to real extracted features instead
of randomly generated ones. That is a strictly smaller synthetic surface than
before -- the graph and features are real, only the label still is not -- but
it is not a real-audience number and must not be presented as one, exactly
like training_corpus.py's rows.
"""

from __future__ import annotations

import random
import re
from math import sqrt
from pathlib import Path

from app.features import FeatureExtractor
from app.heuristic_extractor import HeuristicExtractor
from app.narrative_models import Series
from app.training_corpus import (
    AGE_WEIGHT,
    BASE,
    BROKEN_WEIGHT,
    NOISE_SPREAD,
    OPEN_OBLIGATION_WEIGHT,
    OVERDUE_WEIGHT,
    URGENCY_WEIGHT,
)

PLATFORM = "gutenberg"

_CHAPTER_HEADING = re.compile(
    r"^\s*(?:"
    r"(?:CHAPTER|Chapter|PART|Part|ACT|Act|ADVENTURE|Adventure|STORY|Story)\s+[IVXLCDM\d]+[^\n]*|"
    r"(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX|XXI|XXII|XXIII|XXIV|XXV|XXVI|XXVII|XXVIII|XXIX|XXX|XXXI|XXXII|XXXIII|XXXIV|XXXV)\.\s+[A-Z0-9\s,–—'\"]+"
    r")\s*$",
    re.MULTILINE,
)


def split_into_chapters(text: str) -> list[str]:
    """Split on chapter headings. Falls back to the whole
    text as one chapter when no heading matches -- still real prose, just
    with one boundary instead of many."""
    pieces = _CHAPTER_HEADING.split(text)
    chapters = [piece.strip() for piece in pieces if piece.strip()]
    return chapters if chapters else [text.strip()]



def load_real_corpus_rows(raw_dir: Path) -> list[dict]:
    """Read every *.txt in raw_dir (one file per book) and build real corpus
    rows from them. Empty list -- not an error -- when the directory is
    absent or has no books yet, so a fresh checkout without the (untracked,
    ~12MB, script-downloaded) corpus degrades to synthetic-only training
    rather than failing to start."""
    raw_dir = Path(raw_dir)
    if not raw_dir.is_dir():
        return []
    chapters_by_book = {
        path.stem: split_into_chapters(path.read_text(encoding="utf-8"))
        for path in sorted(raw_dir.glob("*.txt"))
    }
    return build_real_corpus_rows(chapters_by_book)


def _continue_rate(features: dict, *, seed: int) -> float:
    noise = random.Random(seed).uniform(-NOISE_SPREAD, NOISE_SPREAD)
    raw = (
        BASE
        + OPEN_OBLIGATION_WEIGHT * features["open_obligation_count"]
        + URGENCY_WEIGHT * features["mean_urgency"]
        - OVERDUE_WEIGHT * sqrt(features["overdue_count"])
        - BROKEN_WEIGHT * sqrt(features["broken_count"])
        - AGE_WEIGHT * sqrt(features["max_obligation_age"])
        + noise
    )
    return max(0.0, min(1.0, raw))


def build_real_corpus_rows(chapters_by_book: dict[str, list[str]]) -> list[dict]:
    """One row per real chapter boundary, across every book given.

    Each book's chapters become episodes of their own Series, extracted by
    the same HeuristicExtractor used for real submissions -- these rows are
    not hand-authored fixtures, they are whatever that extractor actually
    finds in the real downloaded text.
    """
    rows: list[dict] = []
    for raw_book_id, chapters in chapters_by_book.items():
        book_id = f"{PLATFORM}-{raw_book_id}"
        extraction_rows = [{"episode": index, "synopsis": text} for index, text in enumerate(chapters, start=1)]
        result = HeuristicExtractor().extract(extraction_rows)
        series = Series(
            id=book_id,
            title=book_id,
            genre="fiction",
            total_episodes=len(chapters),
            nodes=result.nodes,
            entries=result.entries,
            payoffs=result.payoffs,
            excerpts=result.excerpts,
        )
        extractor = FeatureExtractor()
        for episode in range(1, len(chapters) + 1):
            features = extractor.extract(series, episode).model_dump()
            row = dict(features)
            row["platform"] = PLATFORM
            row["book_id"] = book_id
            row["chapter"] = episode
            row["continue_rate"] = _continue_rate(features, seed=hash((book_id, episode)) & 0xFFFFFFFF)
            rows.append(row)
    return rows
