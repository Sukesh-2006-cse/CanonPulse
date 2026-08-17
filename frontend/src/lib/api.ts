/**
 * CanonPulse API Client
 * Centralized, typed connector for all backend FastAPI endpoints.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData?.detail) {
          errorMessage =
            typeof errorData.detail === "string"
              ? errorData.detail
              : JSON.stringify(errorData.detail);
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SeriesMeta {
  id: string;
  title: string;
  genre: string;
  total_episodes: number;
  source_version: string;
  source: string;
}

export interface Excerpt {
  id: string;
  episode: number;
  text: string;
}

export interface LedgerEntry {
  id: string;
  kind: "promise" | "contradiction";
  description: string;
  episodes: number[];
  excerpt_ids: string[];
  urgency: number;
  promise_kind?: string;
  entities: string[];
}

export interface PayoffLink {
  node_id: string;
  target_id: string;
  episode: number;
  rationale: string;
  verified: boolean;
}

export interface NarrativeNode {
  id: string;
  episode: number;
  perceived_index: number;
  true_time: number | null;
  summary: string;
  entities: string[];
  valence: number;
  excerpt_id: string | null;
  hidden_in_perceived?: boolean;
}

export interface ResolvedEntry {
  entry: LedgerEntry;
  state: "open" | "paid" | "broken";
  planted_episode: number;
  paid_episode: number | null;
  broken_episode: number | null;
  payoff: PayoffLink | null;
  excerpts: Excerpt[];
}

export interface AuditResponse {
  series_id: string;
  source: string;
  source_version: string;
  headline: {
    open: number;
    paid: number;
    broken: number;
    open_promises?: number;
    open_contradictions?: number;
    mean_urgency?: number;
  };
  findings: ResolvedEntry[];
}

export interface MemoryHit {
  episode: number;
  kind: string;
  description: string;
  excerpt: string;
  score?: number;
  source_id?: string;
}

export interface MemoryResponse {
  series_id: string;
  source: string;
  query: string;
  episode: number;
  hits: MemoryHit[];
}

export interface CohortReaction {
  cohort_id: string;
  episode: number;
  engagement: number;
  vote: "continue" | "hesitate" | "stop";
  reaction: string;
  citation_ids?: string[];
  feature_rationale?: string[];
}

export interface CohortsResponse {
  series_id: string;
  source: string;
  disclosure: string;
  cohorts: Array<{
    id: string;
    name: string;
    description: string;
    weights: Record<string, number>;
  }>;
  reactions: CohortReaction[];
  divergence: Array<{ episode: number; divergence_score: number }>;
}

export interface PredictionResponse {
  episode: number;
  features: Record<string, number>;
  prediction: {
    value: number;
    label: string;
    percentile?: number;
  } | null;
  degraded: boolean;
  disclosure: string;
}

export interface WritersRoomAnnotation {
  persona_id: string;
  issue_ids: string[];
  confidence: number;
  reason_codes: string[];
  latency_ms?: number;
}

export interface WritersRoomResponse {
  series_id: string;
  backend: string;
  annotations: WritersRoomAnnotation[];
  timeouts?: string[];
  disagreements?: Array<{
    issue_id: string;
    votes: Record<string, string>;
  }>;
}

export interface RepairResponse {
  series: any;
  repaired_entry_id: string;
  repaired_node_id: string;
  replacement_summary: string;
  repair_backend: string;
  score: {
    before: number;
    after: number;
    delta: number;
  };
}

export interface HandoffResponse {
  writer_id: string;
  episode: number;
  open_promises: LedgerEntry[];
  recent_events: NarrativeNode[];
  active_entities: string[];
  watchouts: string[];
}

export interface DebtBoardResponse {
  series_id: string;
  total_debt_score: number;
  items: Array<{
    entry: LedgerEntry;
    state: string;
    episodes: number[];
    assigned_writer?: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// API CLIENT FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const api = {
  // 1. Series Metadata
  getSeries: () => request<SeriesMeta>("/api/series"),

  // 2. Full Ledger Audit
  getAudit: () => request<AuditResponse>("/api/audit"),

  // 3. Series Memory Query
  getMemory: (
    query: string,
    params?: {
      episode?: number;
      kind?: string;
      entity?: string;
      limit?: number;
      offset?: number;
    }
  ) => {
    const q = new URLSearchParams({ query });
    if (params?.episode) q.set("episode", String(params.episode));
    if (params?.kind) q.set("kind", params.kind);
    if (params?.entity) q.set("entity", params.entity);
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.offset) q.set("offset", String(params.offset));
    return request<MemoryResponse>(`/api/memory?${q.toString()}`);
  },

  // 4. Cohort Simulation
  getCohorts: () => request<CohortsResponse>("/api/cohorts"),

  // 5. Predict Episode Retention
  predict: (episode: number) =>
    request<PredictionResponse>(`/api/predict?episode=${episode}`),

  // 6. Writers Room Reviews
  getWritersRoom: (episode?: number, useLlm = false) => {
    const q = new URLSearchParams();
    if (episode) q.set("episode", String(episode));
    if (useLlm) q.set("use_llm", "true");
    return request<WritersRoomResponse>(`/api/writers-room?${q.toString()}`);
  },

  // 7. Surgical Repair
  repair: (
    target_entry_id: string,
    node_id: string,
    replacement_summary?: string
  ) =>
    request<RepairResponse>("/api/repair", {
      method: "POST",
      body: JSON.stringify({
        target_entry_id,
        node_id,
        replacement_summary: replacement_summary || null,
      }),
    }),

  // 8. Foreshadowing Proposal
  foreshadow: (
    obligation_id: string,
    insertion_episode: number,
    clue_type: string
  ) =>
    request<any>("/api/foreshadowing", {
      method: "POST",
      body: JSON.stringify({
        obligation_id,
        insertion_episode,
        clue_type,
      }),
    }),

  // 9. Localization Verification
  localize: (episode: number, language: string, text: string) =>
    request<any>("/api/localization", {
      method: "POST",
      body: JSON.stringify({ episode, language, text }),
    }),

  // 10. Pre-Publish Verification
  prepublish: (episode: number, title: string, text: string) =>
    request<any>("/api/prepublish", {
      method: "POST",
      body: JSON.stringify({ episode, title, text }),
    }),

  // 11. Handoff Sheet
  getHandoff: (writerId: string, episode?: number) => {
    const q = new URLSearchParams({ writer_id: writerId });
    if (episode) q.set("episode", String(episode));
    return request<HandoffResponse>(`/api/handoff?${q.toString()}`);
  },

  // 12. Showrunner Debt Board
  getDebtBoard: (params?: {
    writer_id?: string;
    state?: string;
    genre?: string;
    urgency?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.writer_id) q.set("writer_id", params.writer_id);
    if (params?.state) q.set("state", params.state);
    if (params?.genre) q.set("genre", params.genre);
    if (params?.urgency) q.set("urgency", String(params.urgency));
    return request<DebtBoardResponse>(`/api/debt-board?${q.toString()}`);
  },

  // 13. Non-Linear Presentation Scramble
  scramble: (presentation_order: number[]) =>
    request<any>("/api/scramble", {
      method: "POST",
      body: JSON.stringify({ presentation_order }),
    }),

  // 14. Manuscript Upload & Extraction Ingestion
  uploadDocumentFile: async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/api/ingest/document-file`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Upload failed with status ${res.status}`);
    }
    return await res.json();
  },

  // 15. Ingestion Job Status
  getIngestionStatus: (jobId: string) =>
    request<any>(`/api/v2/ingestions/${jobId}`),

  // 16. Ingestion Series Result
  getIngestionSeries: (jobId: string) =>
    request<any>(`/api/v2/ingestions/${jobId}/series`),

  // 17. Governance Issue Approval
  approveIssue: (seriesId: string, versionId: string, issueId: string) =>
    request<any>(
      `/api/v2/series/${seriesId}/versions/${versionId}/issues/${issueId}/approve`,
      { method: "POST" }
    ),
};
