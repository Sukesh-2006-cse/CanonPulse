from pathlib import Path


def test_docs_disclose_synthetic_metrics_and_execution_commands():
    for path in (Path("README.md"), Path("docs/PRODUCT.md"), Path("sessionhandoff.md")):
        text = path.read_text(encoding="utf-8")
        assert "synthetic" in text.lower()
        assert "uv run --group dev pytest" in text
        assert "canonpulse-16h-plan.md" in text


def test_runbook_contains_safe_fallback_and_rehearsal_count():
    text = Path("docs/superpowers/demo-runbook.md").read_text(encoding="utf-8")
    assert "zero live inference" in text.lower()
    assert "six" in text.lower()
    assert "synthetic" in text.lower()
    assert "--base-url" in text


def test_handoff_links_all_eight_gap_plans_and_last_validation():
    text = Path("sessionhandoff.md").read_text(encoding="utf-8")
    for number in range(1, 9):
        assert f"gap-{number:02d}" in text
    assert "last validation" in text.lower()

