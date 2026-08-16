from __future__ import annotations

import pytest
from pathlib import Path
from datetime import datetime, timezone

from app.tracing import LocalTraceSpan, TracingManager, trace_span
from app.observability import OperationalEvent, RunContext


def test_tracing_manager_records_spans_and_calculates_metrics():
    tracer = TracingManager()

    with tracer.span("writers_room_critique", persona="lore_master", prompt_version="v2.1") as span:
        span.set_attribute("tokens_prompt", 150)
        span.set_attribute("tokens_completion", 80)
        span.set_attribute("latency_ms", 45.2)

    spans = tracer.get_spans()
    assert len(spans) == 1
    assert spans[0].name == "writers_room_critique"
    assert spans[0].attributes["persona"] == "lore_master"
    assert spans[0].attributes["prompt_version"] == "v2.1"
    assert spans[0].attributes["tokens_prompt"] == 150
    assert spans[0].attributes["tokens_completion"] == 80


def test_tracing_manager_export_to_langfuse_payload():
    tracer = TracingManager()
    with tracer.span("extract_episode_graph", episode=1, model="llama3.1"):
        pass

    payloads = tracer.export_langfuse_traces()
    assert len(payloads) == 1
    assert payloads[0]["name"] == "extract_episode_graph"
    assert payloads[0]["metadata"]["episode"] == 1
    assert payloads[0]["metadata"]["model"] == "llama3.1"


def test_operational_event_integration_with_tracer():
    tracer = TracingManager()
    event = OperationalEvent(
        event_name="extraction",
        context=RunContext(
            request_id="req-1",
            run_id="run-1",
            series_id="s1",
            version_id="v1",
            source_version="demo",
            model_version="v1",
        ),
        started_at=datetime.now(timezone.utc),
        finished_at=datetime.now(timezone.utc),
        latency_ms=12.5,
        status="ok",
        cost_usd=0.0,
    )
    tracer.record_event(event)
    assert len(tracer.get_events()) == 1
    assert tracer.get_events()[0].event_name == "extraction"
