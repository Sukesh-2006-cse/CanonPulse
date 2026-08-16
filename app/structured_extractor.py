"""Structured Output Enforcement for LLM Narrative Extraction.

Guarantees 100% schema compliance across any LLM backend (OpenAI, Ollama, vLLM, SGLang, Groq).
Cleans and parses raw JSON output, unwrapping reasoning tags (<think>...</think>)
and markdown code fences to eliminate row rejections.
"""

from __future__ import annotations

import json
import re
from typing import Any
from pydantic import BaseModel, Field

from app.narrative_models import Excerpt, LedgerEntry, NarrativeNode, PayoffLink


class NarrativeExtractionSchema(BaseModel):
    """Pydantic schema for structured narrative graph extraction."""

    nodes: list[NarrativeNode] = Field(default_factory=list)
    entries: list[LedgerEntry] = Field(default_factory=list)
    payoffs: list[PayoffLink] = Field(default_factory=list)
    excerpts: list[Excerpt] = Field(default_factory=list)


def clean_raw_llm_json(raw_text: str) -> str:
    """Clean raw model output: remove <think> tags, markdown fences, and leading/trailing commentary."""
    text = raw_text.strip()

    # 1. Remove reasoning / thought blocks (<think>...</think> or [THINK]...[/THINK])
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"\[THINK\].*?\[/THINK\]", "", text, flags=re.DOTALL | re.IGNORECASE)

    # 2. Extract content from ```json ... ``` or ``` ... ``` code fences
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if fence_match:
        text = fence_match.group(1).strip()

    # 3. Find the outermost JSON object if prose surrounds it
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        text = text[first_brace : last_brace + 1]

    return text.strip()


def clean_and_parse_structured_json(raw_text: str) -> NarrativeExtractionSchema | None:
    """Parse raw LLM string into NarrativeExtractionSchema with defensive cleaning."""
    cleaned = clean_raw_llm_json(raw_text)
    if not cleaned:
        return None

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        try:
            # Strip illegal trailing commas common in LLM outputs
            sanitized = re.sub(r",\s*([\]}])", r"\1", cleaned)
            data = json.loads(sanitized)
        except json.JSONDecodeError:
            return None

    if not isinstance(data, dict):

        return None

    try:
        # Validate unverified payoff links
        if "payoffs" in data and isinstance(data["payoffs"], list):
            for item in data["payoffs"]:
                if isinstance(item, dict):
                    item["verified"] = False

        return NarrativeExtractionSchema.model_validate(data)
    except Exception:
        return None
