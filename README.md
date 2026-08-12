# CanonPulse

> Every clue, vow, wound, threat, and romance arc is a promise made to a reader. CanonPulse tells a writer which of those promises are broken, which are intentional twists still waiting on their payoff, and which are overdue — with the exact episodes to prove it.

CanonPulse is a standalone, platform-independent review system for serialized fiction. A writer submits a full series (up to roughly 300 episodes) and gets back:

- **Real plot holes**, separated from **intentional twists** that the story pays off later.
- **Overdue obligations** — promises the story made and has not yet discharged, weighted by how long a reader will tolerate the wait.
- **A predicted next-episode continuation**, with the features driving that prediction, a named confidence interval, and — critically — an explicit disclosure that the model is fit to a synthetic corpus, not observed reader behaviour (see [Training data](#training-data--read-this-before-trusting-a-predicted-number) below).
- **Surgical repair**: fix a real hole with a real model-generated rewrite (or your own text), and see the predicted retention movement decomposed per edit, with whatever cannot be attributed reported rather than hidden.
- **Writers Room, cohort simulation, writer handoff, showrunner debt board, and localization checks** — all read the same shared graph.

Every finding is cited to the episode text that justifies it. Nothing surfaces without an excerpt behind it.

**🔗 Live deployment:** [`canonpulse-dev`](https://canonpulse-dev-7474643976895292.aws.databricksapps.com) — a real Databricks App, backed by real Unity Catalog tables, a real SQL warehouse, and a real Foundation Model API serving endpoint. Requires an account in that Databricks workspace to open (Databricks Apps sit behind workspace SSO; there is no public/anonymous mode).

Implementation scope is tracked in [`canonpulse-16h-plan.md`](canonpulse-16h-plan.md); execution plans are under [`docs/superpowers/plans/`](docs/superpowers/plans/).

```bash
uv run --group dev pytest   # 269 tests, all offline, no credentials required
```

---

## Why this is not "just another continuity checker"

A naive consistency checker flags every contradiction — intentional or not — because it cannot tell the difference between a plot hole and a twist the author is setting up. CanonPulse resolves that with a **dual-layer graph**: each narrative claim carries both the episode a reader encounters it in (`perceived_index`) and where it sits in story-time (`true_time`). A contradiction with a later payoff is protected as craft; a contradiction with nothing downstream is flagged as a defect. The resolution step (`app/ledger.py`) is deterministic graph traversal, not a model call, so the same series always yields the same verdict and the result can be argued with.

## Run locally

```bash
uv sync
uv run --group dev pytest
uv run uvicorn app.main:app --port 8000
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). No credentials or network access are required for the local demo — the bundled series (`data/series/last_monsoon.json`, 220 episodes) and manifest (`data/manifest/last_monsoon.yaml`) are committed data, and the resolver runs entirely offline. Every LLM- or Databricks-backed feature below is opt-in and degrades to a deterministic path automatically when its credentials are absent — nothing crashes, nothing is faked.

Key endpoint (full list in [`app/main.py`](app/main.py), ~29 routes):

| Endpoint | What it returns |
|---|---|
| `GET /api/series` | Loaded series metadata, plus which backing store (`file`/`databricks`) served it. |
| `GET /api/audit` | Headline counts and every non-`paid` finding, with citations. |
| `GET /api/discrimination` / `/api/diagnostics` | An `EndToEndReport` with **two** separately-labelled numbers, `ledger` and `extracted` (see [Honesty section](#honesty-section--read-this-before-trusting-the-discrimination-numbers) before reading either one). |
| `GET /api/predict?episode=N` | Feature vector at the boundary, the trained model's prediction (`value`, `lower_ci`, `upper_ci`), and a `disclosure` field. Degrades to `golden_path()` on an inference timeout. |
| `POST /api/repair` | Surgical repair. Omit `replacement_summary` and it calls OpenAI live to generate the replacement text (`repair_backend` reports which path ran); 422s naming the missing config rather than faking one. |
| `GET /api/writers-room?use_llm=true` | Real OpenAI- or Databricks-backed persona annotations; default (no `use_llm`) is the deterministic path — `backend` in the response says which ran. |
| `GET /api/cohorts` | Five structural listener cohorts' per-episode reactions, explicitly disclosed as a simulation, not observed audience data. |
| `GET /api/handoff`, `/api/debt-board` | Writer handoff sheet and portfolio-wide Narrative Debt Index. |
| `POST /api/localization` | Translation continuity check, including a graph-derived entity-parity finding. |
| `POST /api/rewrite` | `{before_episode, after_episode, edits}` → predicted delta computed server-side from the same trained predictor — `total_delta` is never a value the caller supplied. |

## What's actually real vs. synthetic

This repo is deliberately over-explicit about this distinction, and every synthetic surface carries its own disclosure string in the API response itself — the table below just collects them in one place.

**Real, live, actually executing:**
- The ledger resolver (`app/ledger.py`) and verifier (`app/verifier.py`) — deterministic graph traversal, not a model call.
- `HeuristicExtractor` — a real, regex/word-list-based extractor genuinely re-deriving the graph from raw text (never trained on the manifest it's scored against).
- `LLMExtractor` — a real model-driven extractor, wired into deep ingestion (`RealIngestionExtractor`), preferring the governed Databricks Foundation Model API when configured, falling back to OpenAI, falling back to Heuristic.
- `POST /api/repair` (no `replacement_summary`) and `GET /api/writers-room?use_llm=true` — genuinely call OpenAI or Databricks live over HTTP. Both 422 rather than fake a result when no credentials are configured.
- `app/real_corpus.py` — runs the real structural-extraction pipeline over 20 real public-domain novels (488 real chapter rows) downloaded from Project Gutenberg's own sanctioned bulk-access mirror, blended into the live predictor's training rows.
- The Databricks deployment — real Unity Catalog tables (26, applied via `scripts/apply_ddl.py`), a real SQL warehouse, a real MLflow experiment, a real running App.

**Synthetic / simulated, and explicitly disclosed as such:**
- The continuation predictor (`ContinuationPredictor`) is fit on `app/training_corpus.py`'s documented synthetic corpus, blended with `real_corpus.py`'s rows — real structural features, but a still-synthetic `continue_rate` label, since no book here carries real reader-engagement telemetry. Every `/api/predict` response repeats `PREDICTION_DISCLOSURE` verbatim.
- `GET /api/cohorts` — five fixed weight vectors over structural features, disclosed inline as *"a bounded structural simulation, not observed listener behavior."*
- The demo series itself (`data/series/last_monsoon.json`) is originally-authored and synthetic, scored against a hand-authored manifest withheld from the analyzer.
- `GET /api/writers-room` default path — deterministic, rule-based persona annotations (`backend: "deterministic-structured"` in the response), not a model call.

## Training data — read this before trusting a predicted number

**There is no real reader-retention corpus in this repository.** `app/training_corpus.py` generates a **deterministic, offline, synthetic corpus**: each row carries the full structural feature vector plus a `continue_rate` derived from a fully stated formula —

```
continue_rate = clip(
    0.5
    + 0.03 * open_obligation_count   # open threads pull a reader forward
    + 0.02 * mean_urgency            # urgent open threads pull harder
    - 0.09 * sqrt(overdue_count)     # an overdue promise reads as abandoned
    - 0.13 * sqrt(broken_count)      # an unresolved contradiction repels
    - 0.012 * sqrt(max_obligation_age)
    + noise,
    0, 1,
)
```

This is grounded in the product's own thesis (see `app/features.py`), not an arbitrary function — but it is still synthetic. `app/real_corpus.py` upgrades one half of this: it downloads 20 real public-domain novels from `mirror.cs.odu.edu` (an official Project Gutenberg mirror — the site's own stated policy discourages scraping `www.gutenberg.org` directly and asks bulk users to use a mirror instead), runs the **real** `HeuristicExtractor`/`FeatureExtractor` pipeline over them, and blends the resulting 488 real chapter rows into `_predictor()`'s training data. The features are now real for those rows. The label is not — no book carries real per-chapter engagement — so `continue_rate` for real-corpus rows still applies the same documented formula above to real feature values, not fabricated ones. Falls back to synthetic-only automatically if `data/gutenberg_raw/` (untracked, ~12MB, reproducible via `scripts/fetch_gutenberg_corpus.py`) isn't present.

Nothing here is evidence that the predicted continuation rate is calibrated to any real audience, and nothing in this app claims otherwise: every `/api/predict` response repeats this disclosure, and the number never appears on screen looking like a measured retention rate.

The presentation-layer mapping from the model's internal z-score to a displayed rate (`app/predictor.py::_to_probability`) derives its centre and scale from the training corpus's own `continue_rate` distribution, rather than a hardcoded constant, and reports explicitly when it had to clamp. The confidence interval is the empirical 90th percentile of held-out residuals (`CI_METHOD = "p90_held_out_residual"`), not MAE divided by an unexplained constant.

## Offline fallback (`app/demo_mode.py`)

Live demos fail on projector Wi-Fi, not on code. `golden_path()` recomputes the audit for the bundled series through the real `LedgerResolver` — no inference call, no network — and returns the same shape the API returns. `GET /api/predict` wires this up for real: it runs inference in a worker thread with a hard timeout of `INFERENCE_TIMEOUT_SECONDS` (5 seconds); on timeout the response switches to `golden_path()` and marks itself `"degraded": true`. Everything shown is still computed from committed data through the real ledger — nothing is hardcoded or fabricated.

## Live Databricks deployment

Unlike the prerequisites list below (which describes what *you'd* need to reproduce this), this section describes what is **actually running right now**:

- **App:** `canonpulse-dev`, a real Databricks App (FastAPI + Uvicorn), deployed via `databricks bundle deploy` + `databricks apps deploy`.
- **Unity Catalog:** `writers_room.canonpulse`, 26 tables, applied for real via `scripts/apply_ddl.py` (which also fixed a real bug — Delta rejects `CREATE TABLE ... DEFAULT` without an explicit `TBLPROPERTIES('delta.feature.allowColumnDefaults' = 'supported')`, which `sql/ddl.sql` never declared because it had never been run against live Delta before).
- **SQL warehouse:** serverless, id `c4cfcc95726ac7d5`, running the batched `ai_query` extraction/cohort SQL and the series read path (`app/store.py`).
- **Serving endpoint:** `databricks-gpt-oss-20b`, a reasoning-style Foundation Model API endpoint. Getting a clean string out of it required a real fix: it returns `message.content` as a list of typed blocks (`reasoning` + `text`), not a plain string — `app/llm_extractor.py::message_text()` unwraps it.
- **MLflow experiment:** id `4189279848712062`.

**Two real production bugs were found and fixed by actually exercising this deployment, not just deploying it:**
1. Databricks Apps inject `DATABRICKS_HOST` **without** a scheme (`dbc-....cloud.databricks.com`, not `https://dbc-....`) — `app/store.py`'s SQL statement transport built a malformed URL and crashed every request that touched the database. Fixed by normalizing the scheme in `_http_statement_transport`.
2. The App's own service-principal identity (distinct from a developer's personal login) had no `USE CATALOG`/`USE SCHEMA`/`SELECT` grant on `writers_room.canonpulse` — granted directly via `GRANT ... TO` on the service principal's client id.

**A real evaluation was also run against the live governed path**, not just a smoke test — `scripts/measure_llm_extraction.py` against `databricks-gpt-oss-20b` over the first 20 episodes of the demo series:

| metric | heuristic (floor) | LLM (databricks) |
|---|---|---|
| precision | 0.0 | 0.0 |
| recall | 0.0 | 0.0 |
| rejected rows | 0 | **19 / 20** |

This is reported honestly, not smoothed over: the current extraction prompt does not reliably get schema-valid JSON out of this reasoning model — most rows were rejected outright rather than scored. The governed path is real and reachable, but its extraction quality is not yet better than the deterministic floor. That is a prompt/parsing problem to fix next, not a claim this README will make prematurely.

## Databricks deployment prerequisites (to reproduce this elsewhere)

None of this is required to run the demo locally. Every identifier below is a parameter you supply — nothing is hardcoded in the repo, and no credential is ever committed.

- A Databricks **workspace URL** and an **authenticated CLI profile** (`databricks auth login --profile <your-profile>`).
- A Unity Catalog **catalog** and **schema** you have permission to create tables in:
  ```bash
  uv run python scripts/apply_ddl.py --warehouse <warehouse-id> --catalog <your_catalog> --schema <your_schema>
  ```
- A **SQL warehouse** to run the DDL and the batched `ai_query` extraction/cohort queries against.
- A **model-serving endpoint** that supports structured/JSON output. Set `SERVING_MODEL_ENDPOINT` + `DATABRICKS_HOST`; auth is minted from the caller's own Databricks credentials (`app/databricks_config.py`), never a hardcoded token.
- An **MLflow experiment** (name or ID), set as `MLFLOW_EXPERIMENT_ID` with `MLFLOW_TRACKING_URI=databricks`.
- For the off-platform (non-governed) LLM path: `OPENAI_API_KEY` in `.env` (gitignored) — read only by `app/llm_config.py`.

Grant the deployed App's own service-principal identity `USE CATALOG` / `USE SCHEMA` / `SELECT` on your schema — it is a separate identity from whoever ran the DDL, and needs its own grant (see the real bug above).

## User document ingestion

The committed JSON/YAML series is only the deterministic offline fixture. For governed uploads, place PDF, DOC/DOCX, JPG/JPEG, PNG, TIFF/TIF, or PPT/PPTX files in a Unity Catalog Volume and run:

```bash
uv run python scripts/run_document_processing.py \
  --warehouse <warehouse-id> \
  --source-path /Volumes/<catalog>/<volume-schema>/<folder>/ \
  --series-id <series-id> \
  --catalog <catalog> \
  --schema <schema>
```

Databricks `ai_parse_document` creates the governed raw and parsed layers in `canonpulse_raw_document` and `canonpulse_parsed_document`. CanonPulse then normalizes the parsed `document.elements` into `EpisodeInput` records in `app/document_ingestion.py`, retaining source page and element identifiers for citations. A file named `episode-07.pdf` becomes episode 7; a document with `Episode 1`/`Episode 2` headings is split by those headings. Ambiguous files are marked for review instead of being assigned an invented episode number. The same normalized output can also be submitted live via `POST /api/ingest/document`.

Promote a parsed series into the CanonPulse ledger and run governed graph extraction with:

```bash
uv run python scripts/promote_document_series.py \
  --warehouse <warehouse-id> \
  --series-id <series-id> \
  --title "<series title>" \
  --genre "serialized fiction" \
  --model <serving-endpoint>
```

## Demo sequence

1. Load *The Last Monsoon* — 220 episodes.
2. Show baseline flags vs CanonPulse breakdown (`/api/audit`).
3. Click a protected twist; show the Ep 47 → Ep 218 payoff citation.
4. Show the predicted continuation panel — value, interval, and the synthetic-corpus disclosure (`/api/predict`).
5. Run a surgical repair with no `replacement_summary` supplied — show the real OpenAI-generated text and the per-edit attributed prediction delta.
6. Toggle `?use_llm=true` on Writers Room — show a real model call replacing the deterministic annotations, with `backend` reporting which one ran.
7. Show the live Databricks App and its real Unity Catalog / MLflow / serving-endpoint backing (see [Live Databricks deployment](#live-databricks-deployment)).

## Honesty section — read this before trusting the discrimination numbers

**The demo series is original and synthetic.** *The Last Monsoon* was generated for this project; it is not a real published work and no claims are made about any specific real series.

**The continuation model trains on a documented synthetic-label corpus, blended with real structural features from real books.** See [Training data](#training-data--read-this-before-trusting-a-predicted-number). No real reader behavior, retention data, or platform analytics of any kind is used or claimed anywhere in this system, and every `/api/predict` response says so directly.

**No real listener or reader panel exists anywhere in this project.** The "cohorts" in `app/cohorts.py` are five fixed, transparent weight vectors over structural features (urgency, fairness, emotional payoff, etc.) — a bounded, disclosed simulation for localizing *where in a series* different reading styles would diverge, not a panel of real people. `GET /api/cohorts` carries the disclosure inline on every response.

**`/api/discrimination` reports two numbers, not one, because a single figure invited exactly the misreading it produced.** An earlier version of this project reported one precision/recall pair computed by resolving the demo series' own pre-populated (`entries`/`payoffs`) graph — data generated *from* the same hand-authored manifest it was scored against, with no extraction in the loop. That number could not fall no matter what "extraction" did, because no extraction had run. `app/evaluation.py::evaluate_series` now computes both halves explicitly:

- **Ledger — recall 1.0, precision 1.0, false-positive rate 0.0.** Given a correct, hand-authored graph, the resolver separates all 6 real plot holes from all 5 intentional twists with no false positives. This measures graph traversal only (`app/ledger.py`), not extraction.
- **End-to-end (`HeuristicExtractor`, offline, no network) — recall 0.0, precision 0.0, false-positive rate 0.0.** The deliberately naive, rule-based extractor recovers 0 of 6 real plot holes and protects 0 of 5 intentional twists over the full 220-episode series. This is the honest floor for turning prose it has never seen the answer key for into a graph.
- **End-to-end (`LLMExtractor`, live, `databricks-gpt-oss-20b`) — precision 0.0, recall 0.0, 19 of 20 sampled rows rejected.** See [Live Databricks deployment](#live-databricks-deployment) above: this is a real, measured result against the real governed path, not a projection. It is currently no better than the heuristic floor — the extraction prompt needs work before this path is presentable as an improvement, and this README says so rather than omitting the number.

**The reachable precision ceiling for any extractor here is 0.55, not 1.0.** Protection requires a *verified* payoff link by design, and no extractor in this repository can emit one on its own — no `Verifier` implementation trusts an extractor's own claim. So `twists_protected` measures the absence of a verifier as much as it measures the extractor, and every twist an extractor correctly locates strictly *lowers* its own precision score. Read any `precision` number here against 0.55, not against 1.0. `app/manifest.py` enforces the corresponding discipline directly: no test in this repository may assert a discrimination metric equals `1.0`.
