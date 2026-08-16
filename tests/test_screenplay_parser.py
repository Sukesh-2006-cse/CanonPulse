from __future__ import annotations

from pathlib import Path
from fastapi.testclient import TestClient

from app.parsers.screenplay_parser import ScreenplayParser, parse_screenplay_to_elements
from app.document_ingestion import parse_and_normalize_document, parse_and_normalize_bytes
from app.main import app


FOUNTAIN_SAMPLE = """
Title: THE LAST MONSOON
Credit: Written by
Author: CanonPulse Team

# Episode 1: The Broken Promise

EXT. MUMBAI DOCKS - NIGHT

Heavy rain falls against the shipping containers.

RAJ
(whispering)
The golden key was never in the locker.

VIKRAM
Then where did you hide it?

# Episode 2: The Departure

INT. TRAIN CABIN - DAY

The whistle blows. Vikram stares out the rain-streaked window.
"""

FDX_SAMPLE = """<?xml version="1.0" encoding="UTF-8"?>
<FinalDraft DocumentType="Script" Template="No" Version="1">
<Content>
<Paragraph Type="Scene Heading">
<Text>EPISODE 1: INT. ARCHIVE - NIGHT</Text>
</Paragraph>
<Paragraph Type="Action">
<Text>Dust motes float in the amber light.</Text>
</Paragraph>
<Paragraph Type="Character">
<Text>INSPECTOR JAMES</Text>
</Paragraph>
<Paragraph Type="Dialogue">
<Text>The timeline contradicts the ledger.</Text>
</Paragraph>
<Paragraph Type="Scene Heading">
<Text>EPISODE 2: EXT. COURTYARD - MORNING</Text>
</Paragraph>
<Paragraph Type="Action">
<Text>Birds scatter as the gates open.</Text>
</Paragraph>
</Content>
</FinalDraft>
"""


def test_fountain_parsing_extracts_scenes_dialogue_and_headers():
    parser = ScreenplayParser()
    elements = parser.parse_fountain_to_elements(FOUNTAIN_SAMPLE, source_path="script.fountain")

    assert len(elements) >= 6
    types = [el["type"] for el in elements]
    assert "section_header" in types
    assert "text" in types

    # Check that Episode 1 and Episode 2 are marked as section headers
    headers = [el["content"] for el in elements if el["type"] == "section_header"]
    assert any("Episode 1" in h for h in headers)
    assert any("Episode 2" in h for h in headers)

    # Check character and dialogue preservation
    dialogue_elements = [el["content"] for el in elements if "RAJ" in el["content"] or "VIKRAM" in el["content"]]
    assert len(dialogue_elements) > 0


def test_fdx_parsing_extracts_paragraphs_and_scene_headings():
    parser = ScreenplayParser()
    elements = parser.parse_fdx_to_elements(FDX_SAMPLE, source_path="script.fdx")

    assert len(elements) >= 4
    types = [el["type"] for el in elements]
    assert "section_header" in types
    assert "text" in types

    headers = [el["content"] for el in elements if el["type"] == "section_header"]
    assert any("EPISODE 1" in h for h in headers)
    assert any("EPISODE 2" in h for h in headers)


def test_screenplay_normalization_pipeline(tmp_path: Path):
    fountain_file = tmp_path / "series.fountain"
    fountain_file.write_text(FOUNTAIN_SAMPLE, encoding="utf-8")

    result = parse_and_normalize_document(
        str(fountain_file),
        series_id="fountain_series",
        title="The Last Monsoon",
        genre="noir",
    )

    assert result.review_required is False
    assert len(result.submission.episodes) == 2
    assert result.submission.episodes[0].episode_number == 1
    assert "golden key was never in the locker" in result.submission.episodes[0].text
    assert result.submission.episodes[1].episode_number == 2
    assert "TRAIN CABIN" in result.submission.episodes[1].text


def test_fdx_bytes_normalization_pipeline():
    result = parse_and_normalize_bytes(
        FDX_SAMPLE.encode("utf-8"),
        filename="manuscript.fdx",
        series_id="fdx_series",
        title="Archive Mystery",
        genre="thriller",
    )

    assert result.review_required is False
    assert len(result.submission.episodes) == 2
    assert result.submission.episodes[0].episode_number == 1
    assert "INSPECTOR JAMES" in result.submission.episodes[0].text
    assert result.submission.episodes[1].episode_number == 2


def test_api_upload_fountain_file():
    client = TestClient(app)
    files = {"file": ("last_monsoon.fountain", FOUNTAIN_SAMPLE.encode("utf-8"), "text/plain")}
    data = {
        "series_id": "fountain_api_series",
        "title": "Last Monsoon Fountain",
        "genre": "audio_drama",
        "ongoing": "true",
    }

    response = client.post("/api/ingest/document-file", files=files, data=data)
    assert response.status_code == 200
    payload = response.json()
    assert payload["series_id"] == "fountain_api_series"
    assert len(payload["episodes"]) == 2
