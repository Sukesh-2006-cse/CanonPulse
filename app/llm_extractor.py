"""Episode text -> dual-layer graph, via a real model call instead of rules.

`HeuristicExtractor` is a deterministic floor: it runs offline with no external
dependencies. `LLMExtractor` connects to OpenAI-compatible chat completions
endpoints (local models like Ollama / LM Studio / vLLM, or OpenAI API).

Cost discipline: responses are cached to disk keyed by a hash of
(model, prompt), so re-running against a warm cache is free and makes no
network call -- this is also what lets the test suite run with no network and
no credentials. The cache file holds only model output text; it never
contains a token, endpoint, or any other credential.
"""

from __future__ import annotations

import hashlib
import json
import time
import urllib.request
from pathlib import Path
from typing import Protocol

from pydantic import ValidationError

from app.extraction import ExtractionResult, attach_provenance, parse_extraction_row
from app.extraction_models import ExtractionContext
from app.narrative_models import Excerpt, LedgerEntry, NarrativeNode, PayoffLink

# Prompt template for local/remote LLM narrative structure extraction.
_PROMPT_TEMPLATE = (
    "Extract narrative structure as JSON. Return keys: nodes, entries, payoffs, excerpts. "
    "A node has id, episode, perceived_index, true_time (0-1 chronological position or null), "
    "summary, entities, valence (-1..1), excerpt_id. "
    "An entry has id, kind (contradiction|promise), description, episodes, excerpt_ids, urgency (1-5), entities. "
    "A payoff has node_id, target_id, episode, rationale. "
    "Respond with JSON only, no prose, no markdown fences. "
    "Episode {episode}: {text}"
)


class Transport(Protocol):
    """Sends one chat-completion request, returns the raw message content.

    Tests inject a fake implementation so the suite never touches the
    network; `_http_transport` is the only implementation that does.
    """

    def __call__(self, *, endpoint: str, token: str, model: str, prompt: str) -> str: ...


# Retry only what a retry can fix: throttling and transient gateway faults.
# A 401 or 400 is a configuration error and must surface immediately.
_RETRY_STATUS = frozenset({429, 500, 502, 503, 504})
_MAX_ATTEMPTS = 5
_BACKOFF_BASE_SECONDS = 4


def message_text(content: object) -> str:
    """Unwrap a chat-completion message's content into a plain string.

    Most OpenAI-compatible endpoints return a plain string. Reasoning-style
    models instead return a list of typed blocks -- a "reasoning" block plus a
    "text" block -- and the reasoning block is not the answer. Extracts and
    joins every "text" block, ignoring anything else.
    """
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = [block.get("text", "") for block in content if isinstance(block, dict) and block.get("type") == "text"]
        return "\n".join(parts)
    return ""


def _http_transport(*, endpoint: str, token: str, model: str, prompt: str) -> str:
    """OpenAI-compatible chat-completions POST. Used by both backends -- they
    differ only in endpoint URL, token, and model name, never in shape."""
    body = json.dumps(
        {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        endpoint,
        data=body,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    # Serving endpoints rate-limit under sustained batch load, and a 220-episode
    # run is exactly that. Without backoff a single 429 aborts the whole
    # measurement and discards every response already paid for.
    last_error: Exception | None = None
    for attempt in range(_MAX_ATTEMPTS):
        try:
            with urllib.request.urlopen(request, timeout=120) as response:  # noqa: S310
                payload = json.loads(response.read().decode("utf-8"))
            return message_text(payload["choices"][0]["message"]["content"])
        except urllib.error.HTTPError as error:  # noqa: PERF203
            last_error = error
            if error.code not in _RETRY_STATUS or attempt == _MAX_ATTEMPTS - 1:
                raise
            time.sleep(_BACKOFF_BASE_SECONDS * (2**attempt))
    raise last_error  # pragma: no cover - loop always returns or raises above


def prompt_for(episode: int, text: str) -> str:
    """Build the extraction prompt for one episode.

    The single place the prompt is constructed. Callers that need to predict a
    cache key before spending money -- the measurement script does, to estimate
    how many uncached calls a run will make -- must go through here rather than
    formatting their own copy of the template. A divergent copy silently
    computes different cache keys, so the estimate shown before a spend decision
    would describe a different run than the one that executes.
    """
    return _PROMPT_TEMPLATE.format(episode=episode, text=text)


def cache_key(model: str, prompt: str) -> str:
    """Hash of (model, prompt) -- changing either invalidates the cache entry
    cleanly rather than silently serving a stale answer for a new question."""
    return hashlib.sha256(f"{model}\n{prompt}".encode("utf-8")).hexdigest()


def backend_for(endpoint: str) -> str:
    """Which backend an endpoint URL names."""
    ep = endpoint.lower()
    if "openai" in ep:
        return "openai"
    return "local"


class LLMExtractor:
    """Extractor backed by one OpenAI-compatible chat-completions endpoint.

    Conforms to `app.extraction.Extractor`. ``backend`` (derived from
    ``endpoint``) is set on every returned `ExtractionResult`.
    """

    def __init__(
        self,
        endpoint: str,
        token: str,
        model: str,
        cache_path: str | Path | None = None,
        transport: Transport | None = None,
    ) -> None:
        self._endpoint = endpoint
        self._token = token
        self._model = model
        self._cache_path = Path(cache_path) if cache_path else None
        self._transport = transport or _http_transport
        self.backend = backend_for(endpoint)
        self._cache: dict[str, str] = {}
        if self._cache_path and self._cache_path.exists():
            self._cache = json.loads(self._cache_path.read_text(encoding="utf-8"))

    def extract(self, episodes: list[dict], context: ExtractionContext | None = None) -> ExtractionResult:
        result = ExtractionResult(backend=self.backend)
        cache_dirty = False

        for row in episodes:
            validated = self._validate_row(row)
            if validated is None:
                result.rejected += 1
                continue
            episode, text = validated

            prompt = prompt_for(episode, text)
            key = cache_key(self._model, prompt)
            if key in self._cache:
                raw = self._cache[key]
            else:
                raw = self._transport(
                    endpoint=self._endpoint, token=self._token, model=self._model, prompt=prompt
                )
                self._cache[key] = raw
                cache_dirty = True

            parsed = parse_extraction_row(raw)
            if parsed is None:
                result.rejected += 1
                continue

            # One malformed item makes the whole row's contribution suspect,
            # so it is rejected wholesale rather than item-by-item.
            # The batch itself continues.
            try:
                nodes = [NarrativeNode.model_validate(item) for item in parsed.get("nodes", [])]
                entries = [LedgerEntry.model_validate(item) for item in parsed.get("entries", [])]
                # verified is forced False regardless of what the model
                # claims -- an extracted payoff is a claim, not a fact, and
                # trusting the model's own "verified" field would let a
                # hallucinated payoff suppress a real defect.
                payoffs = [
                    PayoffLink.model_validate({**item, "verified": False})
                    for item in parsed.get("payoffs", [])
                ]
                excerpts = [Excerpt.model_validate(item) for item in parsed.get("excerpts", [])]
            except ValidationError:
                result.rejected += 1
                continue

            result.nodes.extend(nodes)
            result.entries.extend(entries)
            result.payoffs.extend(payoffs)
            result.excerpts.extend(excerpts)

        if cache_dirty and self._cache_path is not None:
            self._cache_path.parent.mkdir(parents=True, exist_ok=True)
            self._cache_path.write_text(
                json.dumps(self._cache, indent=2, sort_keys=True), encoding="utf-8"
            )

        if context is not None:
            attach_provenance(result, episodes, context)
        return result

    @staticmethod
    def _validate_row(row: object) -> tuple[int, str] | None:
        if not isinstance(row, dict):
            return None
        try:
            episode = int(row.get("episode"))  # type: ignore[arg-type]
        except (TypeError, ValueError):
            return None
        text = row.get("synopsis") or row.get("body") or ""
        if not isinstance(text, str) or not text.strip():
            return None
        return episode, text
