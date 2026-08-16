from __future__ import annotations

import io
from pathlib import Path
from fastapi.testclient import TestClient

from app.parsers.docling_parser import DoclingParser, parse_document_to_elements
from app.document_ingestion import parse_and_normalize_document
from app.main import app


def test_docling_parser_maps_structured_nodes_to_canonpulse_elements():
    parser = DoclingParser()

    # Simulate raw structured content (multi-element document)
    sample_text = """
    Episode 1: The First Clue
    Rain fell over the old lighthouse. Inspector James found a broken golden key on the floor.

    Episode 2: The Second Clue
    The clock struck midnight in the dusty archives.
    """

    elements = parser.parse_text_to_elements(sample_text, source_path="sample.pdf")

    assert len(elements) >= 4
    # Check section headers and text mapping
    types = [el["type"] for el in elements]
    assert "section_header" in types
    assert "text" in types

    # Check element keys and bounding box / page structure
    for el in elements:
        assert "id" in el
        assert "type" in el
        assert "content" in el
        assert "bbox" in el
        assert isinstance(el["bbox"], list)
        assert "page_id" in el["bbox"][0]


def test_parse_and_normalize_document_pipeline(tmp_path: Path):
    doc_file = tmp_path / "test_manuscript.txt"
    doc_file.write_text(
        "Chapter 1\n\nRaj found the hidden compartment.\n\nChapter 2\n\nVikram arrived at dawn.\n",
        encoding="utf-8",
    )

    result = parse_and_normalize_document(
        str(doc_file),
        series_id="test_series",
        title="The Investigation",
        genre="mystery",
    )

    assert result.review_required is False
    assert len(result.submission.episodes) == 2
    assert result.submission.episodes[0].episode_number == 1
    assert "Raj found the hidden compartment" in result.submission.episodes[0].text
    assert result.submission.episodes[1].episode_number == 2
    assert "Vikram arrived at dawn" in result.submission.episodes[1].text


def test_api_upload_document_endpoint(tmp_path: Path):
    client = TestClient(app)

    file_content = b"Episode 1\n\nScene 1: The meeting in Mumbai.\n\nEpisode 2\n\nScene 2: The departure."
    files = {"file": ("script.txt", file_content, "text/plain")}
    data = {
        "series_id": "api_series",
        "title": "API Series Test",
        "genre": "drama",
        "ongoing": "true",
    }

    response = client.post("/api/ingest/document-file", files=files, data=data)
    assert response.status_code == 200

    payload = response.json()
    assert payload["series_id"] == "api_series"
    assert len(payload["episodes"]) == 2
    assert payload["episodes"][0]["episode_number"] == 1
    assert payload["episodes"][1]["episode_number"] == 2
