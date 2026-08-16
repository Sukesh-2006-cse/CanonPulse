from __future__ import annotations

import json

import pytest

from app.extraction import ExtractionResult
from app.llm_extractor import LLMExtractor, backend_for, cache_key, message_text


def _episodes() -> list[dict]:
    """Independent of every CanonPulse manifest, deliberately -- see the same
    rule documented on `tests/test_heuristic_extractor.py`'s fixture. This
    extractor must never be tuned against `data/manifest/last_monsoon.yaml`,
    so its test fixture must not share vocabulary with it either."""
    return [
        {"series_id": "s", "episode": 1, "synopsis": "Rina buries a tin box under the fig tree, swearing to dig it up before the rains."},
        {"series_id": "s", "episode": 9, "synopsis": "Rina says she can't ride a bicycle, not since the accident."},
    ]


def _valid_response(episode: int) -> str:
    return json.dumps(
        {
            "nodes": [
                {
                    "id": f"n-{episode}",
                    "episode": episode,
                    "perceived_index": episode,
                    "summary": "ok",
                    "excerpt_id": f"ex-{episode}",
                }
            ],
            "entries": [],
            "payoffs": [
                {
                    "node_id": f"n-{episode}",
                    "target_id": "some-target",
                    "episode": episode,
                    "rationale": "model claims this resolves something",
                    "verified": True,
                }
            ],
            "excerpts": [{"id": f"ex-{episode}", "episode": episode, "text": "ok"}],
        }
    )


class RecordingTransport:
    """Fake transport: records every call, replays canned responses keyed by
    prompt substring (the episode number embedded in the prompt)."""

    def __init__(self, responses: dict[int, str] | None = None, default: str | None = None):
        self._responses = responses or {}
        self._default = default
        self.calls: list[dict] = []

    def __call__(self, *, endpoint: str, token: str, model: str, prompt: str) -> str:
        self.calls.append({"endpoint": endpoint, "token": token, "model": model, "prompt": prompt})
        for episode, response in self._responses.items():
            if f"Episode {episode}" in prompt:
                return response
        if self._default is not None:
            return self._default
        raise AssertionError(f"no canned response for prompt: {prompt!r}")


class ExplodingTransport:
    """A transport that fails the test if it is ever invoked -- used to prove
    a warm cache makes zero network calls."""

    def __call__(self, **kwargs):
        raise AssertionError("transport must not be called when the cache is warm")


def test_conforms_to_the_extractor_protocol():
    transport = RecordingTransport({1: _valid_response(1), 9: _valid_response(9)})
    extractor = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        transport=transport,
    )
    result = extractor.extract(_episodes())
    assert isinstance(result, ExtractionResult)
    assert result.nodes
    assert result.rejected == 0


def test_malformed_response_increments_rejected_without_raising():
    transport = RecordingTransport(default="not json at all")
    extractor = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        transport=transport,
    )
    result = extractor.extract(_episodes())
    assert result.rejected == 2
    assert result.nodes == []


def test_schema_invalid_response_is_rejected_not_raised():
    # Valid JSON, but a node missing the required "summary" field.
    bad = json.dumps({"nodes": [{"id": "n-1", "episode": 1, "perceived_index": 1}]})
    transport = RecordingTransport(default=bad)
    extractor = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        transport=transport,
    )
    result = extractor.extract(_episodes())
    assert result.rejected == 2
    assert result.nodes == []


def test_emitted_payoff_links_are_forced_unverified_even_if_the_model_says_otherwise():
    transport = RecordingTransport(default=_valid_response(1))
    extractor = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        transport=transport,
    )
    result = extractor.extract(_episodes())
    assert result.payoffs
    assert all(link.verified is False for link in result.payoffs)


def test_deterministic_replay_from_a_warm_cache_makes_no_network_call(tmp_path):
    cache_path = tmp_path / "cache.json"
    transport = RecordingTransport({1: _valid_response(1), 9: _valid_response(9)})
    first = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        cache_path=cache_path,
        transport=transport,
    )
    first_result = first.extract(_episodes())
    assert len(transport.calls) == 2
    assert cache_path.exists()

    exploding = ExplodingTransport()
    second = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        cache_path=cache_path,
        transport=exploding,
    )
    second_result = second.extract(_episodes())
    assert second_result.model_dump() == first_result.model_dump()


def test_no_credentials_are_ever_written_into_the_cache_file(tmp_path):
    cache_path = tmp_path / "cache.json"
    transport = RecordingTransport({1: _valid_response(1), 9: _valid_response(9)})
    extractor = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-super-secret-token",
        model="gpt-4o-mini",
        cache_path=cache_path,
        transport=transport,
    )
    extractor.extract(_episodes())
    raw = cache_path.read_text(encoding="utf-8")
    assert "sk-super-secret-token" not in raw


def test_backend_is_local_for_a_local_endpoint():
    extractor = LLMExtractor(
        endpoint="http://127.0.0.1:11434/v1/chat/completions",
        token="tok",
        model="llama3",
        transport=RecordingTransport(),
    )
    assert extractor.backend == "local"


def test_backend_is_openai_for_the_openai_endpoint():
    extractor = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        transport=RecordingTransport(),
    )
    assert extractor.backend == "openai"


def test_backend_label_travels_with_the_extraction_result():
    transport = RecordingTransport(default=_valid_response(1))
    extractor = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        transport=transport,
    )
    result = extractor.extract(_episodes())
    assert result.backend == "openai"


def test_cache_key_changes_when_the_model_changes():
    prompt = "Extract narrative structure as JSON. Episode 1: hello."
    assert cache_key("gpt-4o-mini", prompt) != cache_key("gpt-4o", prompt)


def test_backend_for_helper_matches_extractor_behaviour():
    assert backend_for("http://127.0.0.1:11434/v1/chat/completions") == "local"
    assert backend_for("https://api.openai.com/v1/chat/completions") == "openai"


def test_empty_input_yields_empty_result_without_any_call():
    extractor = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        transport=ExplodingTransport(),
    )
    result = extractor.extract([])
    assert result.nodes == [] and result.rejected == 0


def test_message_text_passes_through_a_plain_string():
    assert message_text("plain content") == "plain content"


def test_message_text_unpacks_a_reasoning_model_content_array():
    content = [
        {"type": "reasoning", "summary": [{"type": "summary_text", "text": "thinking..."}]},
        {"type": "text", "text": '{"nodes": []}'},
    ]
    assert message_text(content) == '{"nodes": []}'


def test_message_text_joins_multiple_text_blocks():
    content = [{"type": "text", "text": "part one"}, {"type": "text", "text": "part two"}]
    assert message_text(content) == "part one\npart two"


def test_message_text_returns_empty_string_for_a_content_array_with_no_text_block():
    content = [{"type": "reasoning", "summary": []}]
    assert message_text(content) == ""


def test_malformed_row_in_the_input_itself_is_rejected_without_calling_the_transport():
    exploding = ExplodingTransport()
    extractor = LLMExtractor(
        endpoint="https://api.openai.com/v1/chat/completions",
        token="sk-fake",
        model="gpt-4o-mini",
        transport=exploding,
    )
    result = extractor.extract([{"episode": "not-an-int", "synopsis": "x"}, "not-a-dict"])
    assert result.rejected == 2
