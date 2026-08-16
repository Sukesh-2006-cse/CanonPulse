from __future__ import annotations

from pathlib import Path
import pytest

from app.mlflow_utils import configure_mlflow, log_experiment_metrics


def test_mlflow_local_sqlite_logging(tmp_path: Path):
    db_file = tmp_path / "test_mlflow.db"
    db_uri = f"sqlite:///{db_file}"
    configure_mlflow(db_uri)

    run_id = log_experiment_metrics(
        experiment_name="test_experiment",
        run_name="test_continuation_run",
        metrics={"held_out_mae": 0.042, "discrimination_score": 0.88},
        params={"train_rows": 100, "test_rows": 20},
        tags={"synthetic": "true"},
    )

    assert run_id is not None
    assert len(run_id) > 0
    assert db_file.exists()
