# CanonPulse

> Every clue, vow, wound, threat, and romance arc is a promise made to a reader. CanonPulse tells a writer which of those promises are broken, which are intentional twists still waiting on their payoff, and which are overdue — with the exact episodes to prove it.

CanonPulse is a standalone, platform-independent review system for serialized fiction. A writer submits a full series (up to roughly 300 episodes) and gets back:

- **Real plot holes**, separated from **intentional twists** that the story pays off later.
- **Overdue obligations** — promises the story made and has not yet discharged, weighted by how long a reader will tolerate the wait.
- **A predicted next-episode continuation**, with the features driving that prediction, a named confidence interval, and — critically — an explicit disclosure that the model is fit to a synthetic corpus, not observed reader behaviour (see [Training data](#training-data--read-this-before-trusting-a-predicted-number) below).
- **Surgical repair**: fix a real hole with a real model-generated rewrite (or your own text), and see the predicted retention movement decomposed per edit, with whatever cannot be attributed reported rather than hidden.
- **Writers Room, cohort simulation, writer handoff, showrunner debt board, and localization checks** — all read the same shared graph.

Every finding is cited to the episode text that justifies it. Nothing surfaces without an excerpt behind it.

Implementation scope is tracked in [`canonpulse-16h-plan.md`](canonpulse-16h-plan.md); execution plans are under [`docs/superpowers/plans/`](docs/superpowers/plans/).

```bash
uv run --group dev pytest   # All offline, no external credentials required
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

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). No external credentials or cloud services are required — the bundled series (`data/series/last_monsoon.json`, 220 episodes) and manifest (`data/manifest/last_monsoon.yaml`) are committed data, and the resolver runs entirely offline.

To run and inspect local MLflow tracking:
```bash
# Log continuation model and discrimination runs locally:
uv run python scripts/log_mlflow_run.py

# Launch the local MLflow dashboard:
uv run mlflow ui --backend-store-uri sqlite:///mlflow.db
```

Key endpoints (full list in [`app/main.py`](app/main.py), ~30 routes):

| Endpoint | What it returns |
|---|---|
| `GET /api/series` | Loaded series metadata, plus backing store (`file` / `directory`). |
| `GET /api/audit` | Headline counts and every non-`paid` finding, with verbatim citations. |
| `GET /api/discrimination` / `/api/diagnostics` | An `EndToEndReport` with **two** separately-labelled numbers, `ledger` and `extracted`. |
| `GET /api/predict?episode=N` | Feature vector at the boundary, the trained model's prediction (`value`, `lower_ci`, `upper_ci`), and a `disclosure` field. Degrades to `golden_path()` on an inference timeout. |
| `POST /api/repair` | Surgical repair. Counterfactual graph simulation and predicted retention delta. |
| `GET /api/writers-room` | Persona annotations (`backend: "deterministic-structured"` or LLM). |
| `GET /api/cohorts` | Five structural listener cohorts' per-episode reactions, explicitly disclosed as a simulation, not observed audience data. |
| `POST /api/rewrite` | `{before_episode, after_episode, edits}` → predicted delta computed server-side from the same trained predictor. |

---

## The 5 Unified Product Surfaces

All five surfaces derive from a single underlying **Dual-Layer Narrative Graph Ledger**:

| Surface | Target Persona | Endpoint | Function & Business Value |
|:---|:---|:---|:---|
| **1. Series Memory** | **Writer / Showrunner** | `GET /api/memory` | Searchable persistent narrative index answering *"What did we plant in Ep 47?"* with timeline horizon semantics and verbatim citations. |
| **2. Pre-Publish Check** | **Writer** | `POST /api/prepublish` | Pre-release sidebar that classifies twists vs. holes on unreleased drafts and calculates live retention impact deltas ($\Delta \text{retention}$). |
| **3. Writer Handoff Sheet** | **Multi-Writer Team** | `GET /api/handoff` | Automated transition audit detailing open, overdue, and inherited obligations when writer teams rotate mid-series. |
| **4. Showrunner Debt Board** | **Studio Executive** | `GET /api/debt-board` | Portfolio-level dashboard tracking the **Narrative Debt Index ($\text{NDI}$)** across multiple running series. |
| **5. Localization Check** | **Localization Team** | `POST /api/localization` | Language-agnostic graph validation ensuring translated scripts (Hindi, Spanish, etc.) maintain 1:1 edge alignment with canonical story logic. |

```
                     ┌──────────────────────────────────────────────┐
                     │          DUAL-LAYER GRAPH LEDGER             │
                     │ (Perceived vs True-Time, Claims, Obligations)│
                     └──────────────────────┬───────────────────────┘
                                            │
        ┌───────────────────┬───────────────┼───────────────┬────────────────────┐
        ↓                   ↓               ↓               ↓                    ↓
┌───────────────┐   ┌───────────────┐┌──────────────┐┌───────────────┐   ┌────────────────┐
│1.Series Memory│   │ 2.Pre-Publish ││ 3.Writer     ││ 4.Showrunner  │   │5. Localization │
│  (Deep Search)│   │   Check (Diff)││  Handoff     ││   Debt Board  │   │   Check        │
└───────────────┘   └───────────────┘└──────────────┘└───────────────┘   └────────────────┘
```


## What's actually real vs. synthetic

This repo is deliberately explicit about this distinction, and every synthetic surface carries its own disclosure string in the API response itself:

**Real, live, actually executing:**
- The ledger resolver (`app/ledger.py`) and verifier (`app/verifier.py`) — deterministic graph traversal, not a model call.
- `HeuristicExtractor` — a real, regex/word-list-based extractor genuinely re-deriving the graph from raw text.
- `LLMExtractor` — an OpenAI-compatible extractor for local models (e.g. Ollama, LM Studio) or OpenAI API.
- `app/real_corpus.py` — runs the real structural-extraction pipeline over 20 real public-domain novels downloaded from Project Gutenberg's mirror, blended into the live predictor's training rows.
- Local MLflow tracking (`scripts/log_mlflow_run.py`) — logging model metrics and graph evaluations directly to local SQLite.

**Synthetic / simulated, and explicitly disclosed as such:**
- The continuation predictor (`ContinuationPredictor`) is fit on `app/training_corpus.py`'s documented synthetic corpus, blended with `real_corpus.py`'s rows. Every `/api/predict` response repeats `PREDICTION_DISCLOSURE` verbatim.
- `GET /api/cohorts` — five fixed weight vectors over structural features, disclosed inline as *"a bounded structural simulation, not observed listener behavior."*
- The demo series itself (`data/series/last_monsoon.json`) is originally-authored and synthetic, scored against a hand-authored manifest withheld from the analyzer.
- `GET /api/writers-room` default path — deterministic, rule-based persona annotations.

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

This is grounded in the product's own thesis (see `app/features.py`), not an arbitrary function — but it is still synthetic. `app/real_corpus.py` upgrades one half of this: it downloads 20 real public-domain novels, runs the **real** `HeuristicExtractor`/`FeatureExtractor` pipeline over them, and blends the resulting 488 real chapter rows into `_predictor()`'s training data.

## Offline fallback (`app/demo_mode.py`)

Live demos fail on projector Wi-Fi, not on code. `golden_path()` recomputes the audit for the bundled series through the real `LedgerResolver` — no inference call, no network — and returns the same shape the API returns. `GET /api/predict` wires this up for real: it runs inference in a worker thread with a hard timeout of `INFERENCE_TIMEOUT_SECONDS` (5 seconds); on timeout the response switches to `golden_path()` and marks itself `"degraded": true`. Everything shown is still computed from committed data through the real ledger.

**The reachable precision ceiling for any extractor here is 0.55, not 1.0.** Protection requires a *verified* payoff link by design, and no extractor in this repository can emit one on its own — no `Verifier` implementation trusts an extractor's own claim. So `twists_protected` measures the absence of a verifier as much as it measures the extractor, and every twist an extractor correctly locates strictly *lowers* its own precision score. Read any `precision` number here against 0.55, not against 1.0. `app/manifest.py` enforces the corresponding discipline directly: no test in this repository may assert a discrimination metric equals `1.0`.
