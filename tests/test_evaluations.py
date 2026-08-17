"""Unit tests for the evaluations package."""

from pathlib import Path

from app.feature_schema import FEATURE_ORDER
from evaluations.eval_llm_extraction import evaluate_extraction
from evaluations.eval_predictor import evaluate_predictor
from evaluations.run_full_evaluation import run_full_evaluation


def test_evaluate_predictor_returns_valid_metrics():
    report, predictor = evaluate_predictor()
    assert report.model_version == "continuation-gbr-v1"
    assert report.train_rows > 0
    assert report.test_rows > 0
    assert 0.0 <= report.train_mae <= 0.6
    assert 0.0 <= report.test_mae <= 0.6
    assert len(report.feature_importances) == len(FEATURE_ORDER)
    feature_names = {fi.feature_name for fi in report.feature_importances}
    assert "open_obligation_count" in feature_names
    assert "broken_edge_count" in feature_names


def test_evaluate_extraction_returns_valid_discrimination():
    report = evaluate_extraction()
    assert report.series_id == "alice_in_wonderland"
    assert report.ledger_traversal.holes_caught == report.ledger_traversal.holes_total
    assert report.ledger_traversal.twists_protected == report.ledger_traversal.twists_total
    assert report.heuristic_extractor.schema_compliance_rate >= 0.0
    assert report.heuristic_extractor.precision <= 0.55


def test_run_full_evaluation_generates_artifacts(tmp_path: Path):
    md_path, json_path = run_full_evaluation(reports_dir=tmp_path)
    assert md_path.exists()
    assert json_path.exists()
    md_content = md_path.read_text(encoding="utf-8")
    assert "CanonPulse Model & LLM Comprehensive Evaluation Report" in md_content
    assert "GradientBoostingRegressor" in md_content
