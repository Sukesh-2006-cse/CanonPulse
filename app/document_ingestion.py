"""Normalize parsed document elements into CanonPulse episodes.

This module handles identifying episode boundaries and preserving the source
locations needed for cited findings.
"""

from __future__ import annotations

import hashlib
import re
from collections import defaultdict
from collections.abc import Mapping
from pathlib import PurePosixPath

from pydantic import BaseModel, Field

from app.ingestion_models import EpisodeInput, SubmissionInput


class DocumentNormalizationResult(BaseModel):
    submission: SubmissionInput
    source_hash: str
    review_required: bool = False
    warnings: list[str] = Field(default_factory=list)


_EPISODE_HEADING = re.compile(r"\b(?:episode|chapter|part)\s*[-#:]*\s*(\d+)\b", re.I)
_EPISODE_FILENAME = re.compile(r"(?:episode|chapter|part)[-_ ]*(\d+)", re.I)


def _episode_from_path(source_path: str) -> int | None:
    match = _EPISODE_FILENAME.search(PurePosixPath(source_path).name)
    return int(match.group(1)) if match else None


def _element_page(element: Mapping) -> int | None:
    bbox = element.get("bbox") or []
    if not bbox or not isinstance(bbox, list):
        return None
    first = bbox[0] if isinstance(bbox[0], Mapping) else {}
    page_id = first.get("page_id")
    return int(page_id) + 1 if isinstance(page_id, (int, float)) else None


def _elements(parsed: Mapping) -> list[Mapping]:
    document = parsed.get("document") or {}
    elements = document.get("elements") or []
    return [element for element in elements if isinstance(element, Mapping)]


def normalize_parsed_document(
    parsed: Mapping,
    *,
    source_path: str,
    series_id: str,
    title: str,
    genre: str,
    ongoing: bool = True,
    default_episode: int | None = None,
    language: str = "en",
) -> DocumentNormalizationResult:
    """Turn one ``ai_parse_document`` result into a validated submission.

    A file can contain multiple episodes when section headers identify them.
    A file without such a header is treated as one episode only when its
    filename or ``default_episode`` supplies a number; otherwise the caller
    gets a review-required result instead of an invented episode number.
    """

    buckets: dict[int, list[str]] = defaultdict(list)
    pages: dict[int, set[int]] = defaultdict(set)
    element_ids: dict[int, list[int]] = defaultdict(list)
    current_episode = default_episode or _episode_from_path(source_path)
    warnings: list[str] = []
    unassigned: list[tuple[str, int | None, int]] = []

    for position, element in enumerate(_elements(parsed)):
        kind = str(element.get("type") or "text")
        content = str(element.get("content") or "").strip()
        if kind in {"page_header", "page_footer", "page_number"} or not content:
            continue

        heading_match = _EPISODE_HEADING.search(content) if kind in {"title", "section_header", "text"} else None
        if heading_match:
            current_episode = int(heading_match.group(1))
            # The heading is structural metadata, not narrative prose.
            content = _EPISODE_HEADING.sub("", content, count=1).strip(" :-")
            if not content:
                continue

        if current_episode is None:
            unassigned.append((content, _element_page(element), int(element.get("id", position))))
            continue

        buckets[current_episode].append(content)
        page = _element_page(element)
        if page is not None:
            pages[current_episode].add(page)
        raw_id = element.get("id", position)
        if isinstance(raw_id, (int, float)):
            element_ids[current_episode].append(int(raw_id))

    if not buckets:
        if not unassigned:
            raise ValueError("document contains no episode text")
        # SubmissionInput requires at least one episode. Keep the content in a
        # provisional episode so the UI can ask the user to correct it rather
        # than dropping text or pretending the boundary was known.
        provisional_episode = 1
        warnings.append("episode boundary could not be inferred; episode 1 is provisional and requires review")
        for content, page, element_id in unassigned:
            buckets[provisional_episode].append(content)
            if page is not None:
                pages[provisional_episode].add(page)
            element_ids[provisional_episode].append(element_id)

    episodes = [
        EpisodeInput(
            episode_number=episode,
            text="\n\n".join(parts),
            writer_id="unknown",
            language=language,
            source_path=source_path,
            source_pages=sorted(pages[episode]),
            source_element_ids=element_ids[episode],
        )
        for episode, parts in sorted(buckets.items())
    ]
    if warnings:
        warnings = sorted(set(warnings))
    submission = SubmissionInput(
        series_id=series_id,
        title=title,
        genre=genre,
        episodes=episodes,
        ongoing=ongoing,
    )
    source_hash = hashlib.sha256(
        "\n".join(f"{episode.episode_number}:{episode.text}" for episode in episodes).encode()
    ).hexdigest()
    return DocumentNormalizationResult(
        submission=submission,
        source_hash=source_hash,
        review_required=bool(warnings),
        warnings=warnings,
    )
