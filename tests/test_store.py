"""SeriesStore tests: local file-backed storage and ApprovalAuditStore."""

from __future__ import annotations

from pathlib import Path

from app.narrative_models import Series
from app.series_loader import load_series
from app.store import (
    ApprovalAuditStore,
    FileSeriesStore,
    store_from_env,
)

SERIES_PATH = Path("data/series/last_monsoon.json")


def test_file_store_matches_series_loader_directly():
    expected = load_series(SERIES_PATH)
    store = FileSeriesStore(SERIES_PATH)
    series = store.load()
    assert isinstance(series, Series)
    assert series.model_dump() == expected.model_dump()


def test_file_store_backend_label_is_file():
    assert FileSeriesStore(SERIES_PATH).backend == "file"


def test_store_from_env_defaults_to_file_when_unconfigured():
    store = store_from_env({}, default_series_path=SERIES_PATH)
    assert isinstance(store, FileSeriesStore)
    assert store.backend == "file"


def test_store_from_env_with_custom_series_path(tmp_path):
    fake_series = tmp_path / "test.json"
    fake_series.write_text(SERIES_PATH.read_text(encoding="utf-8"), encoding="utf-8")
    store = store_from_env({"SERIES_PATH": str(fake_series)})
    assert isinstance(store, FileSeriesStore)
    assert store.load().id == "last-monsoon"


def test_approval_audit_store_records_and_retrieves_events():
    store = ApprovalAuditStore()
    event = store.approve(
        series_id="s1",
        version_id="v1",
        issue_id="issue-42",
        actor_id="editor-1",
        request_id="req-123",
    )
    assert event.series_id == "s1"
    assert event.version_id == "v1"
    assert event.issue_id == "issue-42"
    assert event.action == "approve"

    events = store.events("s1", "v1")
    assert len(events) == 1
    assert events[0].issue_id == "issue-42"

