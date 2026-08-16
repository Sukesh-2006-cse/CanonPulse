"""Asyncio Worker Pool Pipeline for High-Throughput Batch Graph Extraction.

Processes 10 to 300+ episodes concurrently with semaphore rate limiting,
exponential backoff, streaming progress callbacks, and structured Pydantic output parsing.
Connects to SGLang, vLLM, Ollama, or any OpenAI-compatible serving backend.
"""

from __future__ import annotations

import asyncio
import json
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Coroutine
from pydantic import BaseModel, Field

from app.extraction import ExtractionResult
from app.extraction_models import ExtractionFailure
from app.structured_extractor import clean_and_parse_structured_json


_PROMPT_TEMPLATE = (
    "Extract narrative structure as JSON. Return keys: nodes, entries, payoffs, excerpts. "
    "A node has id, episode, perceived_index, true_time (0-1 chronological position or null), "
    "summary, entities, valence (-1..1), excerpt_id. "
    "An entry has id, kind (contradiction|promise), description, episodes, excerpt_ids, urgency (1-5), promise_kind (mystery|causal|relationship|emotional|genre), entities. "
    "A payoff has node_id, target_id, episode, rationale. "
    "Respond with JSON only, no prose, no markdown fences. "
    "Episode {episode}: {text}"
)


class BatchExtractionProgress(BaseModel):
    completed: int
    total: int
    current_episode: int
    status: str = "ok"
    error: str | None = None


async def _default_async_http_transport(endpoint: str, token: str, model: str, prompt: str) -> str:
    """Default async HTTP transport for OpenAI/vLLM/SGLang/Ollama chat completions."""
    import httpx

    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    body = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(endpoint, json=body, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


class AsyncBatchExtractor:
    """High-throughput asynchronous batch extractor with worker pool concurrency."""

    def __init__(
        self,
        endpoint: str = "http://localhost:11434/v1/chat/completions",
        token: str = "",
        model: str = "llama3.1",
        concurrency: int = 20,
        max_retries: int = 5,
        transport: Callable[[str, str, str, str], Coroutine[Any, Any, str]] | None = None,
    ) -> None:
        self.endpoint = endpoint
        self.token = token
        self.model = model
        self.concurrency = concurrency
        self.max_retries = max_retries
        self._transport = transport or _default_async_http_transport

    async def _extract_single_episode(
        self,
        episode_row: dict[str, Any],
        semaphore: asyncio.Semaphore,
    ) -> tuple[int, Any, list[ExtractionFailure]]:
        episode_num = int(episode_row.get("episode", 1))
        text = str(episode_row.get("synopsis") or episode_row.get("body") or "")
        prompt = _PROMPT_TEMPLATE.format(episode=episode_num, text=text)
        failures: list[ExtractionFailure] = []

        async with semaphore:
            for attempt in range(1, self.max_retries + 1):
                try:
                    raw_response = await self._transport(
                        self.endpoint, self.token, self.model, prompt
                    )
                    parsed = clean_and_parse_structured_json(raw_response)
                    if parsed is not None:
                        return episode_num, parsed, failures

                    # If parsing failed on valid HTTP, record failure
                    failures.append(
                        ExtractionFailure(
                            episode=episode_num,
                            stage="structured_parsing",
                            error="Model response could not be parsed into schema",
                            retryable=False,
                            attempt=attempt,
                        )
                    )
                    break
                except Exception as exc:
                    failures.append(
                        ExtractionFailure(
                            episode=episode_num,
                            stage="http_transport",
                            error=str(exc)[:300],
                            retryable=attempt < self.max_retries,
                            attempt=attempt,
                        )
                    )
                    if attempt < self.max_retries:
                        await asyncio.sleep(min(2 ** attempt, 10))

        return episode_num, None, failures

    async def extract_batch_async(
        self,
        episodes: list[dict[str, Any]],
        on_progress: Callable[[BatchExtractionProgress], None] | None = None,
    ) -> ExtractionResult:
        """Asynchronously process a batch of episodes with concurrency control."""
        if not episodes:
            return ExtractionResult(backend="async-batch-worker")

        semaphore = asyncio.Semaphore(self.concurrency)
        total = len(episodes)
        completed = 0

        tasks = [self._extract_single_episode(ep, semaphore) for ep in episodes]

        result = ExtractionResult(backend="async-batch-worker")

        for coro in asyncio.as_completed(tasks):
            episode_num, parsed, failures = await coro
            completed += 1

            if failures:
                result.failures.extend(failures)

            if parsed is not None:
                result.nodes.extend(parsed.nodes)
                result.entries.extend(parsed.entries)
                result.payoffs.extend(parsed.payoffs)
                result.excerpts.extend(parsed.excerpts)
            else:
                result.rejected += 1

            if on_progress:
                on_progress(
                    BatchExtractionProgress(
                        completed=completed,
                        total=total,
                        current_episode=episode_num,
                        status="ok" if parsed is not None else "failed",
                    )
                )

        return result

    def extract(self, episodes: list[dict[str, Any]]) -> ExtractionResult:
        """Synchronous wrapper for compatibility with the Extractor protocol."""
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None

        if loop is not None and loop.is_running():
            import concurrent.futures

            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                return pool.submit(asyncio.run, self.extract_batch_async(episodes)).result()
        return asyncio.run(self.extract_batch_async(episodes))

