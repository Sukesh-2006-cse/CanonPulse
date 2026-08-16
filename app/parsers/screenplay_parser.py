"""Screenplay and serialized script parser for Fountain, Final Draft (FDX), and audio dramas.

Extracts scene headings, character cues, dialogue, parentheticals, and actions
into structured CanonPulse elements with preserved reading order and page/scene offsets.
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any


_SCENE_HEADING_REGEX = re.compile(
    r"^(?:\.|\b(?:INT|EXT|EST|INT\./EXT|INT/EXT|I/E)\b[\.\s])", re.I
)
_EPISODE_HEADING_REGEX = re.compile(
    r"^(?:#+\s*|\b)(?:episode|chapter|part|act)\s*[-#:]*\s*\d+\b.*$", re.I
)
_TRANSITION_REGEX = re.compile(r"^(?:[A-Z\s]+TO:|>.*|<.*>)$")
_CHARACTER_REGEX = re.compile(r"^[A-Z0-9\s_\-\'\.]+(?:\s*\(.*?\))?$")


class ScreenplayParser:
    """Parser for Fountain (.fountain, .spmd, .txt) and Final Draft XML (.fdx) scripts."""

    def parse_file(self, file_path: str | Path) -> dict[str, Any]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Screenplay file not found: {file_path}")

        suffix = path.suffix.lower()
        if suffix == ".fdx":
            content_bytes = path.read_bytes()
            elements = self.parse_fdx_to_elements(content_bytes.decode("utf-8", errors="replace"), source_path=str(path))
        else:
            text = path.read_text(encoding="utf-8", errors="replace")
            elements = self.parse_fountain_to_elements(text, source_path=str(path))

        return {"document": {"elements": elements}}

    def parse_bytes(self, content_bytes: bytes, filename: str) -> dict[str, Any]:
        suffix = Path(filename).suffix.lower()
        text = content_bytes.decode("utf-8", errors="replace")
        if suffix == ".fdx" or "<FinalDraft" in text[:500]:
            elements = self.parse_fdx_to_elements(text, source_path=filename)
        else:
            elements = self.parse_fountain_to_elements(text, source_path=filename)

        return {"document": {"elements": elements}}

    def parse_fountain_to_elements(self, text: str, source_path: str = "") -> list[dict[str, Any]]:
        """Parse Fountain-formatted script into sequential elements."""
        # Strip boneyard comments /* ... */
        clean_text = re.sub(r"/\*.*?\*/", "", text, flags=re.DOTALL)
        lines = clean_text.splitlines()

        elements: list[dict[str, Any]] = []
        elem_id = 0
        current_page = 0
        lines_per_page = 55

        buffer: list[str] = []

        def flush_buffer(buf: list[str], page: int) -> None:
            nonlocal elem_id
            if not buf:
                return
            content = "\n".join(buf).strip()
            if content:
                elements.append({
                    "id": elem_id,
                    "type": "text",
                    "content": content,
                    "bbox": [{"page_id": page, "l": 72, "t": 100, "r": 540, "b": 700}],
                })
                elem_id += 1
            buf.clear()

        idx = 0
        while idx < len(lines):
            line = lines[idx]
            stripped = line.strip()
            current_page = idx // lines_per_page

            if not stripped:
                flush_buffer(buffer, current_page)
                idx += 1
                continue

            # Check Title Page key-values at start
            if idx < 10 and ":" in stripped and not stripped.startswith("#"):
                key_prefix = stripped.split(":", 1)[0].lower()
                if key_prefix in {"title", "author", "authors", "credit", "source", "draft date", "contact", "copyright"}:
                    flush_buffer(buffer, current_page)
                    elements.append({
                        "id": elem_id,
                        "type": "title",
                        "content": stripped,
                        "bbox": [{"page_id": current_page, "l": 72, "t": 50, "r": 540, "b": 70}],
                    })
                    elem_id += 1
                    idx += 1
                    continue

            # Section headers / Episode boundaries
            if stripped.startswith("#") or _EPISODE_HEADING_REGEX.match(stripped):
                flush_buffer(buffer, current_page)
                clean_heading = stripped.lstrip("#").strip()
                elements.append({
                    "id": elem_id,
                    "type": "section_header",
                    "content": clean_heading or stripped,
                    "bbox": [{"page_id": current_page, "l": 72, "t": 72, "r": 540, "b": 95}],
                })
                elem_id += 1
                idx += 1
                continue

            # Scene Headings (INT. / EXT. / .FORCED)
            if _SCENE_HEADING_REGEX.match(stripped):
                flush_buffer(buffer, current_page)
                scene_content = stripped[1:].strip() if stripped.startswith(".") else stripped
                elements.append({
                    "id": elem_id,
                    "type": "section_header" if _EPISODE_HEADING_REGEX.match(scene_content) else "text",
                    "content": scene_content,
                    "bbox": [{"page_id": current_page, "l": 72, "t": 90, "r": 540, "b": 110}],
                })
                elem_id += 1
                idx += 1
                continue

            # Character cue & dialogue block
            # If uppercase line followed by dialogue
            if (
                stripped.isupper()
                and len(stripped) < 40
                and not _TRANSITION_REGEX.match(stripped)
                and idx + 1 < len(lines)
                and lines[idx + 1].strip()
            ):
                flush_buffer(buffer, current_page)
                dialogue_block = [stripped]
                idx += 1
                while idx < len(lines) and lines[idx].strip():
                    dialogue_block.append(lines[idx].strip())
                    idx += 1
                elements.append({
                    "id": elem_id,
                    "type": "text",
                    "content": "\n".join(dialogue_block),
                    "bbox": [{"page_id": current_page, "l": 140, "t": 150, "r": 480, "b": 350}],
                })
                elem_id += 1
                continue

            # Normal action lines
            buffer.append(stripped)
            idx += 1

        flush_buffer(buffer, current_page)
        return elements

    def parse_fdx_to_elements(self, xml_content: str, source_path: str = "") -> list[dict[str, Any]]:
        """Parse Final Draft XML format (.fdx) into sequential elements."""
        elements: list[dict[str, Any]] = []
        elem_id = 0
        current_page = 0

        try:
            root = ET.fromstring(xml_content)
        except ET.ParseError:
            # Fallback: treat as plain text
            return self.parse_fountain_to_elements(xml_content, source_path=source_path)

        paragraphs = root.findall(".//Paragraph")
        for idx, para in enumerate(paragraphs):
            para_type = para.get("Type", "Action").strip()
            texts = [t.text for t in para.findall(".//Text") if t.text]
            content = " ".join(texts).strip()
            if not content:
                continue

            current_page = idx // 40

            kind = "text"
            if para_type in {"Scene Heading", "Slugline"}:
                kind = "section_header" if _EPISODE_HEADING_REGEX.match(content) else "text"
            elif _EPISODE_HEADING_REGEX.match(content):
                kind = "section_header"

            elements.append({
                "id": elem_id,
                "type": kind,
                "content": content,
                "bbox": [{"page_id": current_page, "l": 72, "t": 100, "r": 540, "b": 200}],
            })
            elem_id += 1

        return elements


def parse_screenplay_to_elements(file_path_or_text: str | Path) -> dict[str, Any]:
    parser = ScreenplayParser()
    path = Path(file_path_or_text)
    if path.exists():
        return parser.parse_file(path)
    return {"document": {"elements": parser.parse_fountain_to_elements(str(file_path_or_text))}}
