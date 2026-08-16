# Docling Document Parsing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:test-driven-development to implement this plan task-by-task.

**Goal:** Implement high-fidelity document structure parsing using **Docling (IBM Research)** to parse PDF/DOCX manuscripts into structured elements (reading order, section headers, element bounding boxes, and page numbers) for CanonPulse episode normalization and citation lineage.

**Architecture:** A standalone parser module `app/parsers/docling_parser.py` (and `app/parsers/__init__.py`) that converts raw PDF/DOCX files or byte streams into the standard CanonPulse document element representation. It integrates seamlessly with `app/document_ingestion.py::normalize_parsed_document`, exposes a direct FastAPI file upload endpoint (`POST /api/ingest/document-file`), and provides a deterministic lightweight fallback for offline test environments.

**Tech Stack:** Python 3.11+, Docling, PyMuPDF / fallback parser, Pydantic v2, FastAPI.

**Spec:** [`docs/superpowers/specs/2026-08-16-opensource-architecture-design.md`](file:///home/lathiss/Projects/CanonPulse/docs/superpowers/specs/2026-08-16-opensource-architecture-design.md)

---

## Proposed Changes

### 1. Document Parsing Subsystem (`app/parsers/`)

#### [NEW] [`app/parsers/__init__.py`](file:///home/lathiss/Projects/CanonPulse/app/parsers/__init__.py)
- Package entry point exporting `parse_document_with_docling`, `DoclingParser`, `DoclingParseResult`.

#### [NEW] [`app/parsers/docling_parser.py`](file:///home/lathiss/Projects/CanonPulse/app/parsers/docling_parser.py)
- Defines `DoclingParser` protocol and implementation.
- Converts Docling document nodes (headings, paragraphs, tables, lists) to CanonPulse element schema:
  - `id`: unique sequential element index.
  - `type`: `"title" | "section_header" | "text" | "table"`.
  - `content`: extracted text content.
  - `bbox`: `[{"page_id": page_index, "l": x0, "t": y0, "r": x1, "b": y1}]`.
- Supports reading order preservation and chapter/episode heading detection.
- Includes a lightweight deterministic fallback parser for environments where full docling runtime dependencies are optional.

### 2. Integration & API Endpoint

#### [MODIFY] [`app/document_ingestion.py`](file:///home/lathiss/Projects/CanonPulse/app/document_ingestion.py)
- Connect `normalize_parsed_document` with Docling output schema.
- Add helper `parse_and_normalize_file(file_path, ...)` to parse raw files into a complete `DocumentNormalizationResult`.

#### [MODIFY] [`app/main.py`](file:///home/lathiss/Projects/CanonPulse/app/main.py)
- Add `POST /api/ingest/document-file` endpoint supporting `UploadFile` (PDF/DOCX/TXT).
- Parses using `DoclingParser` and normalizes into submission episodes.

### 3. Test Suite

#### [NEW] [`tests/test_docling_parser.py`](file:///home/lathiss/Projects/CanonPulse/tests/test_docling_parser.py)
- Unit tests for Docling parser node-to-element mapping, reading order, bounding box extraction, and multi-episode chapter boundary detection.
- Test for `POST /api/ingest/document-file` API route.

---

## Verification Plan

### Automated Tests
```bash
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
uv run --group dev pytest tests/test_docling_parser.py tests/test_document_ingestion.py
uv run --group dev pytest
```

### Manual Verification
- Test file ingestion via FastAPI TestClient on sample PDF/DOCX payloads.
