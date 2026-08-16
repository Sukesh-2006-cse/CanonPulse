"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Brain,
  Layers,
  FileText,
  UserCheck,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Eye,
  X,
  Sliders,
  Terminal,
  Cpu,
  GitBranch,
  Wand2,
  Clock,
  Database,
  BarChart2,
  Code,
  Check,
  Video,
  PenTool,
  Scale,
  History,
  User,
  ChevronDown,
  Copy,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & DATA STRUCTURES
// ─────────────────────────────────────────────────────────────────────────────

type ScenarioType = "intentional-twist" | "plot-hole";
type AnalysisStatus = "idle" | "running" | "complete";
type PersonaState =
  | "queued"
  | "context-received"
  | "analyzing"
  | "signal-found"
  | "cross-checking"
  | "completed"
  | "conflict"
  | "agreement";

interface PersonaExecutionData {
  id: string;
  name: string;
  role: string;
  status: PersonaState;
  executionTime: number;
  tokens: string;
  currentOperation: string;
  currentActivity: string;
  findingsCount: number;
  annotationCount: number;
  confidence: number;
  lenses: string[];
  findingText: {
    twist: string;
    plotHole: string;
  };
  modelOutput: Record<string, any>;
  evidence: { episode: number; event: string }[];
}

interface ActivityLog {
  timestamp: string;
  source: string;
  message: string;
  type: "info" | "warning" | "success" | "accent";
}

interface EvidenceMatrixRow {
  signalName: string;
  director: "check" | "warning" | "none";
  editor: "check" | "warning" | "none";
  critic: "check" | "warning" | "none";
  psychologist: "check" | "warning" | "none";
  historian: "check" | "warning" | "none";
  evidenceNote: string;
}

const renderPersonaIcon = (id: string, className = "h-4 w-4 text-[#f2ca50]") => {
  switch (id) {
    case "director":
      return <Video className={className} />;
    case "editor":
      return <PenTool className={className} />;
    case "critic":
      return <Scale className={className} />;
    case "psychologist":
      return <Brain className={className} />;
    case "historian":
      return <History className={className} />;
    default:
      return <Cpu className={className} />;
  }
};

const INITIAL_PERSONAS: PersonaExecutionData[] = [
  {
    id: "director",
    name: "Director",
    role: "Narrative Vision",
    status: "queued",
    executionTime: 2.84,
    tokens: "18.4k",
    currentOperation: "Evaluating narrative pacing",
    currentActivity: "Waiting for context...",
    findingsCount: 4,
    annotationCount: 3,
    confidence: 93,
    lenses: ["pacing", "scene structure", "dramatic tension"],
    findingText: {
      twist: "Reveal timing is structurally valid and aligns with Episode 225 climax setup.",
      plotHole: "Scene preserves tension, but Arjun's denial creates an ungrounded structural cliffhanger.",
    },
    modelOutput: {
      persona: "Director",
      role: "Narrative Vision",
      target_episode: 218,
      scene: 4,
      analysis: {
        pacing_score: 0.93,
        scene_function: "Dramatic Tension Peak",
        structural_verdict: "VALID_NARRATIVE_CLIMAX_SETUP",
        dramatic_momentum: "High",
      },
      citation: {
        episode: 178,
        line: 88,
        quote: "Arjun saw the photograph in secret cabinet.",
      },
      graph_annotations: [
        { action: "SET_NODE_WEIGHT", node_id: "scene_218_4", weight: 0.93 },
      ],
    },
    evidence: [{ episode: 178, event: "Arjun saw the photograph in secret cabinet." }],
  },
  {
    id: "editor",
    name: "Editor",
    role: "Prose & Flow",
    status: "queued",
    executionTime: 3.12,
    tokens: "16.8k",
    currentOperation: "Checking dialogue transition",
    currentActivity: "Waiting for context...",
    findingsCount: 3,
    annotationCount: 2,
    confidence: 87,
    lenses: ["dialogue", "transitions", "exposition flow"],
    findingText: {
      twist: "Dialogue rhythm and cadence match tone baseline for mystery setup scenes.",
      plotHole: "Dialogue is consistent with established scene flow and prose rhythm.",
    },
    modelOutput: {
      persona: "Editor",
      role: "Prose & Flow",
      target_episode: 218,
      scene: 4,
      analysis: {
        prose_rhythm_score: 0.87,
        dialogue_authenticity: "Consistent",
        cadence_match: "Episode 200 Baseline",
        subtext_density: "High",
      },
      citation: {
        episode: 200,
        line: 42,
        quote: "Interrogation exchange cadence verified.",
      },
      graph_annotations: [
        { action: "FLAG_SUBTEXT", text: "Guarded hesitation before denial" },
      ],
    },
    evidence: [{ episode: 218, event: "Scene 4 dialogue cadence benchmarked against Episode 200." }],
  },
  {
    id: "critic",
    name: "Critic",
    role: "Logic & Narrative Risk",
    status: "queued",
    executionTime: 3.47,
    tokens: "22.1k",
    currentOperation: "Tracing cross-episode contradiction",
    currentActivity: "Waiting for context...",
    findingsCount: 6,
    annotationCount: 4,
    confidence: 94,
    lenses: ["contradictions", "logic gaps", "narrative risks"],
    findingText: {
      twist: "Contradiction detected with Ep 47, but flagged as potential intentional setup.",
      plotHole: "Potential continuity contradiction detected with Episode 47 (Photograph Identification).",
    },
    modelOutput: {
      persona: "Critic",
      role: "Logic & Narrative Risk",
      target_episode: 218,
      scene: 4,
      analysis: {
        risk_score: 0.94,
        contradiction_detected: true,
        conflicting_episode: 47,
        conflict_type: "STATEMENT_DISCREPANCY",
        severity: "CRITICAL",
      },
      citation: {
        episode: 47,
        line: 142,
        quote: "Arjun explicitly identified photograph owner.",
      },
      graph_annotations: [
        { action: "ADD_EDGE_CONFLICT", source: "Ep_218_Scene_4", target: "Ep_47_Line_142" },
      ],
    },
    evidence: [{ episode: 47, event: "Arjun explicitly identified photograph owner in line 142." }],
  },
  {
    id: "psychologist",
    name: "Psychologist",
    role: "Character Motivation",
    status: "queued",
    executionTime: 2.71,
    tokens: "19.5k",
    currentOperation: "Comparing character motivation state",
    currentActivity: "Waiting for context...",
    findingsCount: 5,
    annotationCount: 3,
    confidence: 89,
    lenses: ["emotional state", "motivation", "behavior logic"],
    findingText: {
      twist: "Arjun's guarded emotional state fits secret double agent protector archetype.",
      plotHole: "Arjun's reaction of total ignorance is emotionally inconsistent with his Episode 178 state.",
    },
    modelOutput: {
      persona: "Psychologist",
      role: "Character Motivation",
      target_episode: 218,
      scene: 4,
      analysis: {
        motivation_alignment: 0.89,
        character: "Arjun",
        internal_state: "PROTECTIVE_DECEPTION",
        behavioral_consistency: "Feigned Ignorance matches Oath",
      },
      citation: {
        episode: 178,
        line: 104,
        quote: "Swore secret oath to protect Maya's true lineage.",
      },
      graph_annotations: [
        { action: "UPDATE_STATE", character: "Arjun", state: "FEIGNING_IGNORANCE" },
      ],
    },
    evidence: [{ episode: 178, event: "Arjun swore secret oath to protect Maya's identity." }],
  },
  {
    id: "historian",
    name: "Historian",
    role: "Canon & Timeline",
    status: "queued",
    executionTime: 3.81,
    tokens: "24.6k",
    currentOperation: "Validating event chronology",
    currentActivity: "Waiting for context...",
    findingsCount: 7,
    annotationCount: 5,
    confidence: 97,
    lenses: ["chronology", "lore rules", "timeline consistency"],
    findingText: {
      twist: "Chronology mismatch matches planned timeline reveal recorded in Series Bible for Ep 225.",
      plotHole: "Claiming zero prior knowledge conflicts with established G_true timeline record from Ep 47.",
    },
    modelOutput: {
      persona: "Historian",
      role: "Canon & Timeline",
      target_episode: 218,
      scene: 4,
      analysis: {
        g_true_validation: 0.97,
        downstream_payoff_found: true,
        payoff_episode: 225,
        chronological_reality: "VALIDATED",
        canon_compliance: 0.97,
      },
      citation: {
        episode: 225,
        line: 19,
        quote: "Series Bible entry: Arjun reveals secret cabinet key to Maya.",
      },
      graph_annotations: [
        { action: "VERIFY_PAYOFF_EDGE", source: "Ep_218", target_payoff: "Ep_225" },
      ],
    },
    evidence: [{ episode: 47, event: "Photograph backstory established in G_true." }],
  },
];

const MATRIX_ROWS: EvidenceMatrixRow[] = [
  {
    signalName: "Character awareness",
    director: "none",
    editor: "none",
    critic: "warning",
    psychologist: "check",
    historian: "warning",
    evidenceNote: "Critic and Historian flag Ep 47 disparity; Psychologist confirms Arjun's feigned ignorance fits his oath.",
  },
  {
    signalName: "Timeline order",
    director: "check",
    editor: "none",
    critic: "warning",
    psychologist: "none",
    historian: "warning",
    evidenceNote: "G_true chronological sequence differs from G_perceived presentation order; payoff found in Ep 225.",
  },
  {
    signalName: "Motivation",
    director: "check",
    editor: "none",
    critic: "none",
    psychologist: "check",
    historian: "none",
    evidenceNote: "Director and Psychologist confirm motivation is structurally sound for secret double agent arc.",
  },
  {
    signalName: "Scene pacing",
    director: "check",
    editor: "check",
    critic: "none",
    psychologist: "none",
    historian: "none",
    evidenceNote: "Pacing score 0.89; reveal timing maintains structural momentum.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROPORTIONALLY SPACED & NON-OVERLAPPING 5-AXIS PENTAGON RADAR CHART COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface PentagonRadarProps {
  personas: PersonaExecutionData[];
  scenario: ScenarioType;
  selectedPersonaId: string;
  onSelectPersona: (id: string) => void;
}

const PentagonRadarChart: React.FC<PentagonRadarProps> = ({
  personas,
  scenario,
  selectedPersonaId,
  onSelectPersona,
}) => {
  const size = 360;
  const center = size / 2;
  const radius = 100; // Controlled radius to ensure 80px outer padding for label badges!

  const angles = [-90, -18, 54, 126, 198];

  const getPoint = (angleDeg: number, factor: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: center + radius * factor * Math.cos(rad),
      y: center + radius * factor * Math.sin(rad),
    };
  };

  const getRingPoints = (factor: number) => {
    return angles.map((a) => getPoint(a, factor)).map((p) => `${p.x},${p.y}`).join(" ");
  };

  const polygonPoints = personas
    .map((p, idx) => {
      const conf = scenario === "plot-hole" && (p.id === "critic" || p.id === "historian") ? p.confidence * 0.45 : p.confidence;
      const pt = getPoint(angles[idx], conf / 100);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  return (
    <div className="relative flex flex-col items-center justify-center my-auto p-4 w-full">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible max-w-full">
        {/* Background Grid Rings */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((ring) => (
          <polygon
            key={ring}
            points={getRingPoints(ring)}
            fill="none"
            stroke="rgba(242,202,80,0.12)"
            strokeWidth="1"
            strokeDasharray={ring === 1.0 ? "none" : "3,3"}
          />
        ))}

        {/* Axis Rays */}
        {angles.map((a, idx) => {
          const p = personas[idx];
          const isSelected = p?.id === selectedPersonaId;
          const pt = getPoint(a, 1.0);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={pt.x}
              y2={pt.y}
              stroke={isSelected ? "#f2ca50" : "rgba(242,202,80,0.2)"}
              strokeWidth={isSelected ? "2.2" : "1"}
            />
          );
        })}

        {/* Main Pentagon Polygon */}
        <polygon
          points={polygonPoints}
          fill={scenario === "plot-hole" ? "rgba(255,92,77,0.2)" : "rgba(242,202,80,0.2)"}
          stroke={scenario === "plot-hole" ? "#ff5c4d" : "#f2ca50"}
          strokeWidth="2.5"
          className="transition-all duration-500"
        />

        {/* Vertices & Non-Overlapping Highlight Badges */}
        {personas.map((p, idx) => {
          const isSelected = p.id === selectedPersonaId;
          const conf = scenario === "plot-hole" && (p.id === "critic" || p.id === "historian") ? p.confidence * 0.45 : p.confidence;
          const dataPt = getPoint(angles[idx], conf / 100);
          
          // Place label badges cleanly OUTSIDE vertex circle (factor 1.40) to prevent any polygon overlap!
          const outerPt = getPoint(angles[idx], 1.42);
          const labelText = `${p.name} (${Math.round(conf)}%)`;
          
          const badgeWidth = Math.max(140, labelText.length * 7.5 + 24);

          return (
            <g
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              className="cursor-pointer group"
            >
              {/* Outer Highlight Ring for Selected Vertex */}
              {isSelected && (
                <circle
                  cx={dataPt.x}
                  cy={dataPt.y}
                  r="11"
                  fill="rgba(242,202,80,0.3)"
                  stroke="#f2ca50"
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
              )}

              {/* Vertex Point Circle */}
              <circle
                cx={dataPt.x}
                cy={dataPt.y}
                r={isSelected ? "6.5" : "4.5"}
                fill={
                  isSelected
                    ? "#f2ca50"
                    : scenario === "plot-hole" && (p.id === "critic" || p.id === "historian")
                    ? "#ff5c4d"
                    : "#f2ca50"
                }
                stroke="#080800"
                strokeWidth="2"
              />

              {/* Highlight Badge Rectangle Positioned Cleanly Outside Pentagon */}
              {isSelected && (
                <rect
                  x={outerPt.x - badgeWidth / 2}
                  y={outerPt.y - 13}
                  width={badgeWidth}
                  height="26"
                  rx="6"
                  fill="#141408"
                  stroke="#f2ca50"
                  strokeWidth="1.5"
                  className="shadow-xl"
                />
              )}

              {/* Vertex Label Text */}
              <text
                x={outerPt.x}
                y={outerPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? "#f2ca50" : "#f5f0e8"}
                fontSize={isSelected ? "11.5" : "10"}
                fontFamily="var(--font-mono)"
                fontWeight={isSelected ? "bold" : "normal"}
              >
                {labelText}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 font-mono text-xs text-[#9a9280] text-center flex items-center gap-2">
        <span className="text-[#f2ca50] font-bold">● Highlighted Vertex:</span>
        <span className="text-[#f5f0e8] uppercase font-bold">
          {personas.find((p) => p.id === selectedPersonaId)?.name}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN VIEW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const PersonaCollaborationView: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioType>("intentional-twist");
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("idle");
  const [personas, setPersonas] = useState<PersonaExecutionData[]>(INITIAL_PERSONAS);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("director");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState<boolean>(false);
  const [activeMatrixRow, setActiveMatrixRow] = useState<EvidenceMatrixRow | null>(null);
  const [copied, setCopied] = useState(false);

  // Active selected persona object
  const activeSelectedPersona = personas.find((p) => p.id === selectedPersonaId) || personas[0];

  const completedPersonasCount = personas.filter(
    (p) => p.status === "completed" || p.status === "conflict" || p.status === "agreement"
  ).length;

  const addLog = (message: string, source: string, type: "info" | "warning" | "success" | "accent" = "info") => {
    const time = new Date();
    const formattedTime = `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}:${String(time.getSeconds()).padStart(2, "0")}`;
    setLogs((prev) => [...prev.slice(-15), { timestamp: formattedTime, source, message, type }]);
  };

  const handleReset = () => {
    setAnalysisStatus("idle");
    setLogs([]);
    setPersonas(
      INITIAL_PERSONAS.map((p) => ({
        ...p,
        status: "queued",
        currentActivity: "Queued for parallel run",
      }))
    );
  };

  const handleRunOrchestration = () => {
    handleReset();
    setAnalysisStatus("running");

    addLog("System: Initializing Episode 218 Scene 4 context package...", "SYSTEM", "info");
    setTimeout(() => {
      addLog("Router: Context distributed to 5 personas in parallel.", "ROUTER", "accent");
      setPersonas((prev) => prev.map((p) => ({ ...p, status: "context-received", currentActivity: "Context received" })));
    }, 600);

    setTimeout(() => {
      setPersonas((prev) => prev.map((p) => ({ ...p, status: "analyzing", currentActivity: p.currentOperation })));
      addLog("Director: Started narrative structure analysis.", "DIRECTOR", "info");
      addLog("Editor: Started prose consistency analysis.", "EDITOR", "info");
      addLog("Critic: Started cross-episode contradiction scan.", "CRITIC", "warning");
      addLog("Psychologist: Started character-state comparison.", "PSYCHOLOGIST", "info");
      addLog("Historian: Started timeline validation.", "HISTORIAN", "info");
    }, 1400);

    setTimeout(() => {
      addLog("Psychologist: Character state comparison completed.", "PSYCHOLOGIST", "info");
      setPersonas((prev) => prev.map((p) => (p.id === "psychologist" ? { ...p, status: "completed", currentActivity: "Analysis complete" } : p)));
    }, 2710);

    setTimeout(() => {
      addLog("Director: Narrative pacing signal generated.", "DIRECTOR", "info");
      setPersonas((prev) => prev.map((p) => (p.id === "director" ? { ...p, status: "completed", currentActivity: "Analysis complete" } : p)));
    }, 2840);

    setTimeout(() => {
      addLog("Editor: Dialogue transition analysis completed.", "EDITOR", "info");
      setPersonas((prev) => prev.map((p) => (p.id === "editor" ? { ...p, status: "completed", currentActivity: "Analysis complete" } : p)));
    }, 3120);

    setTimeout(() => {
      addLog("Critic: Potential contradiction detected with Episode 47!", "CRITIC", "warning");
      setPersonas((prev) =>
        prev.map((p) => (p.id === "critic" ? { ...p, status: scenario === "plot-hole" ? "conflict" : "signal-found", currentActivity: "Contradiction flagged" } : p))
      );
    }, 3470);

    setTimeout(() => {
      if (scenario === "plot-hole") {
        addLog("Historian: Timeline conflict confirmed in G_true.", "HISTORIAN", "warning");
        setPersonas((prev) => prev.map((p) => (p.id === "historian" ? { ...p, status: "conflict", currentActivity: "Timeline conflict" } : p)));
      } else {
        addLog("Historian: Downstream payoff verified in Episode 225!", "HISTORIAN", "success");
        setPersonas((prev) => prev.map((p) => (p.id === "historian" ? { ...p, status: "agreement", currentActivity: "Protected twist verified" } : p)));
      }
    }, 3810);

    setTimeout(() => {
      addLog("Consensus Engine: Cross-persona reconciliation started...", "CONSENSUS ENGINE", "accent");
      addLog("Memory Graph: Cross-checking signals against G_true & G_perceived...", "GRAPH ENGINE", "info");
    }, 5500);

    setTimeout(() => {
      setAnalysisStatus("complete");
      setPersonas((prev) =>
        prev.map((p) => ({
          ...p,
          status: scenario === "plot-hole" ? (p.id === "critic" || p.id === "historian" ? "conflict" : "completed") : "agreement",
        }))
      );

      if (scenario === "plot-hole") {
        addLog("CanonPulse Decision: Classified as ACCIDENTAL PLOT HOLE.", "CANONPULSE", "warning");
      } else {
        addLog("CanonPulse Decision: Classified as PROTECTED INTENTIONAL TWIST.", "CANONPULSE", "success");
      }
    }, 8500);
  };

  useEffect(() => {
    if (logs.length === 0) {
      addLog("Writers' Room ready. Select any persona from the dropdown menu.", "SYSTEM", "info");
    }
  }, []);

  const copyJsonToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="-m-6 bg-[#080800] text-[#f5f0e8] min-h-screen p-6 md:p-8 space-y-6 font-sans border-t border-[rgba(242,202,80,0.12)]">
      {/* ─────────────────────────────────────────────────────────────────────────
          HEADER & TOP METRICS
      ───────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.15)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold italic text-[#f5f0e8]">
              AI Writers&apos; Room
            </h1>

            <span
              className={`text-xs font-mono px-3 py-1 rounded-full border flex items-center gap-2 font-bold ${
                analysisStatus === "idle"
                  ? "bg-[#141408] text-[#9a9280] border-[rgba(242,202,80,0.2)]"
                  : analysisStatus === "complete"
                  ? "bg-[rgba(126,224,138,0.15)] text-[#7ee08a] border-[rgba(126,224,138,0.3)]"
                  : "bg-[rgba(242,202,80,0.15)] text-[#f2ca50] border-[rgba(242,202,80,0.4)] animate-pulse"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  analysisStatus === "idle"
                    ? "bg-[#9a9280]"
                    : analysisStatus === "complete"
                    ? "bg-[#7ee08a]"
                    : "bg-[#f2ca50] animate-ping"
                }`}
              />
              {analysisStatus === "idle"
                ? "● Writers' Room Ready"
                : analysisStatus === "complete"
                ? "✓ Analysis Complete"
                : "● Analysis in Progress..."}
            </span>
          </div>

          <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#9a9280] italic mt-0.5">
            Five specialized AI personas analyze the same story from five expert perspectives.
          </p>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <div className="bg-[#080800] p-1 rounded-xl border border-[rgba(242,202,80,0.2)] flex">
            <button
              onClick={() => {
                setScenario("intentional-twist");
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                scenario === "intentional-twist"
                  ? "bg-[rgba(126,224,138,0.2)] text-[#7ee08a] border border-[rgba(126,224,138,0.4)]"
                  : "text-[#9a9280] hover:text-[#f5f0e8]"
              }`}
            >
              Intentional Twist
            </button>
            <button
              onClick={() => {
                setScenario("plot-hole");
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                scenario === "plot-hole"
                  ? "bg-[rgba(255,92,77,0.2)] text-[#ff5c4d] border border-[rgba(255,92,77,0.4)]"
                  : "text-[#9a9280] hover:text-[#f5f0e8]"
              }`}
            >
              Accidental Plot Hole
            </button>
          </div>

          <button
            onClick={handleRunOrchestration}
            disabled={analysisStatus === "running"}
            className="gold-button px-5 py-2 rounded-xl flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(242,202,80,0.3)] active:scale-95 disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            <span>▶ Run Parallel Analysis</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset View"
            className="p-2.5 bg-[#080800] border border-[rgba(242,202,80,0.2)] hover:border-[#f2ca50] rounded-xl text-[#9a9280] hover:text-[#f5f0e8]"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          ROW 1 DASHBOARD GRID: PERSONA DROPDOWN MENU & INTELLIGENCE PANEL (7 COLS) + PENTAGON RADAR (5 COLS)
      ───────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 Cols): Persona Selector Dropdown Menu + Detailed Intelligence & JSON Panel */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.25)] flex flex-col justify-between space-y-4">
          
          {/* PERSONA SELECTOR DROPDOWN MENU */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(242,202,80,0.12)] pb-3">
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280] uppercase tracking-widest font-semibold">
              SELECT AI PERSONA PERSPECTIVE
            </span>

            {/* STYLED DROPDOWN MENU */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#9a9280]">AI Persona:</span>
              <div className="relative">
                <select
                  value={selectedPersonaId}
                  onChange={(e) => setSelectedPersonaId(e.target.value)}
                  className="bg-[#080800] border border-[rgba(242,202,80,0.3)] rounded-xl pl-3.5 pr-9 py-2 text-xs font-bold text-[#f2ca50] outline-none cursor-pointer appearance-none focus:border-[#f2ca50] shadow-[0_0_12px_rgba(242,202,80,0.15)] min-w-[200px]"
                >
                  {personas.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0d0d08] text-[#f5f0e8] py-1">
                      {p.name} — {p.role}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3 top-2.5 text-[#f2ca50] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* DETAILED SELECTED PERSONA INTELLIGENCE & JSON PANEL */}
          <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.2)] space-y-4 font-mono text-xs flex-1 flex flex-col justify-between">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(242,202,80,0.1)] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[rgba(242,202,80,0.1)] border border-[rgba(242,202,80,0.25)] flex items-center justify-center shrink-0">
                  {renderPersonaIcon(activeSelectedPersona.id, "h-5 w-5 text-[#f2ca50]")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold italic text-[#f5f0e8]">
                      {activeSelectedPersona.name}
                    </h2>
                    <span className="text-[10px] text-[#7ee08a] font-bold bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded border border-[rgba(126,224,138,0.3)]">
                      {activeSelectedPersona.confidence}% Confidence
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9a9280] font-mono">
                    {activeSelectedPersona.role} • Execution: {activeSelectedPersona.executionTime}s • Tokens: {activeSelectedPersona.tokens}
                  </span>
                </div>
              </div>

              <button
                onClick={() => copyJsonToClipboard(JSON.stringify(activeSelectedPersona.modelOutput, null, 2))}
                className="ghost-button px-3 py-1.5 rounded-lg text-xs text-[#f2ca50] flex items-center gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copied ? "Copied!" : "Copy JSON"}</span>
              </button>
            </div>

            {/* Key Finding Statement */}
            <div className="space-y-1">
              <span className="text-[9px] text-[#9a9280] uppercase font-bold block">KEY ANALYSIS FINDING</span>
              <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#f5f0e8] italic bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.12)]">
                &quot;{scenario === "plot-hole" ? activeSelectedPersona.findingText.plotHole : activeSelectedPersona.findingText.twist}&quot;
              </p>
            </div>

            {/* Reasoning Lenses & Evidence summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
              <div className="bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.1)] space-y-1">
                <span className="text-[#9a9280] block font-bold">SPECIALIZED LENSES EVALUATED:</span>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {activeSelectedPersona.lenses.map((lens) => (
                    <span key={lens} className="bg-[rgba(242,202,80,0.1)] text-[#f2ca50] px-2 py-0.5 rounded font-bold">
                      {lens}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.1)] space-y-1">
                <span className="text-[#9a9280] block font-bold">CANON EVIDENCE CITATION:</span>
                <span className="text-[#f5f0e8] block">
                  Episode {activeSelectedPersona.evidence[0]?.episode}: {activeSelectedPersona.evidence[0]?.event}
                </span>
              </div>
            </div>

            {/* JSON Model Response Output */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[10px] text-[#9a9280]">
                <span className="uppercase font-bold">STRUCTURED MODEL RESPONSE (JSON)</span>
                <span className="text-[#f2ca50]">{activeSelectedPersona.id}_output.json</span>
              </div>
              <pre className="bg-[#050500] p-4 rounded-xl border border-[rgba(242,202,80,0.2)] text-[11px] text-[#7ee08a] font-mono overflow-x-auto max-h-48 shadow-inner">
                {JSON.stringify(activeSelectedPersona.modelOutput, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Scaled & Proportional 5-Axis Pentagon Consensus Radar Visualizer with Clean Non-Overlapping Badges */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.25)] flex flex-col justify-between items-center">
          <div className="w-full flex justify-between items-center border-b border-[rgba(242,202,80,0.12)] pb-3">
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280] uppercase tracking-widest font-semibold">
              PENTAGON CONSENSUS RADAR
            </span>
            <span className="text-[10px] font-mono text-[#7ee08a] font-bold">5 Vertices Geometry</span>
          </div>

          <PentagonRadarChart
            personas={personas}
            scenario={scenario}
            selectedPersonaId={selectedPersonaId}
            onSelectPersona={(id) => setSelectedPersonaId(id)}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          ROW 2 DASHBOARD GRID: EXECUTION TIMELINE & LOGS (6 COLS) + REASONING LENSES & MATRIX (6 COLS)
      ───────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): Parallel Execution Timeline & Activity Stream */}
        <div className="lg:col-span-6 space-y-6">
          {/* Parallel Execution Timeline */}
          <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-[rgba(242,202,80,0.1)] pb-2">
              <span className="text-[#f2ca50] font-bold tracking-wider uppercase text-[11px]">
                PARALLEL EXECUTION TIMELINE
              </span>
              <span className="text-[10px] text-[#7ee08a] font-bold bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded">
                {completedPersonasCount} / 5 COMPLETE
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {personas.map((p) => {
                const maxTime = 4.0;
                const barPercent = Math.min(100, Math.round((p.executionTime / maxTime) * 100));

                return (
                  <div key={p.id} className="flex items-center gap-3 text-[11px]">
                    <span className="w-20 text-[#9a9280] font-bold shrink-0">{p.name}</span>
                    <div className="flex-1 h-2.5 bg-[#141408] rounded-full overflow-hidden border border-[rgba(242,202,80,0.15)] relative">
                      <div
                        style={{
                          width: analysisStatus === "idle" ? "0%" : `${barPercent}%`,
                          transition: "width 2.5s ease-out",
                        }}
                        className={`h-full rounded-full ${
                          p.status === "conflict" ? "bg-[#ff5c4d]" : "bg-gradient-to-r from-[#e8a820] to-[#f2ca50]"
                        }`}
                      />
                    </div>
                    <span className="w-14 text-right text-[#f2ca50] font-bold shrink-0">
                      {analysisStatus === "idle" ? "0.00s" : `✓ ${p.executionTime}s`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Activity Stream Log */}
          <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.12)] pb-2">
              <div className="flex items-center gap-2 text-[#9a9280]">
                <Terminal className="h-4 w-4 text-[#f2ca50]" />
                <span className="uppercase tracking-widest font-semibold text-[#f5f0e8]">LIVE ORCHESTRATION LOG</span>
              </div>
              <span className="text-[10px] text-[#9a9280]">Event Stream</span>
            </div>

            <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.15)] space-y-1.5 max-h-40 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                  <span className="text-[#9a9280] shrink-0">{log.timestamp}</span>
                  <span className="text-[#f2ca50] font-bold shrink-0 min-w-[110px]">{log.source}</span>
                  <span className="text-[#f5f0e8] truncate">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (6 Cols): Evidence Matrix & Lenses */}
        <div className="lg:col-span-6 space-y-6">
          {/* Cross-Persona Evidence Matrix */}
          <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.12)] pb-2">
              <div className="flex items-center gap-2 text-[#9a9280]">
                <BarChart2 className="h-4 w-4 text-[#f2ca50]" />
                <span className="uppercase tracking-widest font-semibold text-[#f5f0e8]">EVIDENCE MATRIX</span>
              </div>
              <span className="text-[10px] text-[#9a9280]">Click row to expand</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(242,202,80,0.15)] text-[#9a9280] text-left">
                    <th className="py-2 px-2">SIGNAL</th>
                    <th className="py-2 px-2 text-center">DIR</th>
                    <th className="py-2 px-2 text-center">EDT</th>
                    <th className="py-2 px-2 text-center">CRT</th>
                    <th className="py-2 px-2 text-center">PSY</th>
                    <th className="py-2 px-2 text-center">HST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(242,202,80,0.08)]">
                  {MATRIX_ROWS.map((row) => (
                    <tr
                      key={row.signalName}
                      onClick={() => setActiveMatrixRow(activeMatrixRow?.signalName === row.signalName ? null : row)}
                      className="hover:bg-[#141408] cursor-pointer transition"
                    >
                      <td className="py-2 px-2 font-semibold text-[#f5f0e8]">{row.signalName}</td>
                      {(["director", "editor", "critic", "psychologist", "historian"] as const).map((key) => {
                        const val = row[key];
                        return (
                          <td key={key} className="py-2 px-2 text-center">
                            {val === "check" ? (
                              <span className="text-[#7ee08a] font-bold">✓</span>
                            ) : val === "warning" ? (
                              <span className="text-[#ff5c4d] font-bold">⚠</span>
                            ) : (
                              <span className="text-[#9a9280]">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activeMatrixRow && (
              <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.2)] font-mono text-[11px] space-y-1">
                <span className="text-[#f2ca50] font-bold block">{activeMatrixRow.signalName} Note:</span>
                <p className="text-[#f5f0e8] italic">{activeMatrixRow.evidenceNote}</p>
              </div>
            )}
          </div>

          {/* Persona Lenses Summary */}
          <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-3 font-mono text-xs">
            <span className="text-[#9a9280] uppercase tracking-widest font-semibold block border-b border-[rgba(242,202,80,0.12)] pb-2">
              SPECIALIZED REASONING LENSES
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
              {personas.map((p) => (
                <div key={p.id} className="bg-[#080800] p-2.5 rounded-lg border border-[rgba(242,202,80,0.1)] space-y-1">
                  <span className="text-[#f2ca50] font-bold block">{p.name}</span>
                  <span className="text-[#9a9280] block italic truncate">{p.lenses.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          ROW 3 DASHBOARD GRID: DUAL-LAYER VALIDATION (7 COLS) + FINAL CANONPULSE DECISION (5 COLS)
      ───────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Dual-Layer Validation */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.12)] pb-3">
            <div className="flex items-center gap-2 font-mono text-xs text-[#9a9280]">
              <GitBranch className="h-4 w-4 text-[#f2ca50]" />
              <span className="uppercase tracking-widest font-semibold text-[#f5f0e8]">DUAL-LAYER VALIDATION</span>
            </div>
            <span className="text-[10px] font-mono text-[#7ee08a] font-bold">✓ STORY LOGIC PRESERVED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-[#080800] p-3.5 rounded-xl border border-[rgba(242,202,80,0.15)] space-y-2">
              <span className="text-[#f2ca50] font-bold block">G_true (Chronological Reality)</span>
              <div className="flex items-center justify-between bg-[#141408] p-2.5 rounded-lg text-center text-[11px]">
                <span className="text-[#f5f0e8] font-bold">Ep 47</span>
                <span>→</span>
                <span className="text-[#f5f0e8] font-bold">Ep 178</span>
                <span>→</span>
                <span className="text-[#ff5c4d] font-bold">Ep 218</span>
                <span>→</span>
                <span className="text-[#7ee08a] font-bold">Ep 225</span>
              </div>
            </div>

            <div className="bg-[#080800] p-3.5 rounded-xl border border-[rgba(242,202,80,0.15)] space-y-2">
              <span className="text-[#f2ca50] font-bold block">G_perceived (Audience Revelation)</span>
              <div className="flex items-center justify-between bg-[#141408] p-2.5 rounded-lg text-center text-[11px]">
                <span className="text-[#f5f0e8] font-bold">Ep 47</span>
                <span>→</span>
                <span className="text-[#f2ca50] font-bold">Ep 218</span>
                <span>→</span>
                <span className="text-[#f5f0e8] font-bold">Ep 178</span>
                <span>→</span>
                <span className="text-[#7ee08a] font-bold">Ep 225</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Final CanonPulse Decision Panel */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.25)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280] uppercase tracking-widest font-semibold">
              FINAL CANONPULSE DECISION
            </span>
            <span className="text-xs font-mono text-[#f2ca50] font-bold">94% Confidence</span>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-3 ${
              scenario === "plot-hole"
                ? "bg-[rgba(255,92,77,0.04)] border-[rgba(255,92,77,0.3)]"
                : "bg-[rgba(126,224,138,0.04)] border-[rgba(126,224,138,0.3)]"
            }`}
          >
            <div className="flex items-center gap-2">
              {scenario === "plot-hole" ? (
                <AlertTriangle className="h-5 w-5 text-[#ff5c4d]" />
              ) : (
                <Lock className="h-5 w-5 text-[#7ee08a]" />
              )}
              <h2 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold italic text-[#f5f0e8]">
                {scenario === "plot-hole" ? "⚠ ACCIDENTAL PLOT HOLE" : "🔒 INTENTIONAL TWIST (PROTECTED)"}
              </h2>
            </div>

            <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#f5f0e8] leading-relaxed">
              {scenario === "plot-hole"
                ? "Three independent persona signals align with a missing downstream payoff."
                : "Downstream evidence in Episode 225 indicates the contradiction is an intentional reveal."}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 font-mono text-xs">
              {scenario === "plot-hole" ? (
                <button
                  onClick={() => setIsRepairModalOpen(true)}
                  className="gold-button px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(242,202,80,0.3)]"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>PREVIEW SURGICAL REPAIR</span>
                </button>
              ) : (
                <button className="bg-[rgba(126,224,138,0.2)] text-[#7ee08a] border border-[rgba(126,224,138,0.4)] px-4 py-2 rounded-lg font-bold flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  <span>PROTECTED TWIST</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SURGICAL REPAIR PREVIEW MODAL */}
      {isRepairModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080800]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel border border-[rgba(242,202,80,0.3)] p-6 rounded-2xl max-w-xl w-full space-y-6 shadow-2xl bg-[#0d0d08]">
            <div className="flex justify-between items-center border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-[#f2ca50]" />
                <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#f5f0e8] font-bold uppercase">
                  SURGICAL NODE REPAIR PREVIEW
                </span>
              </div>
              <button onClick={() => setIsRepairModalOpen(false)} className="text-[#9a9280] hover:text-[#f5f0e8]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(255,92,77,0.3)] space-y-2">
                <span className="text-[10px] text-[#ff5c4d] uppercase font-bold block">BEFORE</span>
                <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#f5f0e8] italic">
                  &quot;I have never seen this photograph.&quot;
                </p>
              </div>

              <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(126,224,138,0.3)] space-y-2">
                <span className="text-[10px] text-[#7ee08a] uppercase font-bold block">AFTER</span>
                <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#f5f0e8] italic">
                  &quot;I haven&apos;t seen this photograph in years.&quot;
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setIsRepairModalOpen(false)}
                className="ghost-button px-4 py-2 rounded-lg text-[#9a9280] hover:text-[#f5f0e8]"
              >
                Close
              </button>
              <button
                onClick={() => setIsRepairModalOpen(false)}
                className="gold-button px-5 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(242,202,80,0.3)]"
              >
                Apply Surgical Repair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
