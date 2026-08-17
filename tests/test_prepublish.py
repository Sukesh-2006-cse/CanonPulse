from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import create_app


def test_pre_publish_check_is_non_mutating_and_cited():
    client = TestClient(create_app())
    total_episodes = client.get("/api/series").json()["total_episodes"]
    candidate_ep = total_episodes + 1
    candidate = {
        "episode": candidate_ep,
        "text": "Alice promises she will return to the tea-party, but the riddle was never solved.",
    }

    response = client.post("/api/prepublish", json=candidate)

    assert response.status_code == 200
    payload = response.json()
    assert payload["candidate_episode"] == candidate_ep
    assert payload["source"] == "file"
    assert payload["complete"] is True
    assert client.get("/api/series").json()["total_episodes"] == total_episodes


def test_pre_publish_rejects_a_candidate_inside_the_published_series():
    client = TestClient(create_app())
    total_episodes = client.get("/api/series").json()["total_episodes"]
    response = client.post("/api/prepublish", json={"episode": total_episodes, "text": "A quiet morning."})
    assert response.status_code == 422


def test_pre_publish_check_reports_a_retention_delta():
    client = TestClient(create_app())
    total_episodes = client.get("/api/series").json()["total_episodes"]
    candidate = {
        "episode": total_episodes + 1,
        "text": "Alice promises she will return to the tea-party, but the riddle was never solved.",
    }
    response = client.post("/api/prepublish", json=candidate)
    assert response.status_code == 200
    payload = response.json()
    assert "retention_delta" in payload
    assert "findings" in payload
