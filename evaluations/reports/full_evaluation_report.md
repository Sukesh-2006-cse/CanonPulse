# CanonPulse Model & LLM Comprehensive Evaluation Report

**Generated:** 2026-08-16 17:05:05 UTC  
**Model Version:** `continuation-gbr-v1`  
**Feature Schema Version:** `structural-v2`  
**Evaluation Series:** `alice_in_wonderland`

---

## 1. Executive Summary

CanonPulse evaluates continuity and reader retention through two distinct, decoupled pipelines:
1. **Continuation Predictor (`GradientBoostingRegressor`)**: Evaluates reader continuation rates strictly over structural narrative graph vectors.
2. **Dual-Layer Graph Extractor (`HeuristicExtractor` & `LLMExtractor`)**: Reconstructs narrative claims and obligations from raw prose against ground-truth plot manifests.

---

## 2. GradientBoostingRegressor Metrics

| Metric | Training Split | Held-Out Test Split | Target Benchmark |
| :--- | :--- | :--- | :--- |
| **Mean Absolute Error (MAE)** | `0.2858` | **`0.4093`** | `< 0.2000` |
| **Root Mean Squared Error (RMSE)** | — | **`0.5868`** | `< 0.2500` |
| **$R^2$ Score (Variance Explained)** | — | **`0.6557`** | `> 0.6000` |
| **Pearson Correlation ($r$)** | — | **`0.8422`** | `> 0.8000` |
| **p90 Residual Quantile ($z$)** | — | **`1.0974`** | Empirical Quantile |
| **Confidence Interval Coverage** | — | **`90.0%`** | `~90.0%` |
| **Dataset Size (Rows / Books)** | `4733` rows (35 books) | `1200` rows (9 books) | Grouped Book Split |

### Structural Feature Importance Ranking

The GradientBoostingRegressor assigns importance strictly to structural narrative features (never raw prose):

| Rank | Feature Name | Importance Weight | Relative Visual Weight |
| :---: | :--- | :---: | :--- |
| 1 | `broken_edge_count` | 0.6671 | ████████████████████ |
| 2 | `open_obligation_count` | 0.2043 | ██████ |
| 3 | `fair_clue_density` | 0.0377 | █ |
| 4 | `mean_urgency` | 0.0264 | █ |
| 5 | `mean_payoff_distance` | 0.0143 | █ |
| 6 | `min_payoff_distance` | 0.0140 | █ |
| 7 | `perceived_time_jump` | 0.0136 | █ |
| 8 | `suspended_edge_density` | 0.0118 | █ |
| 9 | `character_thread_count` | 0.0092 | █ |
| 10 | `sentiment_velocity` | 0.0013 | █ |
| 11 | `planting_recency` | 0.0003 | █ |

---

## 3. Narrative Graph Extraction & Discrimination Metrics

Scored against hand-authored ground truth (`data/manifest/last_monsoon.yaml`):

| Extractor Backend | Plot Holes Caught (Recall) | Twists Protected | False Positives (FPR) | Precision (Max 0.55) | Schema Compliance |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Hand-Authored Ledger (Graph Traversal Only)** | 6/6 (100.0%) | 5/5 (100.0%) | 0 (0.0%) | 1.000 (Max: 0.55) | 100.0% |
| **HeuristicExtractor (Offline Regex/Word-List)** | 0/6 (0.0%) | 0/5 (0.0%) | 1 (25.0%) | 0.000 (Max: 0.55) | 100.0% |

### Key Extraction Observations:
- **Ledger Traversal (Upper Bound)**: Traversal alone achieves 100% precision and recall when provided with verified graph links.
- **Precision Ceiling**: The maximum reachable precision ceiling for extracted graphs is **0.55** (not 1.0) because twist protection intentionally requires an explicit verifier gate.
- **Heuristic Floor**: HeuristicExtractor operates as an offline, zero-token baseline.

---

## 4. Operational & Observability Verification
- **Offline Determinism**: 100% byte-identical offline reproducibility.
- **Feature Vector Schema Invariance**: Input column ordering enforced by `BoundaryFeatures.to_vector()`.
- **Latency & Reliability**: All regression predictions execute in sub-millisecond local CPU time.
