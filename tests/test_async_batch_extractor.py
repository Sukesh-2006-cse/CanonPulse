from __future__ import annotations

import pytest
import asyncio
from typing import Any

from app.narrative_models import NarrativeNode, LedgerEntry, PayoffLink, Excerpt
from app.structured_extractor import NarrativeExtractionSchema, clean_and_parse_structured_json
from app.async_batch_pipeline import AsyncBatchExtractor, BatchExtractionProgress


def test_structured_output_clean_and_parse_valid_json():
    raw_json = """
    {
        "nodes": [
            {"id": "n-1", "episode": 1, "perceived_index": 1, "true_time": 0.1, "summary": "Key found", "entities": ["char:raj"], "valence": 0.2, "excerpt_id": "ex-1"}
        ],
        "entries": [
            {"id": "le-1", "kind": "promise", "description": "Find the killer", "episodes": [1], "excerpt_ids": ["ex-1"], "urgency": 4, "promise_kind": "mystery", "entities": ["char:raj"]}
        ],
        "payoffs": [
            {"node_id": "n-1", "target_id": "n-2", "episode": 2, "rationale": "Setup", "verified": false}
        ],
        "excerpts": [
            {"id": "ex-1", "episode": 1, "text": "Raj found the key."}
        ]
    }
    """
    parsed = clean_and_parse_structured_json(raw_json)
    assert parsed is not None
    assert isinstance(parsed, NarrativeExtractionSchema)
    assert len(parsed.nodes) == 1
    assert parsed.nodes[0].id == "n-1"
    assert len(parsed.entries) == 1
    assert parsed.entries[0].kind == "promise"


def test_structured_output_handles_markdown_fences_and_reasoning_blocks():
    # Test with ```json fences and reasoning thoughts
    raw_with_fences = """
    <think>
    Thinking about narrative structures...
    </think>
    ```json
    {
        "nodes": [
            {"id": "n-2", "episode": 2, "perceived_index": 2, "true_time": 0.3, "summary": "Confrontation", "entities": ["char:vikram"], "valence": -0.5, "excerpt_id": "ex-2"}
        ],
        "entries": [],
        "payoffs": [],
        "excerpts": [
            {"id": "ex-2", "episode": 2, "text": "Vikram shouted."}
        ]
    }
    ```
    """
    parsed = clean_and_parse_structured_json(raw_with_fences)
    assert parsed is not None
    assert len(parsed.nodes) == 1
    assert parsed.nodes[0].summary == "Confrontation"


@pytest.mark.anyio
async def test_async_batch_extractor_processes_concurrent_episodes():
    episodes = [
        {"episode": 1, "synopsis": "Episode 1 synopsis", "series_id": "s1"},
        {"episode": 2, "synopsis": "Episode 2 synopsis", "series_id": "s1"},
        {"episode": 3, "synopsis": "Episode 3 synopsis", "series_id": "s1"},
    ]

    # Mock async transport that returns valid JSON
    async def mock_transport(endpoint: str, token: str, model: str, prompt: str) -> str:
        await asyncio.sleep(0.01)  # Simulate network latency
        return """
        {
            "nodes": [{"id": "n-1", "episode": 1, "perceived_index": 1, "true_time": 0.1, "summary": "Summary", "entities": [], "valence": 0.0, "excerpt_id": null}],
            "entries": [],
            "payoffs": [],
            "excerpts": []
        }
        """

    progress_records: list[BatchExtractionProgress] = []

    def on_progress(p: BatchExtractionProgress) -> None:
        progress_records.append(p)

    extractor = AsyncBatchExtractor(
        endpoint="http://localhost:11434/v1/chat/completions",
        model="llama3.1",
        concurrency=2,
        transport=mock_transport,
    )

    result = await extractor.extract_batch_async(episodes, on_progress=on_progress)

    assert len(result.nodes) == 3
    assert result.rejected == 0
    assert result.backend == "async-batch-worker"
    assert len(progress_records) == 3
    assert progress_records[-1].completed == 3
    assert progress_records[-1].total == 3


def test_structured_output_recovers_from_trailing_commas():
    raw_with_trailing_commas = """
    {
        "nodes": [
            {
                "id": "n-tc",
                "episode": 1,
                "perceived_index": 1,
                "true_time": 0.5,
                "summary": "Trailing comma test",
                "entities": ["char:test",],
                "valence": 0.0,
                "excerpt_id": null,
            },
        ],
        "entries": [],
        "payoffs": [],
        "excerpts": [],
    }
    """
    parsed = clean_and_parse_structured_json(raw_with_trailing_commas)
    assert parsed is not None
    assert len(parsed.nodes) == 1
    assert parsed.nodes[0].id == "n-tc"


def test_async_batch_extractor_sync_extract_wrapper():
    async def mock_transport(endpoint: str, token: str, model: str, prompt: str) -> str:
        return '{"nodes": [{"id": "n-sync", "episode": 1, "perceived_index": 1, "true_time": 0.1, "summary": "Sync", "entities": [], "valence": 0.0, "excerpt_id": null}], "entries": [], "payoffs": [], "excerpts": []}'

    extractor = AsyncBatchExtractor(
        endpoint="http://localhost:11434/v1/chat/completions",
        model="llama3.1",
        concurrency=1,
        transport=mock_transport,
    )

    result = extractor.extract([{"episode": 1, "synopsis": "Sync synopsis"}])
    assert len(result.nodes) == 1
    assert result.nodes[0].id == "n-sync"

