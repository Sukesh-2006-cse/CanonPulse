"""MLflow Local Tabular Metrics & Training Run Tracking.

Ensures 100% open-source local SQLite logging for LightGBM/Scikit-Learn regressor
training runs, held-out MAE, and discrimination scores via sqlite:///mlflow.db.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any
import mlflow


DEFAULT_MLFLOW_DB = "sqlite:///mlflow.db"


def configure_mlflow(tracking_uri: str | None = None) -> str:
    """Configure MLflow to use local SQLite database or environment tracking URI."""
    uri = tracking_uri or os.environ.get("MLFLOW_TRACKING_URI") or DEFAULT_MLFLOW_DB
    mlflow.set_tracking_uri(uri)
    return uri


def log_experiment_metrics(
    experiment_name: str,
    run_name: str,
    metrics: dict[str, float],
    params: dict[str, Any] | None = None,
    tags: dict[str, str] | None = None,
) -> str:
    """Log parameters and metrics to local MLflow experiment."""
    configure_mlflow()
    mlflow.set_experiment(experiment_name)
    with mlflow.start_run(run_name=run_name) as run:
        if params:
            for k, v in params.items():
                mlflow.log_param(k, v)
        for k, v in metrics.items():
            mlflow.log_metric(k, v)
        if tags:
            for k, v in tags.items():
                mlflow.set_tag(k, v)
        return run.info.run_id
