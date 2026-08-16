"""Open-Source Observability & Tracing Subsystem.

Provides OpenTelemetry-compatible tracing for LLM agent calls, Writers Room
persona interactions, prompt versioning, and token usage with export formats
for Langfuse (Self-Hosted) and Arize Phoenix.
"""

from __future__ import annotations

import time
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Any, Generator
from pydantic import BaseModel, Field

from app.observability import OperationalEvent


class LocalTraceSpan(BaseModel):
    """Structured span representing an agent step, LLM call, or pipeline stage."""

    name: str
    trace_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    span_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    parent_id: str | None = None
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ended_at: datetime | None = None
    status: str = "ok"
    attributes: dict[str, Any] = Field(default_factory=dict)

    def set_attribute(self, key: str, value: Any) -> None:
        self.attributes[key] = value

    def finish(self, status: str = "ok") -> None:
        self.ended_at = datetime.now(timezone.utc)
        self.status = status


class TracingManager:
    """Collects and exports OpenTelemetry/Langfuse/Phoenix traces."""

    def __init__(self) -> None:
        self._spans: list[LocalTraceSpan] = []
        self._events: list[OperationalEvent] = []

    @contextmanager
    def span(self, name: str, **attributes: Any) -> Generator[LocalTraceSpan, None, None]:
        span = LocalTraceSpan(name=name, attributes=attributes)
        try:
            yield span
            span.finish(status="ok")
        except Exception as exc:
            span.set_attribute("error", str(exc))
            span.finish(status="error")
            raise
        finally:
            self._spans.append(span)

    def record_event(self, event: OperationalEvent) -> None:
        self._events.append(event.model_copy(deep=True))

    def get_spans(self) -> list[LocalTraceSpan]:
        return list(self._spans)

    def get_events(self) -> list[OperationalEvent]:
        return list(self._events)

    def export_langfuse_traces(self) -> list[dict[str, Any]]:
        """Format captured spans into Langfuse-compatible JSON ingestion payload."""
        traces = []
        for s in self._spans:
            duration_s = (
                (s.ended_at - s.started_at).total_seconds()
                if s.ended_at and s.started_at
                else 0.0
            )
            traces.append({
                "id": s.trace_id,
                "name": s.name,
                "timestamp": s.started_at.isoformat(),
                "duration": duration_s,
                "status": s.status,
                "metadata": s.attributes,
                "prompt_tokens": s.attributes.get("tokens_prompt", 0),
                "completion_tokens": s.attributes.get("tokens_completion", 0),
                "total_tokens": (
                    s.attributes.get("tokens_prompt", 0)
                    + s.attributes.get("tokens_completion", 0)
                ),
            })
        return traces

    def export_phoenix_traces(self) -> list[dict[str, Any]]:
        """Format captured spans into Arize Phoenix OpenTelemetry format."""
        return [
            {
                "context": {
                    "trace_id": s.trace_id,
                    "span_id": s.span_id,
                },
                "name": s.name,
                "start_time": s.started_at.isoformat(),
                "end_time": s.ended_at.isoformat() if s.ended_at else s.started_at.isoformat(),
                "status": {"code": s.status.upper()},
                "attributes": s.attributes,
            }
            for s in self._spans
        ]


GLOBAL_TRACER = TracingManager()


def trace_span(name: str, **attributes: Any):
    return GLOBAL_TRACER.span(name, **attributes)
