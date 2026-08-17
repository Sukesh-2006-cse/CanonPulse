from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import create_app


def test_series_memory_finds_a_planted_item_with_citations():
    client = TestClient(create_app())
    response = client.get("/api/memory", params={"query": "rabbit", "episode": 5})

    assert response.status_code == 200
    payload = response.json()
    assert payload["source"] == "file"
    assert payload["episode"] == 5
    assert payload["hits"]
    assert any("rabbit" in citation["text"].lower() for hit in payload["hits"] for citation in hit["citations"])


def test_series_memory_honors_the_requested_horizon():
    client = TestClient(create_app())
    response = client.get("/api/memory", params={"query": "gryphon", "episode": 1})

    assert response.status_code == 200
    assert response.json()["hits"] == []
