from __future__ import annotations

from app.extraction import (
    ExtractionResult,
    FakeExtractor,
    parse_extraction_row,
)


def test_fake_extractor_returns_a_usable_graph():
    result = FakeExtractor().extract([{"episode": 1, "synopsis": "Asha finds a cassette."}])
    assert isinstance(result, ExtractionResult)
    assert result.nodes
    assert result.rejected == 0


def test_malformed_rows_are_rejected_without_killing_the_batch():
    """A partial graph degrades the verdict; a crash loses the whole series."""
    rows = [
        '{"nodes": [{"id": "n-1", "episode": 1, "perceived_index": 1, "summary": "ok"}]}',
        "not json at all",
        '{"nodes": [{"id": "n-2", "episode": 2, "perceived_index": 2, "summary": "ok"}]}',
    ]
    parsed = [parse_extraction_row(row) for row in rows]
    assert sum(1 for item in parsed if item is None) == 1
    assert sum(1 for item in parsed if item is not None) == 2


def test_payoff_links_start_unverified():
    """Protection requires verification; trusting the extractor by default would
    let a hallucinated payoff suppress a real defect."""
    result = FakeExtractor().extract([{"episode": 1, "synopsis": "Asha finds a cassette."}])
    assert all(link.verified is False for link in result.payoffs)

