"""A documented, deterministic, offline synthetic training corpus.

There is no real reader-retention corpus in this repository. Fetching one
(arXiv 2412.15239, Qidian, Royal Road) needs network access and licensing
judgement that is out of scope for this demo. Rather than fabricate a number
that *looks* like measured retention, this module generates rows shaped like
that telemetry would be, from a generative process stated in full below --
so anyone can see exactly why a row's ``continue_rate`` is what it is, and so
the model fit on it demonstrates the pipeline (features -> split -> fit ->
held-out error -> interval), not calibration to real audiences.

Generative process, per synthetic chapter boundary::

    continue_rate = clip(
        BASE
        + OPEN_OBLIGATION_WEIGHT * open_obligation_count   # open threads pull a reader forward
        + URGENCY_WEIGHT * mean_urgency                    # urgent open threads pull harder
        - OVERDUE_WEIGHT * sqrt(overdue_count)             # an overdue promise reads as abandoned
        - BROKEN_WEIGHT * sqrt(broken_count)               # an unresolved contradiction repels
        - AGE_WEIGHT * sqrt(max_obligation_age)            # a debt left standing goes stale
        + noise,
        0.0, 1.0,
    )

The penalties take a square root because attrition has diminishing returns: the
eighth loose thread does not cost what the first did, and a reader who tolerated
five contradictions is not lost by the sixth. Linear penalties saturated instead
-- eight unresolved contradictions subtracted more than the whole base rate, so
every boundary past roughly episode 100 of a long series pinned at zero and the
back half of the curve carried no signal.

Any feature absent from this expression is one the model will correctly learn to
ignore, because in this synthetic world it carries no signal. That is a real
limit of training on generated labels, not a bug: ``suspended_density``,
``perceived_time_jump``, ``sentiment_velocity`` and ``active_thread_count`` are
carried through the pipeline and served, but nothing here makes them predictive.
On a real corpus they might be. Do not read their importance in this model as
evidence either way.

This mirrors the product's own thesis (see app/features.py) on purpose: it is
the only thesis available to ground a synthetic label in, and it is stated
here rather than hidden in a black box. Every row also carries the full
structural feature vector (``FEATURE_ORDER``) so it can be pushed straight
through ``app.corpus.normalize_within_book`` and ``ContinuationPredictor.train``.

**This corpus is synthetic. A model fit on it is not evidence of calibration
to real reader or listener behaviour.** Say so wherever a prediction derived
from it reaches a screen -- see app/predictor.py and the API responses in
app/main.py.
"""

from __future__ import annotations

import random
from math import sqrt

BASE = 0.5
OPEN_OBLIGATION_WEIGHT = 0.03
URGENCY_WEIGHT = 0.02
OVERDUE_WEIGHT = 0.09
BROKEN_WEIGHT = 0.13
# Per-episode decay on the oldest standing debt. Small, because age is a slow
# pressure next to an outright broken promise -- but nonzero, because a thread
# left hanging for 200 episodes is not the same as one opened last week.
AGE_WEIGHT = 0.012
NOISE_SPREAD = 0.05

PLATFORMS = ("royalroad", "qidian", "arxiv_serial")


def generate_synthetic_corpus(
    n_books: int = 24,
    chapters_per_book: int = 220,
    seed: int = 1337,
) -> list[dict]:
    """Generate a deterministic synthetic training corpus.

    Each row carries the full structural feature vector plus the corpus
    columns ``platform``, ``book_id``, ``chapter``, and ``continue_rate`` that
    ``app.corpus`` expects. Deterministic for a given seed; no I/O, no network.
    """
    rng = random.Random(seed)
    rows: list[dict] = []

    for book_index in range(n_books):
        book_id = f"synthetic-{book_index:03d}"
        platform = PLATFORMS[book_index % len(PLATFORMS)]
        # Each book gets its own obligation-pressure profile so the corpus
        # isn't just one flat pattern repeated -- some books run "tight"
        # (few open threads, fast payoffs), others "loose" (many, slow).
        pressure = rng.uniform(0.5, 1.5)

        for chapter in range(1, chapters_per_book + 1):
            open_obligation_count = min(10, round(rng.uniform(0, 8) * pressure))
            # Urgency is a mean over *open* obligations, so with none open the
            # real extractor yields 0.0. Mirror that rather than floor at 1.0,
            # or early boundaries in a real series fall outside the corpus.
            mean_urgency = (
                round(rng.uniform(1.0, 5.0), 2) if open_obligation_count else 0.0
            )
            max_obligation_age = rng.randint(0, chapter)
            mean_obligation_age = round(rng.uniform(0, max_obligation_age or 1), 2)
            # Overdue and broken counts are capped by what's actually open, so
            # a row is never "3 overdue promises but 0 open obligations".
            overdue_count = rng.randint(0, min(4, open_obligation_count))
            # A long serial accumulates unresolved contradictions; capping this
            # at 1 leaves the model unable to distinguish a mildly inconsistent
            # story from a badly broken one.
            broken_count = rng.randint(0, 15) if rng.random() < 0.35 else 0
            planting_recency = rng.randint(0, min(chapter, 60))
            suspended_density = round(rng.uniform(0, 0.6), 3)
            sentiment_velocity = round(rng.uniform(-1.2, 1.2), 3)
            perceived_time_jump = round(rng.uniform(0, 0.4), 3)
            active_thread_count = min(open_obligation_count, rng.randint(0, 10))
            min_payoff_distance = 0 if chapter <= 2 else chapter + 1
            mean_payoff_distance = 0 if chapter <= 2 else chapter + 1
            fair_clue_density = round(rng.uniform(0.0, 1.0), 3)

            noise = rng.uniform(-NOISE_SPREAD, NOISE_SPREAD)
            raw_rate = (
                BASE
                + OPEN_OBLIGATION_WEIGHT * open_obligation_count
                + URGENCY_WEIGHT * mean_urgency
                - OVERDUE_WEIGHT * sqrt(overdue_count)
                - BROKEN_WEIGHT * sqrt(broken_count)
                - AGE_WEIGHT * sqrt(max_obligation_age)
                + noise
            )
            continue_rate = max(0.0, min(1.0, raw_rate))

            rows.append(
                {
                    "platform": platform,
                    "book_id": book_id,
                    "chapter": chapter,
                    "continue_rate": continue_rate,
                    "open_obligation_count": open_obligation_count,
                    "mean_urgency": mean_urgency,
                    "max_obligation_age": max_obligation_age,
                    "mean_obligation_age": mean_obligation_age,
                    "overdue_count": overdue_count,
                    "planting_recency": planting_recency,
                    "suspended_density": suspended_density,
                    "broken_count": broken_count,
                    "sentiment_velocity": sentiment_velocity,
                    "perceived_time_jump": perceived_time_jump,
                    "active_thread_count": active_thread_count,
                    "min_payoff_distance": min_payoff_distance,
                    "mean_payoff_distance": mean_payoff_distance,
                    "suspended_edge_density": suspended_density,
                    "broken_edge_count": broken_count,
                    "fair_clue_density": fair_clue_density,
                    "character_thread_count": active_thread_count,
                }
            )

    return rows
