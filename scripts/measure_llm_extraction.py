#!/usr/bin/env python3
"""Measure end-to-end discrimination with `LLMExtractor` over a real series.

This is the script a user runs, with their own credentials, to turn the
headline from "heuristic floor 0.0" into "heuristic floor 0.0, model
extractor X". It is not part of the test suite and must never run during
`pytest` -- it makes real network calls and costs real money the first time
it sees a given (model, prompt) pair.

Credentials, never hardcoded, read from the environment:

    OPENAI_API_KEY        API key (or local endpoint token)
    OPENAI_MODEL          defaults to "gpt-4o-mini"
    OPENAI_BASE_URL       defaults to "https://api.openai.com/v1/chat/completions" (or local e.g. "http://127.0.0.1:11434/v1/chat/completions")

If not set, this script exits with a clear, actionable message.

Usage:
  uv run --group dev python scripts/measure_llm_extraction.py [--limit N] [--cache-path PATH]

`--limit N` runs only the first N episodes (by episode number), so a
sanity check on a handful of episodes costs a handful of calls, not 220.
The script prints an estimated call count -- episodes about to be sent
that are not already in the cache -- before it spends anything.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))

from app.evaluation import _episode_rows, evaluate_series  # noqa: E402
from app.heuristic_extractor import HeuristicExtractor  # noqa: E402
from app.llm_extractor import LLMExtractor, cache_key, prompt_for  # noqa: E402
from app.manifest import load_manifest  # noqa: E402
from app.series_loader import load_series  # noqa: E402

SERIES_PATH = REPO_ROOT / "data" / "series" / "alice_in_wonderland.json"
MANIFEST_PATH = REPO_ROOT / "data" / "manifest" / "alice_in_wonderland.yaml"
DEFAULT_CACHE_PATH = REPO_ROOT / "data" / "extraction_cache" / "alice_in_wonderland_llm.json"

class CredentialsError(RuntimeError):
    pass


def _resolve_credentials() -> tuple[str, str, str]:
    """Returns (endpoint, token, model). Raises CredentialsError with an
    actionable message rather than letting a KeyError/stack trace surface."""
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key:
        endpoint = os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1/chat/completions")
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        return endpoint, openai_key, model

    raise CredentialsError(
        "No LLM credentials found.\n\n"
        "Set:\n"
        "  OPENAI_API_KEY (and optionally OPENAI_BASE_URL / OPENAI_MODEL)\n\n"
        "Then re-run:\n"
        "  uv run --group dev python scripts/measure_llm_extraction.py\n"
    )


def _estimate_uncached_calls(rows: list[dict], model: str, cache_path: Path) -> int:
    cached_keys: set[str] = set()
    if cache_path.exists():
        import json

        cached_keys = set(json.loads(cache_path.read_text(encoding="utf-8")).keys())
    uncached = 0
    for row in rows:
        episode = row.get("episode")
        text = row.get("synopsis") or row.get("body") or ""
        # Must go through the extractor's own builder: a local copy of the
        # template would compute different cache keys, so this estimate would
        # describe a different run than the one that actually executes.
        prompt = prompt_for(episode, text)
        if cache_key(model, prompt) not in cached_keys:
            uncached += 1
    return uncached


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Skip the spend confirmation. Required when running non-interactively.",
    )
    parser.add_argument("--limit", type=int, default=None, help="only send the first N episodes")
    parser.add_argument(
        "--cache-path", type=Path, default=DEFAULT_CACHE_PATH, help="response cache file"
    )
    parser.add_argument("--series", type=Path, default=SERIES_PATH)
    parser.add_argument("--manifest", type=Path, default=MANIFEST_PATH)
    args = parser.parse_args()

    try:
        endpoint, token, model = _resolve_credentials()
    except CredentialsError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    llm_extractor = LLMExtractor(
        endpoint=endpoint, token=token, model=model or "default", cache_path=args.cache_path
    )
    print(f"Backend: {llm_extractor.backend}", end="")
    print(" (GOVERNED, on-platform path)" if llm_extractor.backend == "databricks" else " (off-platform, measurement only -- NOT the governed path)")
    print(f"Model:   {model or '(endpoint default)'}")
    print(f"Cache:   {args.cache_path}")

    series = load_series(args.series)
    manifest = load_manifest(args.manifest)
    rows = _episode_rows(series)
    if args.limit is not None:
        rows = sorted(rows, key=lambda row: row["episode"])[: args.limit]

    estimated_calls = _estimate_uncached_calls(rows, model or "default", args.cache_path)
    print(f"Episodes to process: {len(rows)}")
    print(f"Estimated new API calls (not already cached): {estimated_calls}")
    if estimated_calls > 0 and not args.yes:
        # Interactive by default: this spends money, so a human confirms unless
        # they have explicitly said otherwise. --yes exists because input()
        # raises EOFError under any non-interactive runner.
        try:
            confirm = input(f"Proceed with {estimated_calls} call(s) to {llm_extractor.backend}? [y/N] ")
        except EOFError:
            print("Not a terminal. Re-run with --yes to confirm the spend.")
            return 1
        if confirm.strip().lower() not in {"y", "yes"}:
            print("Aborted.")
            return 1

    llm_result = llm_extractor.extract(rows)
    limited_series = series
    if args.limit is not None:
        limited_series = series.model_copy(
            update={"nodes": [node for node in series.nodes if node.episode in {r["episode"] for r in rows}]}
        )

    llm_report = evaluate_series(limited_series, manifest, extractor=llm_extractor)
    heuristic_report = evaluate_series(limited_series, manifest, extractor=HeuristicExtractor())

    print()
    print("=" * 72)
    print(f"{'metric':<24}{'heuristic (floor)':<22}{'LLM (' + llm_extractor.backend + ')':<22}")
    print("-" * 72)
    for label, attr in [("precision", "precision"), ("recall", "recall"), ("holes_caught", "holes_caught"), ("twists_protected", "twists_protected"), ("false_positives", "false_positives")]:
        h_value = getattr(heuristic_report.extracted, attr)
        l_value = getattr(llm_report.extracted, attr)
        print(f"{label:<24}{str(h_value):<22}{str(l_value):<22}")
    print("=" * 72)
    print(f"Rejected rows (LLM): {llm_result.rejected}")
    print(f"Backend that produced this number: {llm_extractor.backend}")
    if llm_extractor.backend != "databricks":
        print(
            "NOTE: this number came from the off-platform OpenAI path and must not be "
            "presented as the governed Databricks result."
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
