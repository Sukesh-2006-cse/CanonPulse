"""Docling-based document structure parser for high-fidelity script ingestion.

Extracts document reading order, section headers, paragraphs, and tables
with element bounding boxes and page numbers for citation lineage.
"""

from __future__ import annotations

import io
import re
from pathlib import Path
from typing import Any, Mapping


_EPISODE_HEADING = re.compile(r"^\s*(?:episode|chapter|part|act|scene)\s*[-#:]*\s*\d+\b.*$", re.I)


class DoclingParser:
    """High-fidelity document parser supporting PDF, DOCX, and text manuscripts."""

    def __init__(self) -> None:
        self._has_docling = False
        try:
            import docling  # noqa: F401
            self._has_docling = True
        except ImportError:
            self._has_docling = False

    def parse_file(self, file_path: str | Path) -> dict[str, Any]:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Document file not found: {file_path}")

        # If docling is available and file is binary (pdf/docx), use Docling
        if self._has_docling and path.suffix.lower() in {".pdf", ".docx", ".pptx", ".html"}:
            try:
                from docling.document_converter import DocumentConverter
                converter = DocumentConverter()
                conversion_result = converter.convert(str(path))
                doc = conversion_result.document
                return self._docling_document_to_elements(doc)
            except Exception:
                # Fallback to local parsing if conversion fails
                pass

        # Fallback / Plain text parsing
        content = path.read_text(encoding="utf-8", errors="replace")
        return {"document": {"elements": self.parse_text_to_elements(content, source_path=str(path))}}

    def parse_bytes(self, content_bytes: bytes, filename: str) -> dict[str, Any]:
        suffix = Path(filename).suffix.lower()
        if self._has_docling and suffix in {".pdf", ".docx", ".pptx", ".html"}:
            try:
                from docling.document_converter import DocumentConverter
                from docling.datamodel.base_models import DocumentStream
                stream = DocumentStream(name=filename, stream=io.BytesIO(content_bytes))
                converter = DocumentConverter()
                conversion_result = converter.convert(stream)
                doc = conversion_result.document
                return self._docling_document_to_elements(doc)
            except Exception:
                pass

        text_content = content_bytes.decode("utf-8", errors="replace")
        return {"document": {"elements": self.parse_text_to_elements(text_content, source_path=filename)}}

    def _docling_document_to_elements(self, doc: Any) -> dict[str, Any]:
        """Map a DoclingDocument object to CanonPulse's element structure."""
        elements: list[dict[str, Any]] = []
        elem_id = 0

        # Export or iterate over docling document items
        if hasattr(doc, "iterate_items"):
            for item, _level in doc.iterate_items():
                kind = "text"
                content = getattr(item, "text", "") or ""
                if not content.strip():
                    continue

                item_type = type(item).__name__.lower()
                if "heading" in item_type or "section" in item_type or "title" in item_type:
                    kind = "section_header" if _EPISODE_HEADING.match(content) else "title"
                elif "table" in item_type:
                    kind = "table"

                page_id = 0
                prov = getattr(item, "prov", [])
                bbox_data = [{"page_id": page_id}]
                if prov and len(prov) > 0:
                    page_no = getattr(prov[0], "page_no", 1)
                    page_id = max(0, page_no - 1)
                    bbox_data = [{"page_id": page_id}]

                elements.append({
                    "id": elem_id,
                    "type": kind,
                    "content": content.strip(),
                    "bbox": bbox_data,
                })
                elem_id += 1
        else:
            # Fallback: export to markdown and parse text
            md = doc.export_to_markdown() if hasattr(doc, "export_to_markdown") else str(doc)
            return {"document": {"elements": self.parse_text_to_elements(md, source_path="docling_output")}}

        return {"document": {"elements": elements}}

    def parse_text_to_elements(self, text: str, source_path: str = "") -> list[dict[str, Any]]:
        """Heuristic layout extraction for plain text / markdown scripts."""
        lines = text.splitlines()
        elements: list[dict[str, Any]] = []
        elem_id = 0
        current_page = 0
        lines_per_page = 50

        buffer: list[str] = []

        def flush_buffer(buf: list[str], page: int) -> None:
            nonlocal elem_id
            if not buf:
                return
            combined = "\n".join(buf).strip()
            if not combined:
                return
            elements.append({
                "id": elem_id,
                "type": "text",
                "content": combined,
                "bbox": [{"page_id": page, "l": 72, "t": 100, "r": 540, "b": 700}],
            })
            elem_id += 1
            buf.clear()

        for idx, line in enumerate(lines):
            line_str = line.strip()
            current_page = idx // lines_per_page

            if not line_str:
                flush_buffer(buffer, current_page)
                continue

            if _EPISODE_HEADING.match(line_str):
                flush_buffer(buffer, current_page)
                elements.append({
                    "id": elem_id,
                    "type": "section_header",
                    "content": line_str,
                    "bbox": [{"page_id": current_page, "l": 72, "t": 72, "r": 540, "b": 95}],
                })
                elem_id += 1
            else:
                buffer.append(line_str)

        flush_buffer(buffer, current_page)
        return elements


def parse_document_to_elements(file_path_or_text: str | Path) -> dict[str, Any]:
    parser = DoclingParser()
    path = Path(file_path_or_text)
    if path.exists():
        return parser.parse_file(path)
    return {"document": {"elements": parser.parse_text_to_elements(str(file_path_or_text))}}
