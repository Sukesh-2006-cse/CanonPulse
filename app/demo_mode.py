"""Offline fallback for the live demo.

Every finding shown on stage is computed from committed data through the real
ledger -- no inference, no network. The demo therefore degrades to "slightly less
live" rather than to a blank screen, and nothing shown is fabricated.
"""

from __future__ import annotations

from pathlib import Path

from app.ledger import LedgerResolver, LedgerSummary
from app.series_loader import load_series

INFERENCE_TIMEOUT_SECONDS = 5

SERIES_PATH = Path("data/series/alice_in_wonderland.json")


def golden_path() -> dict:
    series = load_series(SERIES_PATH)
    resolved = LedgerResolver().resolve_series(series)
    return {
        "headline": LedgerSummary(resolved).headline(),
        "findings": [item.model_dump() for item in resolved if item.state != "paid"],
    }
