"""OpenAI-backed Writers Room persona handler and repair-text generation.

Both reuse app.llm_extractor's transport/cache-key/backend-label machinery
rather than a second HTTP client. Both are opt-in: callers only construct
these when app.llm_config.openai_config() returns non-None; the deterministic
paths in app.personas and app.variants remain the default everywhere else.
"""

from __future__ import annotations

import json
from pathlib import Path

from app.extraction import parse_extraction_row
from app.ledger import LedgerResolver
from app.llm_extractor import Transport, _http_transport, backend_for, cache_key
from app.narrative_models import Series
from app.personas import Persona

_PERSONA_PROMPT = (
    "You are the {name} in a serialized fiction Writers Room. Your focus is "
    "{focus}. Review this open story obligation and respond with JSON only, "
    "no prose, no markdown fences: "
    '{{"issue_ids": ["{issue_id}"], "confidence": <float 0-1>, '
    '"reason_codes": ["<short_snake_case_code>", ...]}}. '
    "Obligation: {description}"
)


class LLMPersonaHandler:
    """Callable matching AgentRunner's `handler(persona, graph, budget) -> dict`."""

    def __init__(self, endpoint: str, token: str, model: str, cache_path: str | Path | None = None, transport: Transport | None = None) -> None:
        self._endpoint = endpoint
        self._token = token
        self._model = model
        self._transport = transport or _http_transport
        self.backend = backend_for(endpoint)
        self._cache_path = Path(cache_path) if cache_path else None
        self._cache: dict[str, str] = {}
        if self._cache_path and self._cache_path.exists():
            self._cache = json.loads(self._cache_path.read_text(encoding="utf-8"))

    def __call__(self, persona: Persona, graph: Series, budget: int) -> dict:
        resolved = [item for item in LedgerResolver().resolve_series(graph) if item.state != "paid"]
        if not resolved:
            return {
                "persona_id": persona.id,
                "issue_ids": (),
                "confidence": 0.0,
                "reason_codes": ("no_open_obligations",),
                "latency_ms": 0.0,
                "timed_out": False,
            }
        item = resolved[0]
        prompt = _PERSONA_PROMPT.format(
            name=persona.name, focus=persona.focus, issue_id=item.entry.id, description=item.entry.description
        )
        key = cache_key(self._model, prompt)
        if key in self._cache:
            raw = self._cache[key]
        else:
            raw = self._transport(endpoint=self._endpoint, token=self._token, model=self._model, prompt=prompt)
            self._cache[key] = raw
            if self._cache_path is not None:
                self._cache_path.parent.mkdir(parents=True, exist_ok=True)
                self._cache_path.write_text(json.dumps(self._cache, indent=2, sort_keys=True), encoding="utf-8")

        parsed = parse_extraction_row(raw)
        if parsed is None:
            return {
                "persona_id": persona.id,
                "issue_ids": (item.entry.id,),
                "confidence": 0.0,
                "reason_codes": ("malformed_model_output",),
                "latency_ms": 0.0,
                "timed_out": False,
            }
        return {
            "persona_id": persona.id,
            "issue_ids": tuple(parsed.get("issue_ids", [item.entry.id])),
            "confidence": float(parsed.get("confidence", 0.5)),
            "reason_codes": tuple(parsed.get("reason_codes", ["llm_review"])) or ("llm_review",),
            "latency_ms": 0.0,
            "timed_out": False,
        }


_REPAIR_PROMPT = (
    "Rewrite the following scene summary so it no longer contradicts the "
    "stated obligation, changing as little as possible. Respond with the "
    "replacement summary text only -- no prose, no JSON, no quotes, no "
    "markdown fences.\n"
    "Obligation it must stop contradicting: {description}\n"
    "Original scene summary: {summary}"
)


def propose_repair_text(
    series: Series,
    target_entry_id: str,
    node_id: str,
    *,
    endpoint: str,
    token: str,
    model: str,
    cache_path: str | Path | None = None,
    transport: Transport | None = None,
) -> tuple[str, str]:
    """Generate replacement text for one corrupt node via a real model call.

    Returns (replacement_text, backend). Callers still go through
    RepairEngine.repair for the actual graph mutation, node targeting, and
    "only a broken entry may be repaired" rule -- this function only produces
    the text that mutation needs.
    """
    entry = next((item for item in series.entries if item.id == target_entry_id), None)
    if entry is None:
        raise ValueError(f"unknown ledger entry: {target_entry_id}")
    node = next((item for item in series.nodes if item.id == node_id), None)
    if node is None:
        raise ValueError(f"unknown repair node: {node_id}")

    prompt = _REPAIR_PROMPT.format(description=entry.description, summary=node.summary)
    transport_fn = transport or _http_transport
    backend = backend_for(endpoint)

    cache_file = Path(cache_path) if cache_path else None
    cache: dict[str, str] = {}
    if cache_file and cache_file.exists():
        cache = json.loads(cache_file.read_text(encoding="utf-8"))

    key = cache_key(model, prompt)
    from app.tracing import trace_span

    with trace_span("repair_candidate_generation", entry_id=target_entry_id, node_id=node_id, model=model) as span:
        if key in cache:
            raw = cache[key]
            span.set_attribute("cached", True)
        else:
            raw = transport_fn(endpoint=endpoint, token=token, model=model, prompt=prompt)
            cache[key] = raw
            span.set_attribute("cached", False)
            if cache_file is not None:
                cache_file.parent.mkdir(parents=True, exist_ok=True)
                cache_file.write_text(json.dumps(cache, indent=2, sort_keys=True), encoding="utf-8")

    return raw.strip(), backend

