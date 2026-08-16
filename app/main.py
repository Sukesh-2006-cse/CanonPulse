from __future__ import annotations

from dotenv import load_dotenv

load_dotenv()

import os
from datetime import datetime, timezone
from time import monotonic
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import TimeoutError as FutureTimeoutError
from functools import lru_cache
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, Query, Request, UploadFile
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import app.demo_mode as demo_mode
from app.corpus import normalize_within_book
from app.demo_mode import golden_path
from app.auth_context import actor_from_request, authorize_series, request_id as request_id_for
from app.evaluation import EndToEndReport, evaluate_series
from app.cohorts import COHORTS, divergence_by_episode, structural_reaction
from app.discovery import EvidenceRepository, discover
from app.features import FeatureExtractor
from app.foreshadowing import ForeshadowingEngine, ForeshadowingProposal
from app.health import check_liveness, check_readiness
from app.heuristic_extractor import HeuristicExtractor
from app.document_ingestion import normalize_parsed_document, parse_and_normalize_bytes
from app.ingestion import IngestJob, IngestService, IngestionCoordinator, RealIngestionExtractor, Submission
from app.ingestion_models import IngestionJob, IngestionStatus, SubmissionInput
from app.ingestion_repository import InMemorySubmissionRepository
from app.ledger import LedgerResolver, LedgerSummary
from app.manifest import load_manifest
from app.memory import MemoryQuery
from app.narrative_models import ResolvedEntry, Series
from app.observability import EVENT_SINK, OperationalEvent, RunContext
from app.llm_agents import LLMPersonaHandler, propose_repair_text
from app.llm_config import openai_config
from app.personas import AgentRunner, PERSONAS, WritersRoom, run_writers_room
from app.prepublish import PrePublishChecker, PrePublishRequest, PrePublishReport
from app.predictor import FEATURE_SCHEMA_VERSION, MODEL_VERSION, ContinuationPredictor, train_predictor
from app.rewrite import EditAttribution, RewriteReport, attribute_delta
from app.store import ApprovalAuditStore, SeriesStore, store_from_env
from app.scrambler import Scrambler
from app.surfaces import DebtBoardQuery, HandoffQuery, LocalizationChecker, LocalizationEpisode
from app.real_corpus import load_real_corpus_rows
from app.training_corpus import generate_synthetic_corpus
from app.variants import RepairEngine
from app.verifier import PayoffVerifier

SERIES_PATH = Path("data/series/last_monsoon.json")
MANIFEST_PATH = Path("data/manifest/last_monsoon.yaml")

# Every prediction shown by this app is fit to a documented synthetic corpus
# (app/training_corpus.py), not to observed reader behaviour. Repeated on
# every response that carries a prediction so the number can never be read as
# measured retention -- see the README honesty section.
PREDICTION_DISCLOSURE = (
    "This prediction is from a model trained on a synthetic corpus "
    "(app/training_corpus.py) with a fully documented generative process, "
    "not on observed reader or listener behaviour. It demonstrates the "
    "pipeline end to end; it is not a calibrated real-audience number."
)

_inference_executor = ThreadPoolExecutor(max_workers=2)


class AuditResponse(BaseModel):
    series_id: str
    source: str
    source_version: str
    headline: dict[str, int]
    findings: list[ResolvedEntry]


class RewriteRequest(BaseModel):
    before_episode: int
    after_episode: int
    edits: list[EditAttribution]


class RepairRequest(BaseModel):
    target_entry_id: str
    node_id: str
    replacement_summary: str | None = None


class ScrambleRequest(BaseModel):
    presentation_order: list[int]


class ForeshadowRequest(BaseModel):
    obligation_id: str
    insertion_episode: int
    clue_type: str


class LocalizationRequest(BaseModel):
    episode: int
    language: str
    text: str


class DocumentIngestRequest(BaseModel):
    parsed: dict
    source_path: str
    series_id: str
    title: str
    genre: str
    language: str = "en"
    ongoing: bool = True


@lru_cache(maxsize=1)
def _store() -> SeriesStore:
    """The single place that knows which source the series comes from.

    Loaded from local storage (see `app.store.store_from_env`).
    """
    store = store_from_env(os.environ, default_series_path=SERIES_PATH)
    print(f"[canonpulse] series store: {store.backend}")
    return store


@lru_cache(maxsize=1)
def _series_cached() -> Series:
    return _store().load()


def _series() -> Series:
    """A private, request-safe copy of the cached series.

    ``LedgerResolver`` can write to ``PayoffLink.verified`` during resolution,
    and pydantic models are mutable, so handing every request the exact same
    cached instance is a live cross-request corruption risk. Deep-copy at the
    cache boundary instead of inside every caller.
    """
    return _series_cached().model_copy(deep=True)


@lru_cache(maxsize=1)
def _resolved_cached() -> tuple[ResolvedEntry, ...]:
    # Resolve a copy, not the cached series. The default resolver has no verifier
    # and so never writes `PayoffLink.verified` today -- but the moment one is
    # configured, resolving the shared instance would permanently mark the
    # process-wide series on the very first call, which is the corruption
    # `_series()` exists to prevent.
    current = _series()
    return tuple(LedgerResolver(verifier=PayoffVerifier(current)).resolve_series(current))


def _resolved() -> tuple[ResolvedEntry, ...]:
    return tuple(item.model_copy(deep=True) for item in _resolved_cached())


@lru_cache(maxsize=1)
def _discrimination_report() -> EndToEndReport:
    """Both numbers, computed once at startup rather than per request.

    ``ledger`` scores the authored graph as-is (traversal only); ``extracted``
    runs the offline ``HeuristicExtractor`` over the series' own episode text
    first and scores what it rebuilds. ``_series()`` hands back a private
    deep copy, so `evaluate_series`'s internal `LedgerResolver.resolve_series`
    calls -- which can write `PayoffLink.verified` -- never touch the
    process-wide cached series, for the same reason `_resolved_cached` does
    not resolve it directly (see `_series`'s docstring).
    """
    return evaluate_series(_series(), load_manifest(MANIFEST_PATH), HeuristicExtractor())


@lru_cache(maxsize=1)
def _predictor() -> ContinuationPredictor:
    """Train once at startup (first use), not per request.

    Trained on the documented synthetic corpus -- see PREDICTION_DISCLOSURE
    and README -- so the pipeline runs end to end without a real reader-
    retention dataset, which does not exist in this repo.
    """
    rows = _training_rows()
    experiment = os.environ.get("MLFLOW_EXPERIMENT_ID") or None
    predictor, _report = train_predictor(rows, experiment=experiment)
    return predictor


# scripts/fetch_gutenberg_corpus.py downloads real public-domain novels here;
# untracked (~12MB, fully reproducible), so a fresh checkout trains
# synthetic-only until someone runs that script -- degrades, never fails.
GUTENBERG_RAW_PATH = Path("data/gutenberg_raw")


def _training_rows() -> list[dict]:
    """Synthetic rows plus real-prose rows (app/real_corpus.py) when present.

    Both carry structural features honestly -- synthetic's are fabricated by
    a stated formula, real_corpus's come from actually running the extractor
    -- and both still use a synthetic continue_rate label, so blending them
    does not change what PREDICTION_DISCLOSURE has to say.
    """
    return normalize_within_book(generate_synthetic_corpus() + load_real_corpus_rows(GUTENBERG_RAW_PATH))


def create_app() -> FastAPI:
    app = FastAPI(title="CanonPulse", version="0.2.0")
    ingest_service = IngestService()
    _ingestion_repository = InMemorySubmissionRepository()
    ingestion_coordinator = IngestionCoordinator(
        repository=_ingestion_repository,
        extractor=RealIngestionExtractor(_ingestion_repository),
    )
    approval_store = ApprovalAuditStore()

    @app.middleware("http")
    async def add_request_id(request, call_next):
        import uuid

        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        request.state.request_id = request_id
        started = datetime.now(timezone.utc)
        timer = monotonic()
        response = await call_next(request)
        EVENT_SINK.emit(
            OperationalEvent(
                event_name="request",
                context=RunContext(
                    request_id=request_id,
                    run_id=request_id,
                    series_id=request.headers.get("x-series-id", "unknown"),
                    version_id=request.headers.get("x-version-id", "unknown"),
                    source_version="unknown",
                    model_version=MODEL_VERSION,
                ),
                started_at=started,
                finished_at=datetime.now(timezone.utc),
                latency_ms=(monotonic() - timer) * 1000,
                status="ok" if response.status_code < 400 else "failed",
                cost_usd=0.0,
                metadata={"path": request.url.path, "status_code": str(response.status_code)},
            )
        )
        response.headers["x-request-id"] = request_id
        return response

    @app.get("/api/series")
    def series() -> dict:
        current = _series()
        return {
            "id": current.id,
            "title": current.title,
            "genre": current.genre,
            "total_episodes": current.total_episodes,
            "source_version": current.source_version,
            # Which source this response was built from -- "file" (local committed JSON)
            "source": _store().backend,
        }

    @app.get("/health/live")
    def health_live() -> dict:
        return check_liveness().model_dump()

    @app.get("/health/ready")
    def health_ready() -> dict:
        report = check_readiness()
        from fastapi.responses import JSONResponse

        return JSONResponse(status_code=200 if report.status == "ready" else 503, content=report.model_dump())

    @app.get("/api/audit", response_model=AuditResponse)
    def audit() -> AuditResponse:
        resolved = list(_resolved())
        summary = LedgerSummary(resolved)
        # Paid entries are correct behaviour, not findings -- surfacing them
        # would recreate the over-flagging this product exists to fix.
        findings = [item for item in resolved if item.state != "paid"]
        return AuditResponse(
            series_id=_series().id,
            source=_store().backend,
            source_version=_series().source_version,
            headline=summary.headline(),
            findings=findings,
        )

    @app.get("/api/memory")
    def memory(query: str = Query(min_length=1), episode: int | None = Query(default=None, ge=1), kind: str | None = Query(default=None), entity: str | None = Query(default=None), limit: int = Query(default=50, ge=1, le=200), offset: int = Query(default=0, ge=0)) -> dict:
        current = _series()
        horizon = episode if episode is not None else current.total_episodes
        if horizon > current.total_episodes:
            raise HTTPException(
                status_code=422,
                detail=f"episode {horizon} is past the end of the series ({current.total_episodes} episodes)",
            )
        filters = {key: value for key, value in {"kind": kind, "entity": entity}.items() if value}
        hits = MemoryQuery().search(current, query, horizon, filters, limit=limit, offset=offset)
        return {
            "series_id": current.id,
            "source": _store().backend,
            "query": query,
            "episode": horizon,
            "hits": [hit.model_dump() for hit in hits],
        }

    @app.post("/api/prepublish", response_model=PrePublishReport)
    def prepublish(payload: PrePublishRequest) -> PrePublishReport:
        current = _series()
        if payload.episode <= current.total_episodes:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"candidate episode must follow the published series; "
                    f"received {payload.episode} after {current.total_episodes}"
                ),
            )
        report, candidate_series = PrePublishChecker().check(current, payload)
        if report.complete:
            predictor = _predictor()
            before = predictor.predict(FeatureExtractor().extract(current, current.total_episodes))
            after = predictor.predict(FeatureExtractor().extract(candidate_series, payload.episode))
            report = report.model_copy(update={"retention_delta": after.value - before.value, "prediction": after})
        return report.model_copy(update={"source": _store().backend})

    @app.post("/api/submissions", response_model=IngestJob, status_code=201)
    def submit_series(payload: Submission) -> IngestJob:
        return ingest_service.submit(payload)

    @app.post("/api/v2/ingestions", response_model=IngestionJob, status_code=202)
    def create_ingestion(payload: SubmissionInput) -> IngestionJob:
        return ingestion_coordinator.submit(payload)

    @app.get("/api/v2/ingestions/{job_id}", response_model=IngestionStatus)
    def ingestion_status(job_id: str) -> IngestionStatus:
        try:
            return ingestion_coordinator._status(job_id)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc

    @app.post("/api/v2/ingestions/{job_id}/cancel", response_model=IngestionStatus)
    def cancel_ingestion(job_id: str) -> IngestionStatus:
        try:
            return ingestion_coordinator.cancel(job_id)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc

    @app.post("/api/v2/ingestions/{job_id}/retry", response_model=IngestionStatus)
    def retry_ingestion(job_id: str) -> IngestionStatus:
        try:
            return ingestion_coordinator.retry(job_id)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc

    @app.get("/api/v2/ingestions/{job_id}/series")
    def ingestion_series(job_id: str) -> dict:
        try:
            return ingestion_coordinator.series(job_id).model_dump()
        except KeyError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc

    @app.post("/api/ingest/document", status_code=202)
    def ingest_document(payload: DocumentIngestRequest) -> dict:
        try:
            normalized = normalize_parsed_document(
                payload.parsed,
                source_path=payload.source_path,
                series_id=payload.series_id,
                title=payload.title,
                genre=payload.genre,
                ongoing=payload.ongoing,
                language=payload.language,
            )
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        job = ingestion_coordinator.submit(normalized.submission)
        return {
            "job": job.model_dump(mode="json"),
            "review_required": normalized.review_required,
            "warnings": normalized.warnings,
        }

    @app.post("/api/ingest/document-file")
    async def ingest_document_file(
        file: UploadFile = File(...),
        series_id: str = Form(...),
        title: str = Form(...),
        genre: str = Form(...),
        ongoing: bool = Form(True),
        language: str = Form("en"),
    ) -> dict:
        """Upload and parse a manuscript file (PDF, DOCX, TXT) via DoclingParser."""
        content = await file.read()
        try:
            normalized = parse_and_normalize_bytes(
                content_bytes=content,
                filename=file.filename or "uploaded_document",
                series_id=series_id,
                title=title,
                genre=genre,
                ongoing=ongoing,
                language=language,
            )
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc

        job = ingestion_coordinator.submit(normalized.submission)
        return {
            "job": job.model_dump(mode="json"),
            "series_id": normalized.submission.series_id,
            "episodes": [ep.model_dump(mode="json") for ep in normalized.submission.episodes],
            "review_required": normalized.review_required,
            "warnings": normalized.warnings,
        }


    @app.get("/api/v2/series/{series_id}/version/{version_id}")
    def scoped_series(series_id: str, version_id: str, request: Request) -> dict:
        try:
            authorize_series(actor_from_request(request), series_id, version_id)
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail={"code": "unauthorized", "message": str(exc)}) from exc
        current = _series()
        return {
            "request_id": request.state.request_id,
            "series_id": series_id,
            "version_id": version_id,
            "title": current.title,
            "genre": current.genre,
            "total_episodes": current.total_episodes,
        }

    @app.post("/api/v2/series/{series_id}/versions/{version_id}/issues/{issue_id}/approve")
    def approve_issue(series_id: str, version_id: str, issue_id: str, request: Request) -> dict:
        try:
            actor = actor_from_request(request)
            authorize_series(actor, series_id, version_id)
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail={"code": "unauthorized", "message": str(exc)}) from exc
        event = approval_store.approve(series_id, version_id, issue_id, actor.actor_id, request.state.request_id)
        return {"request_id": request.state.request_id, "series_id": series_id, "version_id": version_id, "event": event.model_dump(mode="json")}

    @app.get("/api/v2/series/{series_id}/versions/{version_id}/audit")
    def approval_audit(series_id: str, version_id: str, request: Request) -> dict:
        try:
            authorize_series(actor_from_request(request), series_id, version_id)
        except PermissionError as exc:
            raise HTTPException(status_code=403, detail={"code": "unauthorized", "message": str(exc)}) from exc
        return {
            "request_id": request.state.request_id,
            "series_id": series_id,
            "version_id": version_id,
            "events": [event.model_dump(mode="json") for event in approval_store.events(series_id, version_id)],
        }

    @app.get("/api/submissions/{job_id}", response_model=IngestJob)
    def submission_status(job_id: str) -> IngestJob:
        try:
            return ingest_service.get(job_id)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc

    @app.post("/api/submissions/{job_id}/deep", response_model=IngestJob)
    def run_deep_extraction(job_id: str) -> IngestJob:
        try:
            return ingest_service.run_deep(job_id)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc

    @app.get("/api/handoff")
    def handoff(writer_id: str = Query(min_length=1), episode: int | None = Query(default=None, ge=1)) -> dict:
        current = _series()
        horizon = episode or current.total_episodes
        try:
            sheet = HandoffQuery().for_writer(current, writer_id, horizon)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        return sheet.model_dump()

    @app.get("/api/debt-board")
    def debt_board(writer_id: str | None = Query(default=None), state: str | None = Query(default=None), genre: str | None = Query(default=None), urgency: int | None = Query(default=None, ge=1, le=5)) -> dict:
        current = _series()
        board = DebtBoardQuery().aggregate([(current, {int(key): value for key, value in current.episode_writers.items()})], writer_id=writer_id, state=state, genre=genre, urgency=urgency)
        return board.model_dump()

    @app.post("/api/localization")
    def localization(payload: LocalizationRequest) -> dict:
        current = _series()
        source = next((excerpt for excerpt in current.excerpts if excerpt.episode == payload.episode), None)
        if source is None:
            raise HTTPException(status_code=404, detail=f"no source excerpt for episode {payload.episode}")
        report = LocalizationChecker().check(source, LocalizationEpisode.model_validate(payload.model_dump()), current)
        return report.model_dump()

    @app.get("/api/cohorts")
    def cohorts() -> dict:
        current = _series()
        extractor = FeatureExtractor()
        reactions = []
        for episode in range(1, current.total_episodes + 1):
            features = extractor.extract(current, episode).to_vector()
            excerpt = next((item for item in current.excerpts if item.episode == episode), None)
            for cohort in COHORTS:
                reaction = structural_reaction(cohort, episode, features).model_copy(update={"citation_ids": [excerpt.id] if excerpt else []})
                reactions.append(reaction.model_dump())
        return {"series_id": current.id, "source": _store().backend, "disclosure": "Cohorts are a bounded structural simulation, not observed listener behavior.", "cohorts": [cohort.model_dump() for cohort in COHORTS], "reactions": reactions, "divergence": divergence_by_episode(reactions)}

    @app.get("/api/discover")
    def discovery(query: str = Query(min_length=1)) -> dict:
        return discover(_series(), query).model_dump()

    @app.get("/api/diagnostics")
    def diagnostics() -> dict:
        report = _discrimination_report()
        predictor = _predictor()
        return {
            "series_id": _series().id,
            "series_source": _store().backend,
            "model_version": MODEL_VERSION,
            "feature_schema_version": FEATURE_SCHEMA_VERSION,
            "mlflow_run_id": getattr(predictor, "mlflow_run_id", None),
            "discrimination": report.model_dump(),
            "disclosure": PREDICTION_DISCLOSURE,
        }

    @app.post("/api/repair")
    def repair(payload: RepairRequest) -> dict:
        current = _series()
        replacement_summary = payload.replacement_summary
        repair_backend = "caller-supplied"
        if replacement_summary is None:
            config = openai_config()
            if config is None:
                raise HTTPException(
                    status_code=422,
                    detail="replacement_summary was not supplied and OPENAI_API_KEY is not configured to generate one",
                )
            try:
                replacement_summary, repair_backend = propose_repair_text(
                    current, payload.target_entry_id, payload.node_id,
                    endpoint=config.endpoint, token=config.token, model=config.model,
                    cache_path="data/extraction_cache/repair_openai.json",
                )
            except ValueError as exc:
                raise HTTPException(status_code=422, detail=str(exc)) from exc
        try:
            variant = RepairEngine().repair(current, payload.target_entry_id, payload.node_id, replacement_summary)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        result = variant.model_dump()
        result["repair_backend"] = repair_backend
        result["score"] = _predictor().score_variant(current, variant.series, current.total_episodes).model_dump()
        return result

    @app.post("/api/scramble")
    def scramble(payload: ScrambleRequest) -> dict:
        try:
            variant = Scrambler().scramble(_series(), payload.presentation_order)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        return variant.model_dump()

    @app.post("/api/foreshadowing")
    def foreshadowing(payload: ForeshadowRequest) -> dict:
        try:
            proposal = ForeshadowingEngine().propose(_series(), payload.obligation_id, payload.insertion_episode, payload.clue_type)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        return proposal.model_dump()

    @app.get("/api/writers-room")
    def writers_room(episode: int | None = Query(default=None, ge=1), use_llm: bool = Query(default=False)) -> dict:
        current = _series()
        if not use_llm:
            return {"series_id": current.id, "backend": "deterministic-structured", "annotations": [item.model_dump() for item in WritersRoom().review(current, episode)]}

        config = openai_config()
        if config is None:
            raise HTTPException(status_code=422, detail="use_llm=true requires OPENAI_API_KEY to be configured")
        handler = LLMPersonaHandler(
            endpoint=config.endpoint, token=config.token, model=config.model,
            cache_path="data/extraction_cache/writers_room_openai.json",
        )
        result = run_writers_room(current, PERSONAS, runner=AgentRunner(handler))
        return {
            "series_id": current.id,
            "backend": handler.backend,
            "annotations": [annotation.model_dump() for annotation in result.annotations],
            "timeouts": result.timeouts,
            "disagreements": [item.model_dump() for item in result.disagreements],
        }

    @app.get("/api/discrimination", response_model=EndToEndReport)
    def discrimination() -> EndToEndReport:
        return _discrimination_report()

    @app.get("/api/predict")
    def predict(episode: int = Query(ge=1)) -> dict:
        series = _series()
        # A boundary past the finale does not exist. Unbounded, the extractor
        # happily reports an obligation age in the tens of thousands and the
        # model renders a confident percentage for it.
        if episode > series.total_episodes:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"episode {episode} is past the end of the series "
                    f"({series.total_episodes} episodes)"
                ),
            )
        features = FeatureExtractor().extract(series, episode)
        predictor = _predictor()

        future = _inference_executor.submit(predictor.predict, features)
        try:
            prediction = future.result(timeout=demo_mode.INFERENCE_TIMEOUT_SECONDS)
        except FutureTimeoutError:
            # Wired-up offline fallback: a slow inference call genuinely
            # switches to the golden path rather than blocking or erroring.
            return {
                "episode": episode,
                "features": features.to_vector(),
                "prediction": None,
                "degraded": True,
                "fallback": golden_path(),
                "disclosure": PREDICTION_DISCLOSURE,
            }

        return {
            "episode": episode,
            "features": features.to_vector(),
            "prediction": prediction.model_dump(),
            "degraded": False,
            "disclosure": PREDICTION_DISCLOSURE,
        }

    @app.post("/api/rewrite", response_model=RewriteReport)
    def rewrite(payload: RewriteRequest) -> RewriteReport:
        """Attribute a rewrite's predicted movement to named edits.

        `total_delta` is never taken from the caller -- both predictions come
        from the same trained predictor, so the number being attributed is
        guaranteed to have come from the frozen model rather than a
        caller-supplied claim.
        """
        series = _series()
        for label, episode in (
            ("before_episode", payload.before_episode),
            ("after_episode", payload.after_episode),
        ):
            if not 1 <= episode <= series.total_episodes:
                raise HTTPException(
                    status_code=422,
                    detail=f"{label} {episode} is outside episodes 1-{series.total_episodes}",
                )
        # Running the window backwards inverts the comparison: obligations
        # un-accumulate, so a regression reads as a repair.
        if payload.after_episode < payload.before_episode:
            raise HTTPException(
                status_code=422,
                detail="after_episode must not precede before_episode",
            )

        predictor = _predictor()
        before_features = FeatureExtractor().extract(series, payload.before_episode)
        after_features = FeatureExtractor().extract(series, payload.after_episode)
        before_prediction = predictor.predict(before_features)
        after_prediction = predictor.predict(after_features)
        total_delta = after_prediction.value - before_prediction.value
        try:
            return attribute_delta(before_features, after_features, payload.edits, total_delta)
        except ValueError as exc:
            # An edit that names a feature which did not move, or moved the
            # wrong way for a repair, is a fabricated attribution -- reject it
            # at the API boundary rather than letting it render on screen.
            raise HTTPException(status_code=422, detail=str(exc)) from exc

    app.mount("/", StaticFiles(directory="app/static", html=True), name="dashboard")
    return app


app = create_app()
