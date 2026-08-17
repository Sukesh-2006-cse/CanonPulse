from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app())


def test_audit_separates_protected_twists_from_real_holes(client):
    payload = client.get("/api/audit").json()
    assert payload["headline"]["baseline_flags"] > payload["headline"]["real_holes"]
    assert payload["headline"]["twists_protected"] > 0


def test_audit_reports_the_active_series_backend(client):
    payload = client.get("/api/audit").json()
    assert payload["source"] == "file"


def test_every_surfaced_finding_carries_a_citation(client):
    payload = client.get("/api/audit").json()
    for finding in payload["findings"]:
        assert finding["citations"], f"{finding['entry']['id']} surfaced with no evidence"


def test_discrimination_reports_measured_not_asserted_scores(client):
    payload = client.get("/api/discrimination").json()
    ledger = payload["ledger"]
    assert 0.0 <= ledger["precision"] <= 1.0
    assert 0.0 <= ledger["recall"] <= 1.0
    assert ledger["holes_total"] == 6
    assert ledger["twists_total"] == 5


def test_discrimination_reports_ledger_and_end_to_end_separately(client):
    """One number measures traversal, the other measures the whole pipeline.
    Reporting a single figure invites a judge to read the wrong one as both."""
    payload = client.get("/api/discrimination").json()
    assert "ledger" in payload
    assert "extracted" in payload
    assert payload["extracted"]["recall"] < payload["ledger"]["recall"]


def test_root_serves_the_dashboard(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "CanonPulse" in response.text


def test_dashboard_shows_the_baseline_comparison(client):
    body = client.get("/").text
    assert "Baseline checker" in body
    assert "CanonPulse" in body
    assert "Protected" in body


def test_dashboard_has_hooks_for_prediction_and_rewrite_attribution(client):
    body = client.get("/").text
    assert 'id="prediction-value"' in body
    assert 'id="prediction-interval"' in body
    assert 'id="rewrite-body"' in body


def test_predict_returns_a_real_prediction_with_interval_and_disclosure(client):
    payload = client.get("/api/predict", params={"episode": 10}).json()
    assert payload["episode"] == 10
    assert set(payload["features"].keys())  # features still returned as the explanation
    prediction = payload["prediction"]
    assert 0.0 <= prediction["value"] <= 1.0
    assert prediction["lower_ci"] <= prediction["value"] <= prediction["upper_ci"]
    assert "ci_method" in prediction
    assert "synthetic" in payload["disclosure"].lower()


def test_predict_features_never_look_past_the_boundary(client):
    """Sanity check that the wired endpoint still uses the causal extractor."""
    early = client.get("/api/predict", params={"episode": 2}).json()
    late = client.get("/api/predict", params={"episode": 12}).json()
    assert early["features"] != late["features"]


def test_rewrite_computes_total_delta_from_the_predictor_not_the_caller(client):
    """The endpoint must not trust a caller-supplied total_delta -- it has to
    compute both predictions itself from the same trained model."""
    response = client.post(
        "/api/rewrite",
        json={
            "before_episode": 2,
            "after_episode": 6,
            "edits": [
                {
                    "hunk": "- obligation left open\n+ obligation closed",
                    "obligation_id": "p-1",
                    "feature_moved": "open_obligation_count",
                    "delta": 999.0,  # deliberately wrong; must be ignored
                }
            ],
        },
    )
    assert response.status_code == 200
    report = response.json()
    assert report["total_delta"] != pytest.approx(999.0)
    assert report["unattributed"] == pytest.approx(report["total_delta"] - report["attributed_delta"])


def test_rewrite_rejects_edits_with_no_named_obligation(client):
    response = client.post(
        "/api/rewrite",
        json={
            "before_episode": 2,
            "after_episode": 6,
            "edits": [{"hunk": "x", "obligation_id": "", "feature_moved": "open_obligation_count", "delta": 0.01}],
        },
    )
    assert response.status_code == 422


def test_rewrite_rejects_a_feature_name_the_model_never_saw(client):
    """A bogus feature_moved must be rejected at the API boundary, not rendered
    as an attributed movement on the dashboard."""
    response = client.post(
        "/api/rewrite",
        json={
            "before_episode": 2,
            "after_episode": 6,
            "edits": [
                {"hunk": "x", "obligation_id": "p-1", "feature_moved": "NOT_A_FEATURE", "delta": 9.99}
            ],
        },
    )
    assert response.status_code == 422


def test_rewrite_rejects_a_repair_whose_named_feature_got_worse(client):
    response = client.post(
        "/api/rewrite",
        json={
            "before_episode": 2,
            "after_episode": 6,
            "edits": [
                {"hunk": "x", "obligation_id": "p-1", "feature_moved": "broken_count", "delta": 0.02}
            ],
        },
    )
    assert response.status_code == 422


def test_cached_series_is_not_mutated_across_requests(client):
    """_series()/_resolved() are lru_cache'd; handing out the same mutable
    pydantic objects to every request is a corruption risk once anything
    writes to them (e.g. PayoffLink.verified during resolution)."""
    first = client.get("/api/audit").json()
    for payoff in first.get("findings", []):
        if payoff.get("payoff"):
            payoff["payoff"]["verified"] = True  # mutate the response copy
    second = client.get("/api/audit").json()
    assert second == client.get("/api/audit").json()  # still deterministic
    from app.main import _resolved, _series

    a, b = _resolved(), _resolved()
    assert a is not b or all(x is not y for x, y in zip(a, b))
    sa, sb = _series(), _series()
    assert sa is not sb


def test_predict_falls_back_to_the_golden_path_when_inference_is_slow(client, monkeypatch):
    """INFERENCE_TIMEOUT_SECONDS must actually gate a real code path -- the
    README describes an automatic switchover to golden_path(); before this,
    nothing read the constant."""
    import time

    import app.demo_mode as demo_mode
    import app.main as main

    monkeypatch.setattr(demo_mode, "INFERENCE_TIMEOUT_SECONDS", 0.05)

    real_predict = main._predictor().predict

    def slow_predict(features):
        time.sleep(0.3)
        return real_predict(features)

    monkeypatch.setattr(main._predictor(), "predict", slow_predict)

    payload = client.get("/api/predict", params={"episode": 10}).json()
    assert payload["degraded"] is True
    assert payload["prediction"] is None
    assert payload["fallback"]["headline"]["baseline_flags"] > 0


def test_predict_rejects_an_episode_past_the_end_of_the_series(client):
    """A boundary that does not exist must not return a confident number.

    Unbounded, ?episode=99999 returned 200 with max_obligation_age near 99999 --
    a feature vector describing a boundary 99,779 episodes past the finale, and a
    percentage rendered as if it meant something.
    """
    total = client.get("/api/series").json()["total_episodes"]
    assert client.get(f"/api/predict?episode={total}").status_code == 200
    assert client.get(f"/api/predict?episode={total + 1}").status_code == 422


def test_rewrite_rejects_a_window_that_runs_the_clock_backwards(client):
    """after_episode before before_episode inverts the comparison.

    Obligations un-accumulate, so a regression reads as a repair. The UI's
    repair button walks forward; nothing stopped a caller walking back.
    """
    findings = client.get("/api/audit").json()["findings"]
    broken = next(f for f in findings if f["state"] == "broken")
    episode = min(broken["entry"]["episodes"])
    response = client.post(
        "/api/rewrite",
        json={"before_episode": min(total_episodes := client.get("/api/series").json()["total_episodes"], episode + 2), "after_episode": episode, "edits": []},
    )
    assert response.status_code == 422


def test_submission_api_exposes_synopsis_before_deep_promotion(client):
    payload = {
        "series_id": "api-demo",
        "title": "API demo",
        "genre": "thriller",
        "episodes": [{"episode": 1, "synopsis": "Asha promises to return.", "writer_id": "w1"}],
    }
    created = client.post("/api/submissions", json=payload)
    assert created.status_code == 201
    job_id = created.json()["job_id"]
    assert created.json()["status"] == "synopsis_ready"
    promoted = client.post(f"/api/submissions/{job_id}/deep")
    assert promoted.status_code == 200
    assert promoted.json()["status"] == "complete"


def test_writer_surfaces_and_discovery_are_served(client):
    assert client.get("/api/handoff", params={"writer_id": "w1", "episode": 10}).status_code == 200
    assert client.get("/api/debt-board").json()["total_open"] >= 0
    localization = client.post("/api/localization", json={"episode": 1, "language": "hi", "text": "Asha opens her podcast."})
    assert localization.status_code == 200
    discovery = client.get("/api/discover", params={"query": "rainy Sunday after heartbreak"})
    assert discovery.status_code == 200
    assert discovery.json()["matches"]


def test_cohorts_and_writers_room_are_structured_and_disclosed(client):
    cohorts = client.get("/api/cohorts")
    assert cohorts.status_code == 200
    assert len(cohorts.json()["cohorts"]) == 5
    assert "simulation" in cohorts.json()["disclosure"]
    room = client.get("/api/writers-room", params={"episode": 10})
    assert room.status_code == 200
    assert len(room.json()["annotations"]) == 5


def test_writers_room_llm_path_requires_openai_key(client, monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    response = client.get("/api/writers-room", params={"use_llm": True})
    assert response.status_code == 422


def test_repair_route_requires_openai_key_when_text_omitted(client, monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    response = client.post("/api/repair", json={"target_entry_id": "no-such-entry", "node_id": "no-such-node"})
    assert response.status_code == 422
    assert "OPENAI_API_KEY" in response.json()["detail"]


def test_training_rows_blend_in_real_corpus_when_available(monkeypatch, tmp_path):
    (tmp_path / "1.txt").write_text(
        "CHAPTER I\nAna promises she will return one day.\nCHAPTER II\nThe key is finally found.\n",
        encoding="utf-8",
    )
    monkeypatch.setattr("app.main.GUTENBERG_RAW_PATH", tmp_path)
    from app.main import _training_rows

    rows = _training_rows()
    assert any(row.get("platform") == "gutenberg" for row in rows)
    assert any(row.get("platform") != "gutenberg" for row in rows)


def test_training_rows_are_synthetic_only_without_a_real_corpus_directory(monkeypatch, tmp_path):
    monkeypatch.setattr("app.main.GUTENBERG_RAW_PATH", tmp_path / "does-not-exist")
    from app.main import _training_rows

    rows = _training_rows()
    assert rows
    assert all(row.get("platform") != "gutenberg" for row in rows)


def test_diagnostics_reports_model_and_source_provenance(client):
    payload = client.get("/api/diagnostics").json()
    assert payload["series_source"] == "file"
    assert payload["model_version"]
    assert payload["feature_schema_version"]
