"""Evaluator for the GradientBoostingRegressor continuation predictor.

Measures regression accuracy (MAE, RMSE, R2), uncertainty calibration (p90 CI),
and feature importance rankings across held-out book splits.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path
from typing import Any

# Ensure repo root is in python path
REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from pydantic import BaseModel, Field
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from app.corpus import assign_grouped_split, normalize_within_book
from app.feature_schema import FEATURE_ORDER, FEATURE_SCHEMA_VERSION
from app.predictor import (
    CI_METHOD,
    MODEL_VERSION,
    train_predictor,
)
from app.real_corpus import load_real_corpus_rows
from app.training_corpus import generate_synthetic_corpus


class FeatureImportance(BaseModel):
    feature_name: str
    importance_weight: float
    rank: int


class PredictorEvaluationReport(BaseModel):
    model_version: str = MODEL_VERSION
    feature_schema_version: str = FEATURE_SCHEMA_VERSION
    ci_method: str = CI_METHOD
    train_rows: int
    test_rows: int
    train_books: list[str]
    test_books: list[str]
    train_mae: float
    test_mae: float
    test_rmse: float
    test_r2: float
    pearson_r: float
    residual_p90_z: float
    ci_coverage_percentage: float
    feature_importances: list[FeatureImportance] = Field(default_factory=list)


def evaluate_predictor(
    gutenberg_dir: Path | str = "data/gutenberg_raw",
    test_fraction: float = 0.2,
    seed: int = 42,
) -> tuple[PredictorEvaluationReport, Any]:
    """Train and evaluate the GradientBoostingRegressor model thoroughly."""
    # 1. Load synthetic & real training data
    synthetic_rows = generate_synthetic_corpus()
    gutenberg_path = Path(gutenberg_dir)
    real_rows = load_real_corpus_rows(gutenberg_path) if gutenberg_path.is_dir() else []
    all_rows = normalize_within_book(synthetic_rows + real_rows)

    # 2. Split grouped by book
    split_rows = assign_grouped_split(all_rows, test_fraction=test_fraction, seed=seed)
    train_rows = [r for r in split_rows if r.get("split") == "train"]
    test_rows = [r for r in split_rows if r.get("split") == "test"]

    # 3. Train model
    predictor, train_report = train_predictor(all_rows)
    raw_model = predictor.model
    if raw_model is None:
        raise RuntimeError("Predictor model failed to train")

    # 4. Extract feature matrices and labels (using continue_z as trained)
    def _extract_xy(rows: list[dict]) -> tuple[list[list[float]], list[float]]:
        x = [[float(row[col]) for col in FEATURE_ORDER] for row in rows]
        y = [float(row.get("continue_z", 0.0)) for row in rows]
        return x, y

    x_train, y_train = _extract_xy(train_rows)
    x_test, y_test = _extract_xy(test_rows)

    # 5. Predict
    pred_train = raw_model.predict(x_train)
    pred_test = raw_model.predict(x_test)

    # 6. Compute Regression Metrics in z-space
    train_mae = float(mean_absolute_error(y_train, pred_train))
    test_mae = float(mean_absolute_error(y_test, pred_test))
    test_rmse = float(math.sqrt(mean_squared_error(y_test, pred_test)))
    test_r2 = float(r2_score(y_test, pred_test))

    # Pearson correlation
    mean_y = sum(y_test) / len(y_test) if y_test else 0.0
    mean_pred = sum(pred_test) / len(pred_test) if len(pred_test) else 0.0
    num = sum((y - mean_y) * (p - mean_pred) for y, p in zip(y_test, pred_test))
    den = math.sqrt(
        sum((y - mean_y) ** 2 for y in y_test) * sum((p - mean_pred) ** 2 for p in pred_test)
    )
    pearson_r = float(num / den) if den > 0 else 0.0

    # 7. Confidence Interval Coverage
    half_interval = train_report.residual_quantile_z
    within_ci = sum(
        1 for y, p in zip(y_test, pred_test) if (p - half_interval) <= y <= (p + half_interval)
    )
    ci_coverage = (within_ci / len(y_test) * 100.0) if y_test else 100.0

    # 8. Feature Importances
    importances = raw_model.feature_importances_
    sorted_indices = sorted(range(len(importances)), key=lambda i: importances[i], reverse=True)
    feature_ranks = [
        FeatureImportance(
            feature_name=FEATURE_ORDER[idx],
            importance_weight=float(importances[idx]),
            rank=rank + 1,
        )
        for rank, idx in enumerate(sorted_indices)
    ]

    report = PredictorEvaluationReport(
        model_version=MODEL_VERSION,
        feature_schema_version=FEATURE_SCHEMA_VERSION,
        ci_method=CI_METHOD,
        train_rows=len(train_rows),
        test_rows=len(test_rows),
        train_books=train_report.train_books,
        test_books=train_report.test_books,
        train_mae=train_mae,
        test_mae=test_mae,
        test_rmse=test_rmse,
        test_r2=test_r2,
        pearson_r=pearson_r,
        residual_p90_z=train_report.residual_quantile_z,
        ci_coverage_percentage=ci_coverage,
        feature_importances=feature_ranks,
    )

    return report, predictor
