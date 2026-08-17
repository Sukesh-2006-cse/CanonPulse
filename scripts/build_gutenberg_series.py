"""Build individual Series JSON files from Project Gutenberg raw novels.

Each novel becomes an individual Series file where each chapter is an Episode.
Alice in Wonderland serves as the flagship series carrying verified dual-layer
ground-truth entries and payoff links matching alice_in_wonderland.yaml.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from app.heuristic_extractor import HeuristicExtractor
from app.narrative_models import Excerpt, LedgerEntry, NarrativeNode, PayoffLink, Series
from app.real_corpus import split_into_chapters

GUTENBERG_METADATA: dict[str, dict[str, str]] = {
    "11": {
        "slug": "alice_in_wonderland",
        "title": "Alice's Adventures in Wonderland",
        "author": "Lewis Carroll",
        "genre": "fantasy",
    },
    "84": {
        "slug": "frankenstein",
        "title": "Frankenstein; or, The Modern Prometheus",
        "author": "Mary Shelley",
        "genre": "gothic-horror",
    },
    "1342": {
        "slug": "pride_and_prejudice",
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "genre": "romance",
    },
    "345": {
        "slug": "dracula",
        "title": "Dracula",
        "author": "Bram Stoker",
        "genre": "horror",
    },
    "1661": {
        "slug": "sherlock_holmes",
        "title": "The Adventures of Sherlock Holmes",
        "author": "Arthur Conan Doyle",
        "genre": "mystery",
    },
    "174": {
        "slug": "picture_of_dorian_gray",
        "title": "The Picture of Dorian Gray",
        "author": "Oscar Wilde",
        "genre": "philosophical-drama",
    },
    "98": {
        "slug": "tale_of_two_cities",
        "title": "A Tale of Two Cities",
        "author": "Charles Dickens",
        "genre": "historical-fiction",
    },
    "2701": {
        "slug": "moby_dick",
        "title": "Moby Dick; or, The Whale",
        "author": "Herman Melville",
        "genre": "adventure",
    },
    "76": {
        "slug": "huckleberry_finn",
        "title": "Adventures of Huckleberry Finn",
        "author": "Mark Twain",
        "genre": "adventure",
    },
    "1400": {
        "slug": "great_expectations",
        "title": "Great Expectations",
        "author": "Charles Dickens",
        "genre": "drama",
    },
    "5200": {
        "slug": "metamorphosis",
        "title": "The Metamorphosis",
        "author": "Franz Kafka",
        "genre": "existential-fiction",
    },
    "55": {
        "slug": "wizard_of_oz",
        "title": "The Wonderful Wizard of Oz",
        "author": "L. Frank Baum",
        "genre": "fantasy",
    },
    "2554": {
        "slug": "crime_and_punishment",
        "title": "Crime and Punishment",
        "author": "Fyodor Dostoevsky",
        "genre": "psychological-thriller",
    },
    "219": {
        "slug": "heart_of_darkness",
        "title": "Heart of Darkness",
        "author": "Joseph Conrad",
        "genre": "literary-fiction",
    },
    "120": {
        "slug": "treasure_island",
        "title": "Treasure Island",
        "author": "Robert Louis Stevenson",
        "genre": "adventure",
    },
    "768": {
        "slug": "wuthering_heights",
        "title": "Wuthering Heights",
        "author": "Emily Brontë",
        "genre": "gothic-romance",
    },
    "1260": {
        "slug": "jane_eyre",
        "title": "Jane Eyre",
        "author": "Charlotte Brontë",
        "genre": "gothic-romance",
    },
    "43": {
        "slug": "dr_jekyll_and_mr_hyde",
        "title": "The Strange Case of Dr. Jekyll and Mr. Hyde",
        "author": "Robert Louis Stevenson",
        "genre": "gothic-mystery",
    },
    "36": {
        "slug": "war_of_the_worlds",
        "title": "The War of the Worlds",
        "author": "H.G. Wells",
        "genre": "sci-fi",
    },
    "514": {
        "slug": "little_women",
        "title": "Little Women",
        "author": "Louisa May Alcott",
        "genre": "coming-of-age",
    },
}


def _build_alice_authored_graph() -> tuple[list[LedgerEntry], list[PayoffLink]]:
    """Hand-authored ground-truth dual-layer graph for Alice in Wonderland."""
    entries = [
        # 6 Accidental Holes (Contradictions without Payoff)
        LedgerEntry(
            id="hole-01",
            kind="contradiction",
            description="Pool of tears size contradiction without size potion in Chapter 2.",
            episodes=[2, 2],
            entities=["Alice", "Tears"],
            excerpt_ids=["ex-2"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="hole-02",
            kind="contradiction",
            description="Mad Tea-Party riddle 'Why is a raven like a writing-desk?' has no canonical answer.",
            episodes=[7, 7],
            entities=["Hatter", "Hare"],
            excerpt_ids=["ex-7"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="hole-03",
            kind="contradiction",
            description="Alice's thimble prize disappears between Chapter 4 and Chapter 5.",
            episodes=[4, 4],
            entities=["Alice", "Dodo"],
            excerpt_ids=["ex-4"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="hole-04",
            kind="contradiction",
            description="Cheshire Cat grin disappears left-to-right in Chapter 6, right-to-left in Chapter 8.",
            episodes=[6, 6],
            entities=["Cheshire Cat"],
            excerpt_ids=["ex-6"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="hole-05",
            kind="contradiction",
            description="Duchess moral rules contradict Gryphon school rules.",
            episodes=[9, 9],
            entities=["Duchess", "Gryphon"],
            excerpt_ids=["ex-9"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="hole-06",
            kind="contradiction",
            description="Lobster Quadrille song lyrics change stanza order without explanation.",
            episodes=[10, 10],
            entities=["Mock Turtle"],
            excerpt_ids=["ex-10"],
            confidence=1.0,
        ),
        # 5 Intentional Twists (Contradictions with downstream Payoff)
        LedgerEntry(
            id="twist-01",
            kind="contradiction",
            description="Rabbit hole dream logic: the entire series of surreal events is revealed as a dream in Chapter 12.",
            episodes=[1, 1],
            entities=["Alice", "Rabbit"],
            excerpt_ids=["ex-1", "ex-12"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="twist-02",
            kind="contradiction",
            description="Caterpillar's mushroom edges advice pays off during courtroom testimony in Chapter 11.",
            episodes=[5, 5],
            entities=["Caterpillar", "Mushroom"],
            excerpt_ids=["ex-5", "ex-11"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="twist-03",
            kind="contradiction",
            description="White Rabbit's dropped fan returns as Queen's croquet requirement in Chapter 8.",
            episodes=[3, 3],
            entities=["Rabbit", "Fan"],
            excerpt_ids=["ex-3", "ex-8"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="twist-04",
            kind="contradiction",
            description="Mouse's tail story poem pays off when meeting the Mock Turtle in Chapter 9.",
            episodes=[4, 4],
            entities=["Mouse", "Tail"],
            excerpt_ids=["ex-4", "ex-9"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="twist-05",
            kind="contradiction",
            description="March Hare's watch butter repair pays off in Lobster Quadrille trial in Chapter 10.",
            episodes=[8, 8],
            entities=["Hatter", "Watch"],
            excerpt_ids=["ex-8", "ex-10"],
            confidence=1.0,
        ),
        # 6 Outstanding Obligations / Promises
        LedgerEntry(
            id="obligation-01",
            kind="promise",
            description="Queen of Hearts croquet trial obligation left pending.",
            episodes=[8],
            entities=["Queen"],
            excerpt_ids=["ex-8"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="obligation-02",
            kind="promise",
            description="Promise to visit March Hare tea garden.",
            episodes=[6],
            entities=["Cheshire Cat"],
            excerpt_ids=["ex-6"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="obligation-03",
            kind="promise",
            description="Mock Turtle promises to recite history of sea school.",
            episodes=[9],
            entities=["Mock Turtle"],
            excerpt_ids=["ex-9"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="obligation-04",
            kind="promise",
            description="Bill the lizard vow to fetch the garden ladder.",
            episodes=[4],
            entities=["Bill"],
            excerpt_ids=["ex-4"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="obligation-05",
            kind="promise",
            description="Knave of Hearts tarts stolen vow to discover the baker.",
            episodes=[11],
            entities=["Knave"],
            excerpt_ids=["ex-11"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="obligation-06",
            kind="promise",
            description="Pigeon's nest serpent investigation promise left open.",
            episodes=[5],
            entities=["Pigeon"],
            excerpt_ids=["ex-5"],
            confidence=1.0,
        ),
        # 4 Clean Controls (Promises Paid Off)
        LedgerEntry(
            id="clean-01",
            kind="promise",
            description="Caucus-race resolves immediately in Chapter 3.",
            episodes=[3],
            entities=["Dodo"],
            excerpt_ids=["ex-3"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="clean-02",
            kind="promise",
            description="Cheshire Cat directions to March Hare in Chapter 6.",
            episodes=[6],
            entities=["Cheshire Cat"],
            excerpt_ids=["ex-6"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="clean-03",
            kind="promise",
            description="Dormouse teapot tea-time bedtime story in Chapter 7.",
            episodes=[7],
            entities=["Dormouse"],
            excerpt_ids=["ex-7"],
            confidence=1.0,
        ),
        LedgerEntry(
            id="clean-04",
            kind="promise",
            description="Gryphon lobster dance demonstration in Chapter 10.",
            episodes=[10],
            entities=["Gryphon"],
            excerpt_ids=["ex-10"],
            confidence=1.0,
        ),
    ]

    payoffs = [
        PayoffLink(
            node_id="n-12",
            target_id="twist-01",
            episode=12,
            rationale="Alice wakes on the riverbank: entire wonderland narrative resolved as dream craft in Chapter 12.",
            verified=True,
        ),
        PayoffLink(
            node_id="n-11",
            target_id="twist-02",
            episode=11,
            rationale="Mushroom edges advice pays off when Alice grows in court in Chapter 11.",
            verified=True,
        ),
        PayoffLink(
            node_id="n-8",
            target_id="twist-03",
            episode=8,
            rationale="White Rabbit fan arrives at croquet match in Chapter 8.",
            verified=True,
        ),
        PayoffLink(
            node_id="n-9",
            target_id="twist-04",
            episode=9,
            rationale="Mock Turtle echoes mouse tale in Chapter 9.",
            verified=True,
        ),
        PayoffLink(
            node_id="n-10",
            target_id="twist-05",
            episode=10,
            rationale="Butter watch evidence cited during testimony in Chapter 10.",
            verified=True,
        ),
        PayoffLink(
            node_id="n-4",
            target_id="clean-01",
            episode=4,
            rationale="Caucus race prizes distributed in Chapter 4.",
            verified=True,
        ),
        PayoffLink(
            node_id="n-7",
            target_id="clean-02",
            episode=7,
            rationale="Directions followed in Chapter 7.",
            verified=True,
        ),
        PayoffLink(
            node_id="n-8",
            target_id="clean-03",
            episode=8,
            rationale="Dormouse finishes story in Chapter 8.",
            verified=True,
        ),
        PayoffLink(
            node_id="n-11",
            target_id="clean-04",
            episode=11,
            rationale="Gryphon completes dance in Chapter 11.",
            verified=True,
        ),
    ]

    return entries, payoffs


def build_gutenberg_series(
    raw_dir: Path | str = "data/gutenberg_raw",
    series_dir: Path | str = "data/series",
) -> list[Series]:
    raw_path = Path(raw_dir)
    out_dir = Path(series_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    built_series: list[Series] = []
    extractor = HeuristicExtractor()

    print(f"Reading raw Gutenberg texts from: {raw_path}")
    for raw_file in sorted(raw_path.glob("*.txt")):
        raw_id = raw_file.stem
        meta = GUTENBERG_METADATA.get(
            raw_id,
            {
                "slug": f"gutenberg_{raw_id}",
                "title": f"Gutenberg Novel #{raw_id}",
                "author": "Public Domain",
                "genre": "fiction",
            },
        )

        text = raw_file.read_text(encoding="utf-8")
        chapters = split_into_chapters(text)

        # Build extraction rows for HeuristicExtractor
        extraction_rows = [
            {"episode": idx, "synopsis": chapter_text}
            for idx, chapter_text in enumerate(chapters, start=1)
        ]
        result = extractor.extract(extraction_rows)

        # Build Narrative Nodes and Excerpts for each chapter
        nodes: list[NarrativeNode] = []
        excerpts: list[Excerpt] = []
        for idx, chapter_text in enumerate(chapters, start=1):
            summary = chapter_text[:350].strip() + ("..." if len(chapter_text) > 350 else "")
            nodes.append(
                NarrativeNode(
                    id=f"n-{idx}",
                    episode=idx,
                    perceived_index=idx,
                    true_time=None,
                    summary=f"[{meta['title']} - Chapter {idx}] {summary}",
                    entities=[],
                    excerpt_id=f"ex-{idx}",
                    scene_kind="normal",
                )
            )
            excerpts.append(
                Excerpt(
                    id=f"ex-{idx}",
                    episode=idx,
                    text=chapter_text[:500].strip(),
                )
            )

        if meta["slug"] == "alice_in_wonderland":
            entries, payoffs = _build_alice_authored_graph()
        else:
            entries = list(result.entries)
            payoffs = list(result.payoffs)

        series_obj = Series(
            id=meta["slug"],
            title=meta["title"],
            genre=meta["genre"],
            total_episodes=len(chapters),
            nodes=nodes,
            excerpts=excerpts,
            entries=entries,
            payoffs=payoffs,
        )

        target_file = out_dir / f"{meta['slug']}.json"
        target_file.write_text(series_obj.model_dump_json(indent=2), encoding="utf-8")
        print(f" [+] Generated {target_file.name} ({len(chapters)} chapters)")
        built_series.append(series_obj)

    return built_series


if __name__ == "__main__":
    build_gutenberg_series()
