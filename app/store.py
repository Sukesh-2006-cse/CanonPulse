"""Where the app's `Series` comes from: local committed JSON or local storage.

The `SeriesStore` protocol (`SeriesStore.load() -> Series`) allows `app.main`
to load the narrative graph consistently across all endpoints.
"""

from __future__ import annotations

from pathlib import Path
from typing import Protocol
from datetime import datetime, timezone

from pydantic import BaseModel

from app.narrative_models import Series
from app.series_loader import load_series


class ApprovalEvent(BaseModel):
    series_id: str
    version_id: str
    issue_id: str
    actor_id: str
    action: str = "approve"
    request_id: str
    created_at: datetime


class ApprovalAuditStore:
    """Version-scoped, idempotent approval event store for API workflows."""

    def __init__(self) -> None:
        self._events: dict[tuple[str, str, str, str], ApprovalEvent] = {}

    def approve(
        self, series_id: str, version_id: str, issue_id: str, actor_id: str, request_id: str
    ) -> ApprovalEvent:
        key = (series_id, version_id, issue_id, actor_id)
        self._events.setdefault(
            key,
            ApprovalEvent(
                series_id=series_id,
                version_id=version_id,
                issue_id=issue_id,
                actor_id=actor_id,
                request_id=request_id,
                created_at=datetime.now(timezone.utc),
            ),
        )
        return self._events[key].model_copy(deep=True)

    def events(self, series_id: str, version_id: str) -> list[ApprovalEvent]:
        return [
            event.model_copy(deep=True)
            for event in self._events.values()
            if event.series_id == series_id and event.version_id == version_id
        ]


class SeriesStore(Protocol):
    """Anything that can hand back the demo `Series`."""

    backend: str

    def load(self) -> Series: ...


class FileSeriesStore:
    """Read the series from local disk."""

    backend = "file"

    def __init__(self, path: Path | str) -> None:
        self._path = Path(path)

    def load(self) -> Series:
        return load_series(self._path)


def store_from_env(env: dict | None = None, default_series_path: Path | str = "data/series/last_monsoon.json") -> SeriesStore:
    """Select the series store (Relational/PostgreSQL/SQLite or File)."""
    if env and env.get("DATABASE_URL"):
        from app.relational_store import RelationalSeriesStore

        return RelationalSeriesStore(db_url=env["DATABASE_URL"])
    series_path = (env.get("SERIES_PATH") if env else None) or default_series_path
    return FileSeriesStore(series_path)

