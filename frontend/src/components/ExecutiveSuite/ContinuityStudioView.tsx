"use client";

import React, { useState } from "react";
import {
  Layers,
  Search,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Languages,
  Wrench,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  FileCheck,
  Network,
  X,
  BookOpen
} from "lucide-react";

export const ContinuityStudioView: React.FC = () => {
  // Surface 1: Series Memory State
  const [memoryQuery, setMemoryQuery] = useState("What did we plant in Ep 47?");
  const [memoryDrawerOpen, setMemoryDrawerOpen] = useState(false);
  const [activeMemoryResult, setActiveMemoryResult] = useState<{
    node: string;
    episode: number;
    description: string;
    plant: string;
    status: "Protected" | "Broken" | "Outstanding";
    relatedPayoff: string;
    distance: string;
    excerpt: string;
    verified: boolean;
  }>({
    node: "Episode 47 · Narrative Node",
    episode: 47,
    description: "The starlight scroll was discovered in the Archive Vault.",
    plant: "Episode 47",
    status: "Protected",
    relatedPayoff: "Episode 218",
    distance: "171 episodes",
    excerpt:
      "ELENA (whispering)\n“Look beneath the silver seal. The starlight scroll has been here since the founding dynasty.”\n\nShe pulls the cylindrical canister from the stone alcove. The celestial runes pulse with faint luminescence.",
    verified: true,
  });

  // Surface 2: Pre-Publish State
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);
  const [repaired, setRepaired] = useState(false);

  // Surface 3: Writer Handoff State
  const [expandedObligation, setExpandedObligation] = useState<string | null>("vault");
  const [handoffModalOpen, setHandoffModalOpen] = useState(false);

  // Surface 4: Showrunner Debt Board State
  const [selectedSeries, setSelectedSeries] = useState("The Last Monsoon");

  // Surface 5: Localization State
  const [targetLang, setTargetLang] = useState<"Spanish" | "Hindi" | "Tamil" | "French">("Spanish");
  const [diffModalOpen, setDiffModalOpen] = useState(false);

  // Unified Graph State
  const [hoveredGraphNode, setHoveredGraphNode] = useState<string | null>(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>("ledger");

  const handleMemorySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (memoryQuery.toLowerCase().includes("sword") || memoryQuery.toLowerCase().includes("weapon")) {
      setActiveMemoryResult({
        node: "Episode 84 · Entity Definition Node",
        episode: 84,
        description: "The ceremonial broadsword was forged from pure star-iron in the southern crags.",
        plant: "Episode 84",
        status: "Protected",
        relatedPayoff: "Episode 112",
        distance: "28 episodes",
        excerpt:
          "VARRIC\n“Take the star-iron blade. Normal steel will shatter against the obsidian gate.”",
        verified: true,
      });
    } else if (memoryQuery.toLowerCase().includes("vault") || memoryQuery.toLowerCase().includes("47")) {
      setActiveMemoryResult({
        node: "Episode 47 · Narrative Node",
        episode: 47,
        description: "The starlight scroll was discovered in the Archive Vault.",
        plant: "Episode 47",
        status: "Protected",
        relatedPayoff: "Episode 218",
        distance: "171 episodes",
        excerpt:
          "ELENA (whispering)\n“Look beneath the silver seal. The starlight scroll has been here since the founding dynasty.”\n\nShe pulls the cylindrical canister from the stone alcove. The celestial runes pulse with faint luminescence.",
        verified: true,
      });
    } else {
      setActiveMemoryResult({
        node: `Query Search · Narrative Node`,
        episode: 12,
        description: `Verified narrative claim matching: "${memoryQuery}"`,
        plant: "Episode 12",
        status: "Protected",
        relatedPayoff: "Episode 195",
        distance: "183 episodes",
        excerpt:
          "NARRATOR\n“The vows spoken under the eclipsed sun cannot be undone by mortal hands.”",
        verified: true,
      });
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* ── TOP HEADER & BREADCRUMB ────────────────────────────────────────── */}
      <div className="border-b border-[rgba(242,202,80,0.15)] pb-6 space-y-2">
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#9a9280] flex items-center gap-2"
        >
          <span>Executive Suite</span>
          <span className="text-[#f2ca50]">&rsaquo;</span>
          <span className="text-[#f2ca50] font-semibold">Continuity Studio</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-3xl sm:text-4xl font-semibold italic text-[#f5f0e8] tracking-tight"
            >
              Continuity Studio
            </h1>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-sm sm:text-base text-[#9a9280] italic mt-1 max-w-3xl"
            >
              One narrative ledger powering memory, publishing, handoffs, debt, and localization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] tracking-[0.2em] text-[#f2ca50] bg-[#141408] border border-[rgba(242,202,80,0.4)] px-3.5 py-1.5 rounded-full uppercase font-semibold flex items-center gap-2"
            >
              <Sparkles className="h-3 w-3 text-[#f2ca50]" />
              <span>UNIFIED LEDGER V2.4</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── PAGE PURPOSE: CINEMATIC VISUAL FLOW (CLEAN GOLD BORDER, NO GLOW) ── */}
      <section className="bg-[#0d0d08] rounded-2xl p-6 sm:p-8 border border-[rgba(242,202,80,0.35)] space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[10px] tracking-[0.25em] text-[#f2ca50] uppercase font-semibold block"
          >
            CORE ARCHITECTURE
          </span>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-2xl sm:text-3xl font-semibold italic text-[#f5f0e8]"
          >
            “Every surface reads the same Graph Ledger.”
          </h2>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-xs sm:text-sm text-[#9a9280] italic"
          >
            A single, persistent dual-layer graph coordinates real-time authoring, editorial handoffs, executive risk governance, and translation parity.
          </p>
        </div>

        {/* Compact Visual Flow: Series → Episodes → Narrative Nodes → Graph Ledger → Insights */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative max-w-5xl mx-auto">
            {/* Step 1: Series */}
            <div className="bg-[#080800] border border-[rgba(242,202,80,0.25)] rounded-xl p-4 text-center space-y-2 relative group hover:border-[#f2ca50] transition-colors">
              <div className="h-8 w-8 mx-auto rounded-lg bg-[#141408] border border-[rgba(242,202,80,0.35)] flex items-center justify-center text-[#f2ca50]">
                <BookOpen className="h-4 w-4" />
              </div>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block"
              >
                01 · SOURCE
              </span>
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-base font-semibold text-[#f5f0e8] italic"
              >
                Series
              </div>
              <div className="text-[10px] text-[#9a9280] font-mono">220 Episodes Ingested</div>
            </div>

            {/* Step 2: Episodes */}
            <div className="bg-[#080800] border border-[rgba(242,202,80,0.25)] rounded-xl p-4 text-center space-y-2 relative group hover:border-[#f2ca50] transition-colors">
              <div className="h-8 w-8 mx-auto rounded-lg bg-[#141408] border border-[rgba(242,202,80,0.35)] flex items-center justify-center text-[#f2ca50]">
                <FileText className="h-4 w-4" />
              </div>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block"
              >
                02 · BOUNDARY
              </span>
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-base font-semibold text-[#f5f0e8] italic"
              >
                Episodes
              </div>
              <div className="text-[10px] text-[#9a9280] font-mono">Perceived Order $G_p$</div>
            </div>

            {/* Step 3: Narrative Nodes */}
            <div className="bg-[#080800] border border-[rgba(242,202,80,0.25)] rounded-xl p-4 text-center space-y-2 relative group hover:border-[#f2ca50] transition-colors">
              <div className="h-8 w-8 mx-auto rounded-lg bg-[#141408] border border-[rgba(242,202,80,0.35)] flex items-center justify-center text-[#f2ca50]">
                <Network className="h-4 w-4" />
              </div>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block"
              >
                03 · CLAIMS
              </span>
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-base font-semibold text-[#f5f0e8] italic"
              >
                Narrative Nodes
              </div>
              <div className="text-[10px] text-[#9a9280] font-mono">Story Timeline $G_t$</div>
            </div>

            {/* Step 4: Core Ledger (Crisp Golden Border) */}
            <div className="bg-[#141408] border-2 border-[#f2ca50] rounded-xl p-4 text-center space-y-2 relative group">
              <div className="h-8 w-8 mx-auto rounded-lg bg-[#080800] border border-[#f2ca50] flex items-center justify-center text-[#f2ca50]">
                <Layers className="h-4 w-4 text-[#ffd966]" />
              </div>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#f2ca50] uppercase font-bold block"
              >
                04 · CORE TRUTH
              </span>
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-base font-semibold text-[#ffd966] italic"
              >
                Graph Ledger
              </div>
              <div className="text-[10px] text-[#f2ca50] font-mono">Dual-Layer Resolver</div>
            </div>

            {/* Step 5: Insights */}
            <div className="bg-[#080800] border border-[rgba(242,202,80,0.25)] rounded-xl p-4 text-center space-y-2 relative group hover:border-[#f2ca50] transition-colors">
              <div className="h-8 w-8 mx-auto rounded-lg bg-[#141408] border border-[rgba(242,202,80,0.35)] flex items-center justify-center text-[#f2ca50]">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block"
              >
                05 · ACTION
              </span>
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-base font-semibold text-[#f5f0e8] italic"
              >
                Insights
              </div>
              <div className="text-[10px] text-[#7ee08a] font-mono">5 Unified Surfaces</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 UNIFIED PRODUCT SURFACES ────────────────────────────────────── */}
      <div className="space-y-10">

        {/* ── SURFACE 01: SERIES MEMORY ────────────────────────────────────── */}
        <section id="surface-memory" className="bg-[#0d0d08] rounded-2xl p-6 sm:p-8 border border-[rgba(242,202,80,0.3)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(242,202,80,0.15)] pb-4">
            <div>
              <div className="flex items-center gap-3">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] tracking-[0.2em] text-[#f2ca50] uppercase font-semibold bg-[#141408] px-2.5 py-1 rounded border border-[rgba(242,202,80,0.3)]"
                >
                  WRITER / SHOWRUNNER
                </span>
                <span className="text-xs font-mono text-[#9a9280]">SURFACE 01</span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl font-semibold italic text-[#f5f0e8] mt-2"
              >
                Series Memory
              </h3>
            </div>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-xs sm:text-sm text-[#9a9280] italic max-w-md"
            >
              Search the persistent narrative ledger across the entire series.
            </p>
          </div>

          {/* Search Field */}
          <form onSubmit={handleMemorySearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={memoryQuery}
                onChange={(e) => setMemoryQuery(e.target.value)}
                placeholder="What did we plant in Ep 47?"
                style={{ fontFamily: "var(--font-body)" }}
                className="w-full bg-[#080800] border border-[rgba(242,202,80,0.3)] rounded-xl pl-11 pr-28 py-3.5 text-sm text-[#f5f0e8] placeholder-[#9a9280]/60 focus:outline-none focus:border-[#f2ca50] transition-colors"
              />
              <Search className="absolute left-4 top-4 h-4 w-4 text-[#9a9280]" />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 gold-button px-5 py-1.5 rounded-lg text-xs font-semibold"
              >
                Query Ledger
              </button>
            </div>

            {/* Quick Query Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
              <span className="text-[#9a9280]">Try queries:</span>
              <button
                type="button"
                onClick={() => setMemoryQuery("What did we plant in Ep 47?")}
                className="text-[#d4c49a] bg-[#141408] border border-[rgba(242,202,80,0.2)] hover:border-[#f2ca50] px-2.5 py-1 rounded transition-colors"
              >
                What did we plant in Ep 47?
              </button>
              <button
                type="button"
                onClick={() => setMemoryQuery("Where was the star-iron sword forged?")}
                className="text-[#d4c49a] bg-[#141408] border border-[rgba(242,202,80,0.2)] hover:border-[#f2ca50] px-2.5 py-1 rounded transition-colors"
              >
                Where was the star-iron sword forged?
              </button>
            </div>
          </form>

          {/* Result Card */}
          <div className="bg-[#080800] border border-[rgba(242,202,80,0.3)] rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-xs font-bold text-[#f2ca50]"
                >
                  {activeMemoryResult.node}
                </span>
                <span className="text-xs text-[#9a9280]">•</span>
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] tracking-wider uppercase font-semibold text-[#7ee08a] bg-[#141408] px-2 py-0.5 rounded border border-[rgba(126,224,138,0.3)]"
                >
                  {activeMemoryResult.status}
                </span>
              </div>

              {/* Verified Ledger Badge */}
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#f2ca50] bg-[#141408] px-3 py-1 rounded-full border border-[rgba(242,202,80,0.3)]">
                <Sparkles className="h-3.5 w-3.5 text-[#ffd966]" />
                <span className="font-semibold">Ledger Citation Verified</span>
              </div>
            </div>

            <p
              style={{ fontFamily: "var(--font-display)" }}
              className="text-lg sm:text-xl font-semibold italic text-[#f5f0e8] leading-relaxed"
            >
              “{activeMemoryResult.description}”
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#141408] p-3.5 rounded-lg border border-[rgba(242,202,80,0.15)] text-xs font-mono">
              <div>
                <span className="text-[#9a9280] block text-[10px] uppercase">Plant</span>
                <span className="text-[#f5f0e8] font-semibold">{activeMemoryResult.plant}</span>
              </div>
              <div>
                <span className="text-[#9a9280] block text-[10px] uppercase">Status</span>
                <span className="text-[#7ee08a] font-semibold">{activeMemoryResult.status}</span>
              </div>
              <div>
                <span className="text-[#9a9280] block text-[10px] uppercase">Related Payoff</span>
                <span className="text-[#f2ca50] font-semibold">{activeMemoryResult.relatedPayoff}</span>
              </div>
              <div>
                <span className="text-[#9a9280] block text-[10px] uppercase">Distance</span>
                <span className="text-[#d4c49a] font-semibold">{activeMemoryResult.distance}</span>
              </div>
            </div>

            {/* Citation / Excerpt Drawer Interaction */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMemoryDrawerOpen(!memoryDrawerOpen)}
                className="text-xs font-mono text-[#d4c49a] hover:text-[#f2ca50] flex items-center gap-1.5 transition-colors"
              >
                {memoryDrawerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span>{memoryDrawerOpen ? "Hide Scripture Excerpt" : "View Verbatim Episode Excerpt & Citations"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedGraphNode("node-47");
                  const graphEl = document.getElementById("unified-graph-section");
                  if (graphEl) graphEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="gold-button px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Open in Graph</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Expandable Excerpt Content */}
            {memoryDrawerOpen && (
              <div className="bg-[#141408] p-4 rounded-xl border border-[rgba(242,202,80,0.25)] space-y-2 mt-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#9a9280] border-b border-[rgba(242,202,80,0.15)] pb-1.5">
                  <span>EXCERPT REF: EPISODE 47 · SCENE 3 [LINES 142-156]</span>
                  <span className="text-[#7ee08a]">CONFIDENCE: 0.992</span>
                </div>
                <pre className="font-mono text-xs text-[#d4c49a] whitespace-pre-wrap leading-relaxed">
                  {activeMemoryResult.excerpt}
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* ── SURFACE 02: PRE-PUBLISH CHECK ────────────────────────────────── */}
        <section id="surface-prepublish" className="bg-[#0d0d08] rounded-2xl p-6 sm:p-8 border border-[rgba(242,202,80,0.3)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(242,202,80,0.15)] pb-4">
            <div>
              <div className="flex items-center gap-3">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] tracking-[0.2em] text-[#f2ca50] uppercase font-semibold bg-[#141408] px-2.5 py-1 rounded border border-[rgba(242,202,80,0.3)]"
                >
                  WRITER
                </span>
                <span className="text-xs font-mono text-[#9a9280]">SURFACE 02</span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl font-semibold italic text-[#f5f0e8] mt-2"
              >
                Pre-Publish Check
              </h3>
            </div>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-xs sm:text-sm text-[#9a9280] italic max-w-md"
            >
              Audit the next episode before it becomes part of the canon.
            </p>
          </div>

          {/* Episode Analysis Card */}
          <div className="bg-[#080800] border border-[rgba(242,202,80,0.25)] rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div>
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-xs font-bold text-[#f2ca50] block"
                >
                  EPISODE 220 · PRE-PUBLISH AUDIT
                </span>
                <span
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-sm text-[#9a9280] italic"
                >
                  Target Draft: “The Crimson Solstice” (Word count: 3,420)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ff5c4d]" />
                <span className="text-xs font-mono text-[#ff5c4d] font-semibold uppercase">
                  {repaired ? "ALL GATES RESOLVED" : "GATE ACTION REQUIRED"}
                </span>
              </div>
            </div>

            {/* Three Primary Status Groups */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              {/* Group 1: Real Holes */}
              <div className="bg-[#141408] border border-[rgba(255,92,77,0.3)] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#ff5c4d] font-bold flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" /> REAL HOLES
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-2xl font-bold text-[#ff5c4d]"
                  >
                    {repaired ? "0" : "6"}
                  </span>
                </div>
                <p className="text-xs text-[#9a9280] leading-tight">
                  {repaired ? "All contradictions surgically repaired." : "Unrepaired contradictions with no downstream payoff."}
                </p>
              </div>

              {/* Group 2: Intentional Twists */}
              <div className="bg-[#141408] border border-[rgba(242,202,80,0.3)] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#f2ca50] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#f2ca50]" /> INTENTIONAL TWISTS
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-2xl font-bold text-[#f2ca50]"
                  >
                    5
                  </span>
                </div>
                <p className="text-xs text-[#9a9280] leading-tight">
                  Protected by verified downstream payoff links.
                </p>
              </div>

              {/* Group 3: Outstanding */}
              <div className="bg-[#141408] border border-[rgba(255,179,71,0.3)] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#ffb347] font-bold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#ffb347]" /> OUTSTANDING
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-2xl font-bold text-[#ffb347]"
                  >
                    3
                  </span>
                </div>
                <p className="text-xs text-[#9a9280] leading-tight">
                  Open obligations requiring author attention.
                </p>
              </div>
            </div>

            {/* Finding Card: Contradiction Detected */}
            <div className={`p-5 rounded-xl border ${
              repaired
                ? "bg-[#141408] border-[rgba(126,224,138,0.35)]"
                : "bg-[#141408] border-[rgba(255,92,77,0.35)]"
            } space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(242,202,80,0.15)] pb-3">
                <div className="flex items-center gap-2">
                  {repaired ? (
                    <CheckCircle2 className="h-4 w-4 text-[#7ee08a]" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-[#ff5c4d]" />
                  )}
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className={`text-xs font-bold ${repaired ? "text-[#7ee08a]" : "text-[#ff5c4d]"}`}
                  >
                    {repaired ? "Node Repaired & Aligned with Canon" : "Contradiction Detected"}
                  </span>
                  <span className="text-xs text-[#9a9280]">•</span>
                  <span className="text-xs font-mono text-[#d4c49a]">Episode 199</span>
                </div>

                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                    repaired
                      ? "bg-[#080800] text-[#7ee08a] border border-[rgba(126,224,138,0.3)]"
                      : "bg-[#080800] text-[#ff5c4d] border border-[rgba(255,92,77,0.3)]"
                  }`}
                >
                  {repaired ? "RESOLVED" : "STATUS: BROKEN"}
                </span>
              </div>

              {/* Finding Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-[#080800] p-3.5 rounded-lg border border-[rgba(255,92,77,0.25)] space-y-1">
                  <span className="text-[10px] text-[#ff5c4d] uppercase font-bold block">Current Finding (Ep 199)</span>
                  <p className="text-[#f5f0e8] italic">
                    “Character A claims the vault was never opened.”
                  </p>
                </div>

                <div className="bg-[#080800] p-3.5 rounded-lg border border-[rgba(242,202,80,0.35)] space-y-1">
                  <span className="text-[10px] text-[#f2ca50] uppercase font-bold block">Graph Canonical Evidence (Ep 47)</span>
                  <p className="text-[#d4c49a] italic">
                    “Episode 47 — Character A discovers the vault and opens the seal.”
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRepairModalOpen(true)}
                    className="gold-button px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    <span>{repaired ? "Edit Surgical Repair" : "Repair Node"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEvidenceDrawerOpen(!evidenceDrawerOpen)}
                    className="ghost-button px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{evidenceDrawerOpen ? "Hide Evidence" : "View Evidence"}</span>
                  </button>
                </div>

                {repaired && (
                  <button
                    type="button"
                    onClick={() => setRepaired(false)}
                    className="text-xs font-mono text-[#9a9280] hover:text-[#f2ca50] underline"
                  >
                    Reset to original finding
                  </button>
                )}
              </div>

              {/* Expandable Evidence Drawer */}
              {evidenceDrawerOpen && (
                <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.25)] space-y-3 mt-3">
                  <div className="text-xs font-mono text-[#f2ca50] font-semibold border-b border-[rgba(242,202,80,0.15)] pb-2">
                    CITATION PROVENANCE &amp; EXCERPTS
                  </div>
                  <div className="space-y-2 text-xs font-mono text-[#d4c49a]">
                    <div className="p-2.5 bg-[#141408] rounded border border-[rgba(255,92,77,0.25)]">
                      <span className="text-[#ff5c4d] block font-bold">Ep 199 Scene 2 (Draft):</span>
                      <p className="italic">Kael: “We can’t know what’s inside. The Archive Vault has stayed sealed for three hundred years without a single breach.”</p>
                    </div>
                    <div className="p-2.5 bg-[#141408] rounded border border-[rgba(126,224,138,0.35)]">
                      <span className="text-[#7ee08a] block font-bold">Ep 47 Scene 3 (Canon Scripture):</span>
                      <p className="italic">Elena: “Look beneath the silver seal. The starlight scroll has been here since the founding dynasty.” (Elena breaks seal and unrolls parchment).</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Continuation Prediction Panel */}
            <div className="bg-[#141408] p-5 rounded-xl border border-[rgba(242,202,80,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#f2ca50]" />
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-xs font-bold text-[#f2ca50] uppercase tracking-wider"
                  >
                    Continuation Prediction
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-2xl sm:text-3xl font-bold text-[#f5f0e8]"
                  >
                    {repaired ? "78%" : "61% → 78%"}
                  </span>
                  <span className="text-xs font-mono text-[#7ee08a] font-semibold">
                    ± 4% CI
                  </span>
                  <span className="text-xs font-mono text-[#9a9280]">
                    ({repaired ? "+17% retention unlocked" : "post-repair uplift"})
                  </span>
                </div>
              </div>

              {/* Explicit Synthetic Disclosure */}
              <div className="text-[10px] font-mono text-[#9a9280] italic max-w-sm border-l md:border-l border-[rgba(242,202,80,0.2)] pl-3">
                Prediction based on structural graph features. Synthetic training data.
              </div>
            </div>
          </div>
        </section>

        {/* ── SURFACE 03: WRITER HANDOFF ───────────────────────────────────── */}
        <section id="surface-handoff" className="bg-[#0d0d08] rounded-2xl p-6 sm:p-8 border border-[rgba(242,202,80,0.3)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(242,202,80,0.15)] pb-4">
            <div>
              <div className="flex items-center gap-3">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] tracking-[0.2em] text-[#f2ca50] uppercase font-semibold bg-[#141408] px-2.5 py-1 rounded border border-[rgba(242,202,80,0.3)]"
                >
                  MULTI-WRITER TEAM
                </span>
                <span className="text-xs font-mono text-[#9a9280]">SURFACE 03</span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl font-semibold italic text-[#f5f0e8] mt-2"
              >
                Writer Handoff
              </h3>
            </div>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-xs sm:text-sm text-[#9a9280] italic max-w-md"
            >
              Transfer narrative state without losing the promises already made.
            </p>
          </div>

          {/* Handoff Header */}
          <div className="bg-[#080800] p-5 rounded-xl border border-[rgba(242,202,80,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-[#141408] border border-[rgba(242,202,80,0.35)] flex items-center justify-center text-[#f2ca50] font-mono font-bold text-sm">
                AB
              </div>
              <div>
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-xl font-semibold italic text-[#f5f0e8]"
                >
                  Writer A &rarr; Writer B
                </div>
                <div className="text-xs font-mono text-[#f2ca50]">
                  Episode 304 &rarr; 305 Continuity Transfer
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHandoffModalOpen(true)}
              className="gold-button px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
            >
              <FileCheck className="h-4 w-4" />
              <span>Generate Handoff Sheet</span>
            </button>
          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#141408] p-4 rounded-xl border border-[rgba(242,202,80,0.25)] text-center space-y-1">
              <span className="text-[10px] text-[#9a9280] uppercase tracking-wider block">Open Obligations</span>
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl font-bold text-[#f5f0e8]"
              >
                7
              </span>
            </div>

            <div className="bg-[#141408] p-4 rounded-xl border border-[rgba(255,92,77,0.3)] text-center space-y-1">
              <span className="text-[10px] text-[#ff5c4d] uppercase tracking-wider block">Overdue</span>
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl font-bold text-[#ff5c4d]"
              >
                3
              </span>
            </div>

            <div className="bg-[#141408] p-4 rounded-xl border border-[rgba(255,92,77,0.3)] text-center space-y-1">
              <span className="text-[10px] text-[#ff5c4d] uppercase tracking-wider block">Broken</span>
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl font-bold text-[#ff5c4d]"
              >
                2
              </span>
            </div>

            <div className="bg-[#141408] p-4 rounded-xl border border-[rgba(242,202,80,0.3)] text-center space-y-1">
              <span className="text-[10px] text-[#f2ca50] uppercase tracking-wider block">Protected Twists</span>
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-3xl font-bold text-[#f2ca50]"
              >
                5
              </span>
            </div>
          </div>

          {/* Obligation List */}
          <div className="space-y-3 font-mono">
            <span className="text-xs text-[#9a9280] uppercase tracking-wider font-semibold block">
              ACTIVE OBLIGATION REGISTRY
            </span>

            {/* Item 1: The Vault Revelation */}
            <div className="bg-[#080800] border border-[rgba(255,92,77,0.3)] rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-base font-semibold text-[#f5f0e8] italic"
                  >
                    The Vault Revelation
                  </span>
                  <span className="text-xs text-[#9a9280]">Episode 218</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#141408] text-[#ff5c4d] border border-[rgba(255,92,77,0.4)]">
                    OVERDUE
                  </span>
                  <span className="text-[10px] text-[#9a9280]">Urgency: 9.4</span>
                </div>
              </div>

              <div className="text-xs text-[#d4c49a] italic">
                “Elena pledged to reveal the secret of the silver seal before the winter solstice.”
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[rgba(242,202,80,0.1)]">
                <button
                  type="button"
                  onClick={() => setExpandedObligation(expandedObligation === "vault" ? null : "vault")}
                  className="text-[11px] text-[#f2ca50] hover:underline flex items-center gap-1"
                >
                  {expandedObligation === "vault" ? "Close Details" : "Open Details & Citations"}
                </button>
                <span className="text-[10px] text-[#9a9280]">86 episodes overdue</span>
              </div>

              {expandedObligation === "vault" && (
                <div className="bg-[#141408] p-3.5 rounded-lg border border-[rgba(242,202,80,0.2)] text-xs text-[#9a9280] space-y-1.5">
                  <div className="text-[#f2ca50] font-semibold">Script Citation [Ep 218, Scene 4]:</div>
                  <p className="italic text-[#d4c49a]">
                    “ELENA: By the time the snow reaches the lower towers, all will know who truly held the key.”
                  </p>
                  <div className="text-[10px] text-[#7ee08a]">Recommendation: Discharge in Episode 305 Scene 2.</div>
                </div>
              )}
            </div>

            {/* Item 2: Character C Injury */}
            <div className="bg-[#080800] border border-[rgba(255,179,71,0.3)] rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-base font-semibold text-[#f5f0e8] italic"
                  >
                    Character C Injury
                  </span>
                  <span className="text-xs text-[#9a9280]">Episode 301</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#141408] text-[#ffb347] border border-[rgba(255,179,71,0.4)]">
                    TRACK
                  </span>
                  <span className="text-[10px] text-[#9a9280]">Urgency: 6.1</span>
                </div>
              </div>

              <div className="text-xs text-[#d4c49a] italic">
                “Fractured left collarbone sustained in hangar breach; cannot wield two-handed armaments.”
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[rgba(242,202,80,0.1)]">
                <button
                  type="button"
                  onClick={() => setExpandedObligation(expandedObligation === "injury" ? null : "injury")}
                  className="text-[11px] text-[#f2ca50] hover:underline flex items-center gap-1"
                >
                  {expandedObligation === "injury" ? "Close Details" : "Open Details & Citations"}
                </button>
                <span className="text-[10px] text-[#9a9280]">4 episodes active</span>
              </div>

              {expandedObligation === "injury" && (
                <div className="bg-[#141408] p-3.5 rounded-lg border border-[rgba(242,202,80,0.2)] text-xs text-[#9a9280] space-y-1.5">
                  <div className="text-[#f2ca50] font-semibold">Script Citation [Ep 301, Scene 1]:</div>
                  <p className="italic text-[#d4c49a]">
                    “MEDIC: You swing that claymore with that shoulder, and you won’t have an arm left.”
                  </p>
                </div>
              )}
            </div>

            {/* Item 3: Missing Witness */}
            <div className="bg-[#080800] border border-[rgba(242,202,80,0.3)] rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-base font-semibold text-[#f5f0e8] italic"
                  >
                    Missing Witness
                  </span>
                  <span className="text-xs text-[#9a9280]">Episode 277</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#141408] text-[#f2ca50] border border-[rgba(242,202,80,0.4)]">
                    REQUIRED
                  </span>
                  <span className="text-[10px] text-[#9a9280]">Urgency: 8.8</span>
                </div>
              </div>

              <div className="text-xs text-[#d4c49a] italic">
                “Archivist Ren fled through the eastern aqueduct with the ledgers.”
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[rgba(242,202,80,0.1)]">
                <button
                  type="button"
                  onClick={() => setExpandedObligation(expandedObligation === "witness" ? null : "witness")}
                  className="text-[11px] text-[#f2ca50] hover:underline flex items-center gap-1"
                >
                  {expandedObligation === "witness" ? "Close Details" : "Open Details & Citations"}
                </button>
                <span className="text-[10px] text-[#9a9280]">27 episodes active</span>
              </div>

              {expandedObligation === "witness" && (
                <div className="bg-[#141408] p-3.5 rounded-lg border border-[rgba(242,202,80,0.2)] text-xs text-[#9a9280] space-y-1.5">
                  <div className="text-[#f2ca50] font-semibold">Script Citation [Ep 277, Scene 5]:</div>
                  <p className="italic text-[#d4c49a]">
                    “REN: If they find me with these documents, the city burns.”
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SURFACE 04: SHOWRUNNER DEBT BOARD ────────────────────────────── */}
        <section id="surface-debtboard" className="bg-[#0d0d08] rounded-2xl p-6 sm:p-8 border border-[rgba(242,202,80,0.3)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(242,202,80,0.15)] pb-4">
            <div>
              <div className="flex items-center gap-3">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] tracking-[0.2em] text-[#f2ca50] uppercase font-semibold bg-[#141408] px-2.5 py-1 rounded border border-[rgba(242,202,80,0.3)]"
                >
                  STUDIO EXECUTIVE
                </span>
                <span className="text-xs font-mono text-[#9a9280]">SURFACE 04</span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl font-semibold italic text-[#f5f0e8] mt-2"
              >
                Showrunner Debt Board
              </h3>
            </div>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-xs sm:text-sm text-[#9a9280] italic max-w-md"
            >
              Monitor Narrative Debt across every running series.
            </p>
          </div>

          {/* Portfolio Metric Hero + Compact Trend Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Metric Hero */}
            <div className="lg:col-span-4 bg-[#080800] border border-[rgba(242,202,80,0.3)] rounded-xl p-6 space-y-4">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#f2ca50] uppercase font-bold block"
              >
                PORTFOLIO HEALTH
              </span>

              <div className="space-y-1">
                <div className="text-xs font-mono text-[#9a9280] uppercase">Narrative Debt Index</div>
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-5xl font-bold text-[#f5f0e8] tracking-tight"
                >
                  14.8
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f2ca50]" />
                <span className="text-[#f2ca50] font-semibold">STATUS: STABLE</span>
                <span className="text-[#9a9280]">(Under 15.0 Target)</span>
              </div>

              <p className="text-xs text-[#9a9280] font-mono leading-relaxed pt-2 border-t border-[rgba(242,202,80,0.15)]">
                Portfolio NDI is calculated from open obligation age, overdue count, and ungrounded twists.
              </p>
            </div>

            {/* Compact Trend Visualization SVG */}
            <div className="lg:col-span-8 bg-[#080800] border border-[rgba(242,202,80,0.25)] rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#9a9280] uppercase">NDI TRAJECTORY ACROSS RECENT EPISODES (EP 180 &rarr; 220)</span>
                <span className="text-[#7ee08a] font-semibold">&darr; -2.4 pts (Improving)</span>
              </div>

              {/* Trend Chart Canvas/SVG */}
              <div className="h-36 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                  {/* Threshold Guide Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,92,77,0.3)" strokeDasharray="3 3" />
                  <text x="495" y="27" textAnchor="end" fill="#ff5c4d" fontSize="8" fontFamily="monospace">CRITICAL (25.0)</text>

                  <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(242,202,80,0.3)" strokeDasharray="3 3" />
                  <text x="495" y="57" textAnchor="end" fill="#f2ca50" fontSize="8" fontFamily="monospace">STABLE THRESHOLD (15.0)</text>

                  {/* Trend line */}
                  <path
                    d="M 0,80 Q 80,75 160,85 T 300,50 T 400,68 T 500,60"
                    fill="none"
                    stroke="#f2ca50"
                    strokeWidth="2.5"
                  />

                  {/* Key Points */}
                  <circle cx="0" cy="80" r="3.5" fill="#f2ca50" />
                  <circle cx="160" cy="85" r="3.5" fill="#f2ca50" />
                  <circle cx="300" cy="50" r="4.5" fill="#ff5c4d" stroke="#080800" strokeWidth="1.5" />
                  <circle cx="500" cy="60" r="4.5" fill="#7ee08a" stroke="#080800" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#9a9280] pt-2 border-t border-[rgba(242,202,80,0.15)]">
                <span>Ep 180 (NDI 11.2)</span>
                <span>Ep 199 Peak Contradiction (NDI 22.8)</span>
                <span className="text-[#f2ca50] font-bold">Ep 220 Live (NDI 14.8)</span>
              </div>
            </div>
          </div>

          {/* Series Ranking Table */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-[#9a9280] uppercase tracking-wider font-semibold block">
              PORTFOLIO SERIES RANKING &amp; HEALTH
            </span>

            <div className="overflow-x-auto rounded-xl border border-[rgba(242,202,80,0.25)] bg-[#080800]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#141408] text-[#9a9280] uppercase tracking-wider border-b border-[rgba(242,202,80,0.2)]">
                  <tr>
                    <th className="py-3 px-4">Series</th>
                    <th className="py-3 px-4 text-right">NDI</th>
                    <th className="py-3 px-4 text-right">Open</th>
                    <th className="py-3 px-4 text-right">Overdue</th>
                    <th className="py-3 px-4 text-right">Broken</th>
                    <th className="py-3 px-4 text-center">Health</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(242,202,80,0.1)]">
                  {/* Row 1: The Last Monsoon */}
                  <tr className="hover:bg-[#141408] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#f5f0e8] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#f2ca50]" />
                      <span style={{ fontFamily: "var(--font-display)" }} className="text-sm font-semibold italic text-[#f5f0e8]">
                        The Last Monsoon
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#f2ca50]">14.8</td>
                    <td className="py-3.5 px-4 text-right text-[#d4c49a]">12</td>
                    <td className="py-3.5 px-4 text-right text-[#ffb347]">3</td>
                    <td className="py-3.5 px-4 text-right text-[#ff5c4d]">2</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded bg-[#141408] text-[#f2ca50] border border-[rgba(242,202,80,0.3)] font-bold text-[10px]">
                        Stable
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSeries("The Last Monsoon")}
                        className="gold-button px-3 py-1 rounded text-[11px] font-semibold"
                      >
                        Open Series
                      </button>
                    </td>
                  </tr>

                  {/* Row 2: Midnight Archive */}
                  <tr className="hover:bg-[#141408] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#f5f0e8] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#ffb347]" />
                      <span style={{ fontFamily: "var(--font-display)" }} className="text-sm font-semibold italic text-[#f5f0e8]">
                        Midnight Archive
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#ffb347]">21.4</td>
                    <td className="py-3.5 px-4 text-right text-[#d4c49a]">18</td>
                    <td className="py-3.5 px-4 text-right text-[#ffb347]">6</td>
                    <td className="py-3.5 px-4 text-right text-[#ff5c4d]">4</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded bg-[#141408] text-[#ffb347] border border-[rgba(255,179,71,0.3)] font-bold text-[10px]">
                        Attention
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSeries("Midnight Archive")}
                        className="ghost-button px-3 py-1 rounded text-[11px] font-semibold"
                      >
                        Open Series
                      </button>
                    </td>
                  </tr>

                  {/* Row 3: Glass Kingdom */}
                  <tr className="hover:bg-[#141408] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#f5f0e8] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#7ee08a]" />
                      <span style={{ fontFamily: "var(--font-display)" }} className="text-sm font-semibold italic text-[#f5f0e8]">
                        Glass Kingdom
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#7ee08a]">8.2</td>
                    <td className="py-3.5 px-4 text-right text-[#d4c49a]">7</td>
                    <td className="py-3.5 px-4 text-right text-[#d4c49a]">1</td>
                    <td className="py-3.5 px-4 text-right text-[#7ee08a]">0</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded bg-[#141408] text-[#7ee08a] border border-[rgba(126,224,138,0.3)] font-bold text-[10px]">
                        Healthy
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSeries("Glass Kingdom")}
                        className="ghost-button px-3 py-1 rounded text-[11px] font-semibold"
                      >
                        Open Series
                      </button>
                    </td>
                  </tr>

                  {/* Row 4: After Rain */}
                  <tr className="hover:bg-[#141408] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#f5f0e8] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#ff5c4d]" />
                      <span style={{ fontFamily: "var(--font-display)" }} className="text-sm font-semibold italic text-[#f5f0e8]">
                        After Rain
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#ff5c4d]">27.1</td>
                    <td className="py-3.5 px-4 text-right text-[#d4c49a]">22</td>
                    <td className="py-3.5 px-4 text-right text-[#ff5c4d]">8</td>
                    <td className="py-3.5 px-4 text-right text-[#ff5c4d]">5</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded bg-[#141408] text-[#ff5c4d] border border-[rgba(255,92,77,0.4)] font-bold text-[10px]">
                        Critical
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSeries("After Rain")}
                        className="ghost-button px-3 py-1 rounded text-[11px] font-semibold text-[#ff5c4d]"
                      >
                        Open Series
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── SURFACE 05: LOCALIZATION CONTINUITY ──────────────────────────── */}
        <section id="surface-localization" className="bg-[#0d0d08] rounded-2xl p-6 sm:p-8 border border-[rgba(242,202,80,0.3)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(242,202,80,0.15)] pb-4">
            <div>
              <div className="flex items-center gap-3">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] tracking-[0.2em] text-[#f2ca50] uppercase font-semibold bg-[#141408] px-2.5 py-1 rounded border border-[rgba(242,202,80,0.3)]"
                >
                  LOCALIZATION TEAM
                </span>
                <span className="text-xs font-mono text-[#9a9280]">SURFACE 05</span>
              </div>
              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl font-semibold italic text-[#f5f0e8] mt-2"
              >
                Localization Continuity
              </h3>
            </div>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-xs sm:text-sm text-[#9a9280] italic max-w-md"
            >
              Verify translated episodes against the canonical narrative graph.
            </p>
          </div>

          {/* Language Selector + Parity Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.25)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#9a9280] uppercase mr-2">Language Target:</span>
              {(["Spanish", "Hindi", "Tamil", "French"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setTargetLang(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    targetLang === lang
                      ? "bg-[#141408] text-[#f2ca50] border border-[#f2ca50] font-bold"
                      : "text-[#9a9280] hover:text-[#f5f0e8] bg-[#080800] border border-[rgba(242,202,80,0.15)]"
                  }`}
                >
                  English &rarr; {lang}
                </button>
              ))}
            </div>

            {/* Parity Score */}
            <div className="flex items-center gap-3 font-mono">
              <span className="text-xs text-[#9a9280] uppercase">Parity Metric:</span>
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-bold text-[#ffd966]"
              >
                94.2% Graph Alignment
              </span>
            </div>
          </div>

          {/* Side-by-Side Comparison Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Canonical EN */}
            <div className="bg-[#080800] p-5 rounded-xl border border-[rgba(242,202,80,0.3)] space-y-3">
              <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.15)] pb-2 text-[10px] text-[#f2ca50] uppercase font-bold">
                <span>CANONICAL — EN (EPISODE 84)</span>
                <span>ORIGINAL SCRIPT</span>
              </div>
              <p className="text-sm text-[#f5f0e8] italic leading-relaxed">
                “The sword is made of <span className="bg-[#141408] text-[#ffd966] px-1.5 py-0.5 rounded font-bold border border-[rgba(242,202,80,0.4)]">star-iron</span>.”
              </p>
              <div className="text-[11px] text-[#9a9280]">
                Node #418: [Class: Relic] [Material: Star-Iron] [Origin: Southern Crags]
              </div>
            </div>

            {/* Translation Target */}
            <div className="bg-[#080800] p-5 rounded-xl border border-[rgba(255,92,77,0.35)] space-y-3">
              <div className="flex items-center justify-between border-b border-[rgba(255,92,77,0.2)] pb-2 text-[10px] text-[#ff5c4d] uppercase font-bold">
                <span>TRANSLATION — {targetLang.toUpperCase()} (EPISODE 84)</span>
                <span>TARGET SCRIPT</span>
              </div>
              <p className="text-sm text-[#f5f0e8] italic leading-relaxed">
                {targetLang === "Spanish" && (
                  <>“La espada es de <span className="bg-[#141408] text-[#ff5c4d] px-1.5 py-0.5 rounded font-bold border border-[rgba(255,92,77,0.5)]">hierro oscuro</span>.”</>
                )}
                {targetLang === "Hindi" && (
                  <>“तलवार <span className="bg-[#141408] text-[#ff5c4d] px-1.5 py-0.5 rounded font-bold border border-[rgba(255,92,77,0.5)]">काले लोहे (dark-iron)</span> से बनी है।”</>
                )}
                {targetLang === "Tamil" && (
                  <>“வாள் <span className="bg-[#141408] text-[#ff5c4d] px-1.5 py-0.5 rounded font-bold border border-[rgba(255,92,77,0.5)]">இருண்ட இரும்பால் (dark-iron)</span> செய்யப்பட்டது.”</>
                )}
                {targetLang === "French" && (
                  <>“L&apos;épée est faite de <span className="bg-[#141408] text-[#ff5c4d] px-1.5 py-0.5 rounded font-bold border border-[rgba(255,92,77,0.5)]">fer sombre</span>.”</>
                )}
              </p>
              <div className="text-[11px] text-[#ff5c4d]">
                Entity Conflict: <span className="font-bold">star-iron &rarr; dark-iron</span>
              </div>
            </div>
          </div>

          {/* Graph Parity Failure Diagnostic Callout */}
          <div className="bg-[#141408] border border-[rgba(255,92,77,0.4)] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-[#ff5c4d]" />
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs font-bold text-[#ff5c4d] uppercase tracking-wider"
              >
                GRAPH PARITY FAILURE
              </span>
            </div>

            <p
              style={{ fontFamily: "var(--font-display)" }}
              className="text-base font-semibold italic text-[#f5f0e8]"
            >
              “Translated property conflicts with the canonical entity definition.”
            </p>

            {/* Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono bg-[#080800] p-4 rounded-lg border border-[rgba(242,202,80,0.15)]">
              <div>
                <span className="text-[#9a9280] text-[10px] uppercase block">Canonical Node</span>
                <span className="text-[#ffd966] font-semibold">Node #418 (Star-Iron)</span>
              </div>
              <div>
                <span className="text-[#9a9280] text-[10px] uppercase block">Translation Node</span>
                <span className="text-[#ff5c4d] font-semibold">Node #418-ES (Dark-Iron)</span>
              </div>
              <div>
                <span className="text-[#9a9280] text-[10px] uppercase block">Broken Relationship</span>
                <span className="text-[#ff5c4d] font-semibold">Material Inversion</span>
              </div>
              <div>
                <span className="text-[#9a9280] text-[10px] uppercase block">Episode Reference</span>
                <span className="text-[#d4c49a]">Episode 84 · Scene 2</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#9a9280] text-[10px] uppercase block">Downstream Risk</span>
                <span className="text-[#ffb347]">Breaks Ep 112 payoff where blade reflects celestial light.</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setDiffModalOpen(true)}
                className="gold-button px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <span>View Graph Difference</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ── UNIFIED NARRATIVE GRAPH PANEL (CLEAN GOLD BORDER, NO GLOW) ────── */}
      <section id="unified-graph-section" className="bg-[#0d0d08] rounded-2xl p-6 sm:p-10 border border-[rgba(242,202,80,0.35)] space-y-8 relative overflow-hidden">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[10px] tracking-[0.25em] text-[#f2ca50] uppercase font-bold block"
          >
            SHARED CORE
          </span>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-3xl sm:text-4xl font-semibold italic text-[#f5f0e8]"
          >
            Unified Narrative Graph
          </h2>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-sm sm:text-base text-[#9a9280] italic"
          >
            Five surfaces. One source of truth.
          </p>
        </div>

        {/* Dual-Layer Core Graphic with Interactive Constellation */}
        <div className="relative max-w-4xl mx-auto py-8">
          {/* Main Core Stack */}
          <div className="flex flex-col items-center space-y-4 relative z-10">
            {/* G_true */}
            <div
              onClick={() => setSelectedGraphNode("g_true")}
              className={`w-full max-w-md bg-[#080800] border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${
                selectedGraphNode === "g_true"
                  ? "border-[#f2ca50] bg-[#141408]"
                  : "border-[rgba(242,202,80,0.25)] hover:border-[#f2ca50]"
              }`}
            >
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-bold italic text-[#f5f0e8]"
              >
                G_true
              </div>
              <div className="text-xs font-mono text-[#d4c49a] tracking-wider uppercase mt-0.5">
                Chronological In-World Reality
              </div>
            </div>

            {/* Traversal Arrow Up/Down */}
            <div className="flex flex-col items-center gap-1 py-1">
              <span className="h-6 w-0.5 bg-[#f2ca50]" />
              <div className="h-5 w-5 rounded-full bg-[#141408] border border-[#f2ca50] flex items-center justify-center text-[10px] text-[#f2ca50] font-mono">
                &updownarrow;
              </div>
              <span className="h-6 w-0.5 bg-[#f2ca50]" />
            </div>

            {/* Central Narrative Ledger */}
            <div
              onClick={() => setSelectedGraphNode("ledger")}
              className={`w-full max-w-lg bg-[#141408] border-2 rounded-2xl p-6 text-center cursor-pointer transition-all ${
                selectedGraphNode === "ledger"
                  ? "border-[#ffd966]"
                  : "border-[#f2ca50]"
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-[#ffd966] mb-1">
                <Sparkles className="h-4 w-4 text-[#ffd966]" />
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] tracking-[0.2em] uppercase font-bold"
                >
                  DETERMINISTIC TRAVERSAL
                </span>
              </div>
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl sm:text-3xl font-bold italic text-[#f5f0e8]"
              >
                Narrative Ledger
              </div>
              <div className="text-xs font-mono text-[#f2ca50] mt-1">
                Verified Payoff Protection &amp; Resolution Engine
              </div>
            </div>

            {/* Traversal Arrow Up/Down */}
            <div className="flex flex-col items-center gap-1 py-1">
              <span className="h-6 w-0.5 bg-[#f2ca50]" />
              <div className="h-5 w-5 rounded-full bg-[#141408] border border-[#f2ca50] flex items-center justify-center text-[10px] text-[#f2ca50] font-mono">
                &updownarrow;
              </div>
              <span className="h-6 w-0.5 bg-[#f2ca50]" />
            </div>

            {/* G_perceived */}
            <div
              onClick={() => setSelectedGraphNode("g_perceived")}
              className={`w-full max-w-md bg-[#080800] border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${
                selectedGraphNode === "g_perceived"
                  ? "border-[#f2ca50] bg-[#141408]"
                  : "border-[rgba(242,202,80,0.25)] hover:border-[#f2ca50]"
              }`}
            >
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-bold italic text-[#f5f0e8]"
              >
                G_perceived
              </div>
              <div className="text-xs font-mono text-[#d4c49a] tracking-wider uppercase mt-0.5">
                Audience Revelation Order
              </div>
            </div>
          </div>

          {/* Connected Satellite Nodes Grid */}
          <div className="pt-8">
            <div className="text-center mb-4">
              <span className="text-[10px] font-mono text-[#9a9280] uppercase tracking-widest">
                INTERACTIVE GRAPH TOPOLOGY PRIMITIVES (HOVER TO INSPECT)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {[
                { id: "obligations", label: "Obligations", count: "12 Active", color: "#f2ca50", desc: "Promises made needing payoffs" },
                { id: "payoffs", label: "Payoffs", count: "8 Verified", color: "#7ee08a", desc: "Downstream resolutions protecting twists" },
                { id: "contradictions", label: "Contradictions", count: "6 Detected", color: "#ff5c4d", desc: "Unpaid timeline ruptures" },
                { id: "characters", label: "Characters", count: "24 Tracked", color: "#ffd966", desc: "Entity states & vows" },
                { id: "claims", label: "Claims", count: "488 Nodes", color: "#d4c49a", desc: "Asserted facts across episodes" },
                { id: "citations", label: "Citations", count: "100% Grounded", color: "#7ee08a", desc: "Exact script excerpts" },
                { id: "episodes", label: "Episodes", count: "220 Total", color: "#f2ca50", desc: "Boundary index points" },
              ].map((node) => {
                const isHovered = hoveredGraphNode === node.id;
                const isSelected = selectedGraphNode === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onMouseEnter={() => setHoveredGraphNode(node.id)}
                    onMouseLeave={() => setHoveredGraphNode(null)}
                    onClick={() => setSelectedGraphNode(node.id)}
                    style={{
                      borderColor: isHovered || isSelected ? node.color : "rgba(242, 202, 80, 0.2)",
                    }}
                    className={`bg-[#080800] p-3 rounded-xl border text-center transition-all ${
                      isHovered || isSelected ? "bg-[#141408] border-[#f2ca50]" : "hover:bg-[#141408]"
                    }`}
                  >
                    <span
                      style={{ fontFamily: "var(--font-mono)", color: node.color }}
                      className="text-[11px] font-bold block truncate"
                    >
                      {node.label}
                    </span>
                    <span className="text-[10px] font-mono text-[#9a9280] block mt-0.5">
                      {node.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Node Inspector Callout */}
            {selectedGraphNode && (
              <div className="mt-4 p-4 rounded-xl bg-[#080800] border border-[rgba(242,202,80,0.3)] text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-[#f2ca50]" />
                  <span className="text-[#f2ca50] font-bold uppercase">
                    INSPECTING: {selectedGraphNode.toUpperCase()}
                  </span>
                  <span className="text-[#9a9280] hidden sm:inline">•</span>
                  <span className="text-[#d4c49a]">
                    {selectedGraphNode === "ledger" && "Unified Ledger: Resolves 220 episodes deterministically in < 12ms."}
                    {selectedGraphNode === "g_true" && "Story Timeline: Ground-truth chronology indexing world states."}
                    {selectedGraphNode === "g_perceived" && "Perceived Timeline: Strict boundary enforcement ignoring future episodes."}
                    {selectedGraphNode === "obligations" && "12 Open Obligations tracked across 4 narrative arcs."}
                    {selectedGraphNode === "payoffs" && "8 Payoffs verified with bipartite matching against the manifest."}
                    {selectedGraphNode === "contradictions" && "6 Contradictions surfaced with verbatim script citations."}
                    {selectedGraphNode === "characters" && "24 Characters with state mutation logs across 220 episodes."}
                    {selectedGraphNode === "claims" && "488 Extracted factual claims stored in the relational ledger."}
                    {selectedGraphNode === "citations" && "Every single finding has an immutable text citation."}
                    {selectedGraphNode === "episodes" && "220 Serialized episodes of 'The Last Monsoon'."}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedGraphNode(null)}
                  className="text-[#9a9280] hover:text-[#f5f0e8] text-[10px] uppercase font-mono"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── REPAIR NODE MODAL ────────────────────────────────────────────── */}
      {repairModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080800]/85 flex items-center justify-center p-4">
          <div className="bg-[#0d0d08] border border-[rgba(242,202,80,0.4)] rounded-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2 text-[#f2ca50]">
                <Wrench className="h-5 w-5" />
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-xl font-semibold italic text-[#f5f0e8]"
                >
                  Surgical Repair Counterfactual
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRepairModalOpen(false)}
                className="text-[#9a9280] hover:text-[#f5f0e8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="text-[#9a9280]">
                Proposed Rewrite for Episode 199 Scene 2 (Aligns claim with Ep 47 plant):
              </div>

              <div className="p-3.5 bg-[#080800] rounded-xl border border-[rgba(255,92,77,0.35)] text-[#ff5c4d] space-y-1">
                <span className="text-[10px] uppercase font-bold block">BEFORE (BROKEN CLAIM):</span>
                <p className="italic">“The Archive Vault has stayed sealed for three hundred years without a single breach.”</p>
              </div>

              <div className="p-3.5 bg-[#141408] rounded-xl border border-[rgba(126,224,138,0.4)] text-[#7ee08a] space-y-1">
                <span className="text-[10px] uppercase font-bold block">AFTER (SURGICAL REWRITE):</span>
                <p className="italic">“We know Elena breached the outer seal months ago, but what she brought out has never been cataloged.”</p>
              </div>

              <div className="p-3 bg-[#141408] rounded-lg border border-[rgba(242,202,80,0.2)] flex items-center justify-between text-xs">
                <span className="text-[#d4c49a]">Retention Impact:</span>
                <span className="text-[#ffd966] font-bold">+17% Continuation Lift (61% &rarr; 78%)</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRepairModalOpen(false)}
                className="ghost-button px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setRepaired(true);
                  setRepairModalOpen(false);
                }}
                className="gold-button px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Apply Surgical Rewrite</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HANDOFF SHEET MODAL ──────────────────────────────────────────── */}
      {handoffModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080800]/85 flex items-center justify-center p-4">
          <div className="bg-[#0d0d08] border border-[rgba(242,202,80,0.4)] rounded-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2 text-[#f2ca50]">
                <FileCheck className="h-5 w-5" />
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-xl font-semibold italic text-[#f5f0e8]"
                >
                  CanonPulse Writer Handoff Sheet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHandoffModalOpen(false)}
                className="text-[#9a9280] hover:text-[#f5f0e8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.2)] font-mono text-xs space-y-3 max-h-96 overflow-y-auto">
              <div className="border-b border-[rgba(242,202,80,0.15)] pb-2 text-[#f2ca50] font-bold">
                CANON BRIEFING: EPISODE 304 &rarr; 305 TRANSFER
              </div>
              <p className="text-[#9a9280]">Prepared for: Writer B &bull; Generated from live Graph Ledger state.</p>

              <div className="space-y-2 text-[#d4c49a]">
                <div className="font-bold text-[#f5f0e8]">1. MANDATORY DISCHARGES:</div>
                <p>&bull; [Ep 218] Elena&apos;s vow regarding the silver seal must be acknowledged in Ep 305.</p>
                <p>&bull; [Ep 277] Missing witness Ren holds the counterfeit ledgers.</p>

                <div className="font-bold text-[#f5f0e8] pt-2">2. CHARACTER INVARIANTS:</div>
                <p>&bull; Character C collarbone is fractured (no two-handed sword combat).</p>
                <p>&bull; Tara cannot swim (Ep 3 plant confirmed).</p>

                <div className="font-bold text-[#f5f0e8] pt-2">3. ACTIVE TWISTS (DO NOT BREAK):</div>
                <p>&bull; [Ep 3 &rarr; 60] Kael&apos;s dual identity is protected until the season finale (Ep 320).</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setHandoffModalOpen(false)}
                className="gold-button px-5 py-2 rounded-lg text-xs font-semibold"
              >
                Export PDF / Copy Briefing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOCALIZATION GRAPH DIFFERENCE MODAL ──────────────────────────── */}
      {diffModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080800]/85 flex items-center justify-center p-4">
          <div className="bg-[#0d0d08] border border-[rgba(242,202,80,0.4)] rounded-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2 text-[#ff5c4d]">
                <Languages className="h-5 w-5" />
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-xl font-semibold italic text-[#f5f0e8]"
                >
                  Translation Graph Entity Diff
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDiffModalOpen(false)}
                className="text-[#9a9280] hover:text-[#f5f0e8]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(255,92,77,0.3)] font-mono text-xs space-y-3">
              <div className="text-[#ff5c4d] font-bold">CONFLICT TRACE: ENTITY #418 PROPERTY MISMATCH</div>
              <p className="text-[#9a9280]">
                In the canonical English scripture (Ep 84), the weapon is forged from &quot;star-iron&quot; (hierro estelar). The Spanish localized script translated this as &quot;hierro oscuro&quot; (dark-iron), which collides with the antagonistic dark-iron faction introduced in Episode 112.
              </p>
              <div className="p-3 bg-[#141408] rounded border border-[rgba(126,224,138,0.3)] text-[#7ee08a]">
                <strong>Suggested Correction:</strong> Update ES draft line 42 to: &quot;La espada est&aacute; forjada con hierro estelar.&quot;
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDiffModalOpen(false)}
                className="gold-button px-5 py-2 rounded-lg text-xs font-semibold"
              >
                Send Correction to Translators
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
