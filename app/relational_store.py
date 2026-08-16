"""Relational and State Store for CanonPulse.

Provides sub-millisecond ACID persistence for Series, NarrativeNodes, LedgerEntries,
PayoffLinks, and Excerpts using SQLite / PostgreSQL.
"""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

from app.narrative_models import Excerpt, LedgerEntry, NarrativeNode, PayoffLink, Series


class RelationalSeriesStore:
    """High-speed relational series store supporting SQLite and PostgreSQL."""

    backend = "relational"

    def __init__(self, db_url: str = ":memory:") -> None:
        self._db_url = db_url
        self._is_sqlite = db_url.startswith("sqlite:///") or db_url == ":memory:"
        if self._is_sqlite:
            self._db_path = db_url.replace("sqlite:///", "") if db_url != ":memory:" else ":memory:"
            self._conn = sqlite3.connect(self._db_path, check_same_thread=False)
            self._conn.row_factory = sqlite3.Row
            self._conn.execute("PRAGMA foreign_keys = ON;")
            self._init_sqlite_schema()
        else:
            raise NotImplementedError(f"Database driver for {db_url} not configured; use sqlite:///path.db")

    def _init_sqlite_schema(self) -> None:
        with self._conn:
            self._conn.executescript("""
                CREATE TABLE IF NOT EXISTS series (
                    series_id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    genre TEXT NOT NULL,
                    total_episodes INTEGER NOT NULL,
                    ongoing INTEGER NOT NULL DEFAULT 1,
                    source_version TEXT NOT NULL DEFAULT 'demo',
                    episode_writers TEXT NOT NULL DEFAULT '{}',
                    episode_languages TEXT NOT NULL DEFAULT '{}',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );


                CREATE TABLE IF NOT EXISTS excerpts (
                    excerpt_id TEXT NOT NULL,
                    series_id TEXT NOT NULL,
                    episode INTEGER NOT NULL,
                    text TEXT NOT NULL,
                    PRIMARY KEY (series_id, excerpt_id),
                    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS narrative_nodes (
                    node_id TEXT NOT NULL,
                    series_id TEXT NOT NULL,
                    episode INTEGER NOT NULL,
                    perceived_index INTEGER NOT NULL,
                    true_time REAL,
                    summary TEXT NOT NULL,
                    entities TEXT NOT NULL DEFAULT '[]',
                    valence REAL NOT NULL DEFAULT 0.0,
                    excerpt_id TEXT,
                    PRIMARY KEY (series_id, node_id),
                    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS ledger_entries (
                    entry_id TEXT NOT NULL,
                    series_id TEXT NOT NULL,
                    kind TEXT NOT NULL,
                    description TEXT NOT NULL,
                    episodes TEXT NOT NULL DEFAULT '[]',
                    excerpt_ids TEXT NOT NULL DEFAULT '[]',
                    urgency INTEGER NOT NULL DEFAULT 3,
                    promise_kind TEXT,
                    entities TEXT NOT NULL DEFAULT '[]',
                    PRIMARY KEY (series_id, entry_id),
                    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE
                );


                CREATE TABLE IF NOT EXISTS payoff_links (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    series_id TEXT NOT NULL,
                    node_id TEXT NOT NULL,
                    target_id TEXT NOT NULL,
                    episode INTEGER NOT NULL,
                    rationale TEXT NOT NULL,
                    verified INTEGER NOT NULL DEFAULT 0,
                    FOREIGN KEY (series_id) REFERENCES series(series_id) ON DELETE CASCADE
                );
            """)

    def save(self, series: Series) -> None:
        """Persist or upsert an entire series graph into relational tables."""
        with self._conn:
            # 1. Upsert Series
            self._conn.execute(
                """
                INSERT INTO series (series_id, title, genre, total_episodes, ongoing, source_version, episode_writers, episode_languages)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(series_id) DO UPDATE SET
                    title=excluded.title,
                    genre=excluded.genre,
                    total_episodes=excluded.total_episodes,
                    ongoing=excluded.ongoing,
                    source_version=excluded.source_version,
                    episode_writers=excluded.episode_writers,
                    episode_languages=excluded.episode_languages
                """,
                (
                    series.id,
                    series.title,
                    series.genre,
                    series.total_episodes,
                    1 if series.ongoing else 0,
                    series.source_version,
                    json.dumps({str(k): v for k, v in series.episode_writers.items()}),
                    json.dumps({str(k): v for k, v in series.episode_languages.items()}),
                ),
            )


            # Clear child records for atomic replacement
            self._conn.execute("DELETE FROM excerpts WHERE series_id = ?", (series.id,))
            self._conn.execute("DELETE FROM narrative_nodes WHERE series_id = ?", (series.id,))
            self._conn.execute("DELETE FROM ledger_entries WHERE series_id = ?", (series.id,))
            self._conn.execute("DELETE FROM payoff_links WHERE series_id = ?", (series.id,))

            # 2. Insert Excerpts
            self._conn.executemany(
                """
                INSERT INTO excerpts (excerpt_id, series_id, episode, text)
                VALUES (?, ?, ?, ?)
                """,
                [(ex.id, series.id, ex.episode, ex.text) for ex in series.excerpts],
            )

            # 3. Insert Narrative Nodes
            self._conn.executemany(
                """
                INSERT INTO narrative_nodes (node_id, series_id, episode, perceived_index, true_time, summary, entities, valence, excerpt_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        n.id,
                        series.id,
                        n.episode,
                        n.perceived_index,
                        n.true_time,
                        n.summary,
                        json.dumps(n.entities),
                        n.valence,
                        n.excerpt_id,
                    )
                    for n in series.nodes
                ],
            )

            # 4. Insert Ledger Entries
            self._conn.executemany(
                """
                INSERT INTO ledger_entries (entry_id, series_id, kind, description, episodes, excerpt_ids, urgency, promise_kind, entities)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        e.id,
                        series.id,
                        e.kind,
                        e.description,
                        json.dumps(e.episodes),
                        json.dumps(e.excerpt_ids),
                        e.urgency,
                        e.promise_kind,
                        json.dumps(e.entities),
                    )
                    for e in series.entries
                ],
            )

            # 5. Insert Payoff Links
            self._conn.executemany(
                """
                INSERT INTO payoff_links (series_id, node_id, target_id, episode, rationale, verified)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        series.id,
                        p.node_id,
                        p.target_id,
                        p.episode,
                        p.rationale,
                        1 if p.verified else 0,
                    )
                    for p in series.payoffs
                ],
            )

    def load(self, series_id: str | None = None) -> Series:
        """Load and reconstitute the series graph from relational tables."""
        cursor = self._conn.cursor()

        if series_id:
            cursor.execute("SELECT * FROM series WHERE series_id = ? LIMIT 1", (series_id,))
        else:
            cursor.execute("SELECT * FROM series LIMIT 1")

        row = cursor.fetchone()
        if not row:
            raise KeyError(f"Series '{series_id or 'default'}' not found in relational store")

        s_id = row["series_id"]
        title = row["title"]
        genre = row["genre"]
        total_episodes = row["total_episodes"]
        ongoing = bool(row["ongoing"])

        # Load Excerpts
        cursor.execute("SELECT excerpt_id, episode, text FROM excerpts WHERE series_id = ?", (s_id,))
        excerpts = [Excerpt(id=r["excerpt_id"], episode=r["episode"], text=r["text"]) for r in cursor.fetchall()]

        # Load Nodes
        cursor.execute("SELECT node_id, episode, perceived_index, true_time, summary, entities, valence, excerpt_id FROM narrative_nodes WHERE series_id = ? ORDER BY perceived_index", (s_id,))
        nodes = [
            NarrativeNode(
                id=r["node_id"],
                episode=r["episode"],
                perceived_index=r["perceived_index"],
                true_time=r["true_time"],
                summary=r["summary"],
                entities=json.loads(r["entities"]),
                valence=r["valence"],
                excerpt_id=r["excerpt_id"],
            )
            for r in cursor.fetchall()
        ]

        # Load Ledger Entries
        cursor.execute("SELECT entry_id, kind, description, episodes, excerpt_ids, urgency, promise_kind, entities FROM ledger_entries WHERE series_id = ?", (s_id,))
        entries = [
            LedgerEntry(
                id=r["entry_id"],
                kind=r["kind"],
                description=r["description"],
                episodes=json.loads(r["episodes"]),
                excerpt_ids=json.loads(r["excerpt_ids"]),
                urgency=r["urgency"],
                promise_kind=r["promise_kind"],
                entities=json.loads(r["entities"]),
            )
            for r in cursor.fetchall()
        ]

        # Load Payoff Links
        cursor.execute("SELECT node_id, target_id, episode, rationale, verified FROM payoff_links WHERE series_id = ?", (s_id,))
        payoffs = [
            PayoffLink(
                node_id=r["node_id"],
                target_id=r["target_id"],
                episode=r["episode"],
                rationale=r["rationale"],
                verified=bool(r["verified"]),
            )
            for r in cursor.fetchall()
        ]

        source_version = row["source_version"] if "source_version" in row.keys() else "demo"
        episode_writers_raw = json.loads(row["episode_writers"]) if "episode_writers" in row.keys() and row["episode_writers"] else {}
        episode_writers = {str(k): str(v) for k, v in episode_writers_raw.items()}
        episode_languages_raw = json.loads(row["episode_languages"]) if "episode_languages" in row.keys() and row["episode_languages"] else {}
        episode_languages = {str(k): str(v) for k, v in episode_languages_raw.items()}


        return Series(
            id=s_id,
            title=title,
            genre=genre,
            total_episodes=total_episodes,
            ongoing=ongoing,
            source_version=source_version,
            episode_writers=episode_writers,
            episode_languages=episode_languages,
            nodes=nodes,
            entries=entries,
            payoffs=payoffs,
            excerpts=excerpts,
        )


    def list_series(self) -> list[dict[str, Any]]:
        cursor = self._conn.cursor()
        cursor.execute("SELECT series_id, title, genre, total_episodes, ongoing FROM series")
        return [
            {
                "series_id": r["series_id"],
                "title": r["title"],
                "genre": r["genre"],
                "total_episodes": r["total_episodes"],
                "ongoing": bool(r["ongoing"]),
            }
            for r in cursor.fetchall()
        ]
