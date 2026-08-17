"""Log the training run and the discrimination evaluation to local MLflow.

Two runs are logged, deliberately separate because they answer different
questions and conflating them is how a hollow metric gets read as a real one:

* ``continuation-model`` -- the regressor's held-out error. Fit to a *synthetic*
  corpus with a documented generative process (``app/training_corpus.py``), not
  to observed reader behaviour, and tagged as such.
* ``discrimination`` -- ledger correctness on the authored graph, and end-to-end
  discrimination on a graph rebuilt from episode prose. Ledger measures graph
  traversal only; extracted measures the whole pipeline. Both are logged with a
  prefix so neither can be mistaken for the other in the MLflow UI.

Usage:
    uv run python scripts/log_mlflow_run.py
    uv run mlflow ui --backend-store-uri sqlite:///mlflow.db
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

import mlflow  # noqa: E402

from app.corpus import normalize_within_book  # noqa: E402
from app.evaluation import evaluate_series  # noqa: E402
from app.heuristic_extractor import HeuristicExtractor  # noqa: E402
from app.manifest import load_manifest  # noqa: E402
from app.predictor import FEATURE_ORDER, ContinuationPredictor  # noqa: E402
from app.series_loader import load_series  # noqa: E402
from app.training_corpus import generate_synthetic_corpus  # noqa: E402

SERIES_PATH = REPO_ROOT / "data" / "series" / "alice_in_wonderland.json"
MANIFEST_PATH = REPO_ROOT / "data" / "manifest" / "alice_in_wonderland.yaml"

SYNTHETIC_CORPUS_NOTE = (
    "Fit to a synthetic corpus with a documented generative process "
    "(app/training_corpus.py), not to observed reader or listener behaviour. "
    "Demonstrates the pipeline end to end; not a calibrated real-audience number."
)


def log_training(experiment: str) -> float:
    mlflow.set_experiment(experiment)
    rows = normalize_within_book(generate_synthetic_corpus())
    with mlflow.start_run(run_name="continuation-model"):
        predictor = ContinuationPredictor()
        report = predictor.train(rows)
        mlflow.log_metric("held_out_mae", report.held_out_mae)
        mlflow.log_param("train_rows", report.train_rows)
        mlflow.log_param("test_rows", report.test_rows)
        mlflow.log_param("train_books", len(report.train_books))
        mlflow.log_param("test_books", len(report.test_books))
        # Named explicitly: grouping by book is what stops chapters from one
        # story landing on both sides of the split, which would make held-out
        # error fiction.
        mlflow.log_param("split_strategy", "grouped_by_book_id")
        mlflow.log_param("features", ",".join(FEATURE_ORDER))
        mlflow.set_tag("training_data", "synthetic")
        mlflow.set_tag("disclosure", SYNTHETIC_CORPUS_NOTE)
        return report.held_out_mae


def log_discrimination(experiment: str) -> tuple[float, float]:
    mlflow.set_experiment(experiment)
    series = load_series(SERIES_PATH)
    manifest = load_manifest(MANIFEST_PATH)
    report = evaluate_series(series, manifest, extractor=HeuristicExtractor())

    with mlflow.start_run(run_name="discrimination"):
        for prefix, block in (("ledger", report.ledger), ("extracted", report.extracted)):
            if block is None:
                continue
            # Prefixed so the two can never be read as one number. The ledger
            # figure measures traversal on a hand-authored graph; the extracted
            # figure measures the whole pipeline from prose.
            mlflow.log_metric(f"{prefix}_precision", block.precision)
            mlflow.log_metric(f"{prefix}_recall", block.recall)
            mlflow.log_metric(f"{prefix}_false_positive_rate", block.false_positive_rate)
            mlflow.log_metric(f"{prefix}_holes_caught", block.holes_caught)
            mlflow.log_metric(f"{prefix}_twists_protected", block.twists_protected)
        mlflow.log_metric("extraction_rejected", report.extraction_rejected)
        mlflow.log_param("extractor", "HeuristicExtractor")
        mlflow.set_tag(
            "ledger_means",
            "Graph traversal only, on a hand-authored graph. Not evidence the "
            "system can read fiction.",
        )
        mlflow.set_tag(
            "extracted_means",
            "Whole pipeline, from episode prose. Precision ceiling is 0.55, not "
            "1.0: protection requires a verified payoff link and no extractor "
            "here emits one.",
        )
        extracted_recall = report.extracted.recall if report.extracted else float("nan")
        return report.ledger.recall, extracted_recall


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--experiment",
        default="canonpulse",
        help="MLflow experiment name (default: canonpulse)",
    )
    parser.add_argument(
        "--tracking-uri",
        default="sqlite:///mlflow.db",
        help="MLflow tracking URI (default: sqlite:///mlflow.db)",
    )
    args = parser.parse_args()

    mlflow.set_tracking_uri(args.tracking_uri)
    mae = log_training(args.experiment)
    ledger_recall, extracted_recall = log_discrimination(args.experiment)

    print(f"  held_out_mae      {mae:.4f}")
    print(f"  ledger_recall     {ledger_recall}")
    print(f"  extracted_recall  {extracted_recall}")
    print(f"\nLogged to '{args.experiment}' at {args.tracking_uri}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
