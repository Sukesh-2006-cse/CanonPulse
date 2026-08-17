"""Liveness and dependency readiness reports."""

from __future__ import annotations

from pathlib import Path

from pydantic import BaseModel


class HealthReport(BaseModel):
    status: str
    checks: dict[str, dict[str, str]] = {}


def check_liveness() -> HealthReport:
    return HealthReport(status="ready", checks={})


def check_readiness() -> HealthReport:
    checks = {
        "store": {"status": "ready" if Path("data/series/alice_in_wonderland.json").exists() else "missing"},
        "model": {"status": "ready" if Path("app/predictor.py").exists() else "missing"},
        "retrieval": {"status": "ready" if Path("app/retrieval.py").exists() else "missing"},
    }
    status = "ready" if all(item["status"] == "ready" for item in checks.values()) else "not_ready"
    return HealthReport(status=status, checks=checks)
