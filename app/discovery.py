"""Deterministic obligation-index retrieval and Explain Why output."""

from __future__ import annotations

import re
import hashlib
from collections.abc import Iterable
from typing import Protocol

from pydantic import BaseModel, Field

from app.narrative_models import Excerpt, Series


def _terms(text: str) -> set[str]:
    return {word for word in re.findall(r"[a-zA-Z']+", text.lower()) if len(word) > 2}


class EvidenceHit(BaseModel):
    series_id: str
    excerpt_id: str
    episode: int
    score: float
    text: str
    source_version: str
    source_hash: str
    matched_dimensions: list[str] = Field(default_factory=list)


class DiscoveryMatch(BaseModel):
    series_id: str
    title: str
    score: float
    dimensions: list[str]
    explanation: str
    citation_ids: list[str]
    obligation_ids: list[str] = Field(default_factory=list)


class DiscoveryResult(BaseModel):
    query: str
    simulation_disclosure: str = "Discovery ranks obligation shape; it is not a claim about real audience behavior."
    matches: list[DiscoveryMatch] = Field(default_factory=list)


class EvidenceRepository:
    def __init__(self, series: Iterable[Series]) -> None:
        self._series = {item.id: item for item in series}

    def search(self, series_id: str, query: str, *, min_episode: int | None = None, max_episode: int | None = None) -> list[EvidenceHit]:
        current = self._series.get(series_id)
        if current is None:
            return []
        query_terms = _terms(query)
        hits: list[EvidenceHit] = []
        for excerpt in current.excerpts:
            if min_episode is not None and excerpt.episode < min_episode:
                continue
            if max_episode is not None and excerpt.episode > max_episode:
                continue
            overlap = query_terms & _terms(excerpt.text)
            if not overlap:
                continue
            hits.append(EvidenceHit(series_id=series_id, excerpt_id=excerpt.id, episode=excerpt.episode, score=len(overlap) / max(1, len(query_terms)), text=excerpt.text, source_version=current.source_version, source_hash=hashlib.sha256(excerpt.text.encode()).hexdigest(), matched_dimensions=sorted(overlap)))
        return sorted(hits, key=lambda hit: (-hit.score, hit.episode, hit.excerpt_id))





def discover(series: Series, query: str) -> DiscoveryResult:
    repo = EvidenceRepository([series])
    hits = repo.search(series.id, query)
    if not hits:
        # Mood words often do not appear literally. The index still returns the
        # most relevant unresolved obligation with a transparent structural
        # dimension rather than pretending a semantic embedding exists locally.
        hits = [EvidenceHit(series_id=series.id, excerpt_id=excerpt.id, episode=excerpt.episode, score=0.01, text=excerpt.text, source_version=series.source_version, source_hash=hashlib.sha256(excerpt.text.encode()).hexdigest(), matched_dimensions=["unresolved_obligation"]) for excerpt in series.excerpts[:1]]
    match = None
    if hits:
        dimensions = ["unresolved_obligation"]
        if any(word in query.lower() for word in ("heartbreak", "love", "longing")):
            dimensions.append("emotional_payoff")
        if any(word in query.lower() for word in ("rain", "slow", "sunday")):
            dimensions.append("atmospheric_pace")
        top = hits[0]
        obligation_ids = [
            entry.id for entry in series.entries if top.excerpt_id in entry.excerpt_ids
        ]
        match = DiscoveryMatch(series_id=series.id, title=series.title, score=top.score, dimensions=dimensions, explanation=f"Matched {', '.join(dimensions)} using Ep {top.episode} evidence.", citation_ids=[top.excerpt_id], obligation_ids=obligation_ids)
    return DiscoveryResult(query=query, matches=[match] if match else [])
