"use client";

import React, { useState } from "react";
import { Cpu, ClipboardList, AlertTriangle, Languages, TrendingUp, Compass, Search, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export const WriterSurfacesView: React.FC = () => {
  const [memoryQuery, setMemoryQuery] = useState("When did Character A learn about Object B?");
  const [memoryResult, setMemoryResult] = useState<string | null>(
    "Ep 47, Scene 2: Character A discovers the starlight scroll in the Archive Vault, confirming Object B's origin."
  );
  const [vibeQuery, setVibeQuery] = useState("Scenes feeling like isolation");
  const [vibeResult, setVibeResult] = useState<{ ep: string; scene: string; text: string; explanation: string } | null>({
    ep: "Ep 102",
    scene: "Scene 4",
    text: "Character stands alone in the vast server room.",
    explanation: "High semantic alignment (0.94 cosine similarity) with thematic motif 'solitude' and minimal dialogue density.",
  });
  const [showExplainModal, setShowExplainModal] = useState(false);

  const handleMemorySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryQuery.trim()) return;
    setMemoryResult(
      `Ledger Search Result for "${memoryQuery}": Planted in Ep 12 (Scene 1) and reaffirmed in Ep 84. Payoff link intact.`
    );
  };

  const handleVibeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibeQuery.trim()) return;
    setVibeResult({
      ep: "Ep 154",
      scene: "Scene 2",
      text: "Rain falls against the empty observatory glass as shadow figures pass.",
      explanation: "Matches atmospheric isolation query based on environmental descriptors and acoustic subtext.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-[rgba(242,202,80,0.12)] pb-4">
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-3xl font-semibold italic text-[#f5f0e8]"
        >
          Writer Surfaces
        </h1>
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-sm text-[#9a9280] italic mt-1"
        >
          Active Workspace &amp; Obligation Tracking across 5 writer room tools.
        </p>
      </div>

      {/* Grid Layout matching reference screenshots 3, 4, 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Series Memory (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-[rgba(242,202,80,0.2)] space-y-4">
          <div className="flex items-center gap-2.5 text-[#f2ca50]">
            <Cpu className="h-5 w-5" />
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-semibold italic text-[#f5f0e8]"
            >
              Series Memory
            </h2>
          </div>

          <form onSubmit={handleMemorySearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={memoryQuery}
                onChange={(e) => setMemoryQuery(e.target.value)}
                placeholder="Ask the ledger (e.g., 'When did Character A learn about Object B?')"
                style={{ fontFamily: "var(--font-body)" }}
                className="w-full bg-[#080800] border border-[rgba(242,202,80,0.25)] rounded-xl px-4 py-3 text-xs text-[#f5f0e8] placeholder-[#9a9280]/60 focus:outline-none focus:border-[#f2ca50] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 gold-button px-4 py-1.5 rounded-lg text-xs font-semibold"
              >
                Query
              </button>
            </div>
          </form>

          {memoryResult && (
            <div className="bg-[#141408] p-4 rounded-xl border border-[rgba(242,202,80,0.15)] text-xs font-mono space-y-1">
              <span className="text-[#f2ca50] font-bold block flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Ledger Citation Verified
              </span>
              <p className="text-[#d4c49a] leading-relaxed italic">{memoryResult}</p>
            </div>
          )}
        </div>

        {/* Card 2: Handoff Sheet (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-[rgba(242,202,80,0.2)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#7ee08a]">
              <ClipboardList className="h-5 w-5" />
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-semibold italic text-[#f5f0e8]"
              >
                Handoff Sheet
              </h2>
            </div>
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280]">
              Ep. 304 &rarr; 305
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.1)]">
              <span className="text-[#f5f0e8]">Open Loop: The Vault</span>
              <span className="text-[#ff5c4d] bg-[rgba(255,92,77,0.15)] px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                Required
              </span>
            </div>
            <div className="flex justify-between items-center bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.1)]">
              <span className="text-[#f5f0e8]">Character C Injury</span>
              <span className="text-[#ffb347] bg-[rgba(255,179,71,0.15)] px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                Track
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Debt Board (4 cols) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border border-[rgba(255,92,77,0.2)] text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-[#ff5c4d]">
            <AlertTriangle className="h-5 w-5" />
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-semibold italic text-[#f5f0e8]"
            >
              Debt Board
            </h2>
          </div>

          <div>
            <p
              style={{ fontFamily: "var(--font-display)" }}
              className="text-6xl font-bold text-[#ff5c4d] my-1 drop-shadow-[0_0_25px_rgba(255,92,77,0.3)]"
            >
              14
            </p>
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280] uppercase tracking-wider">
              Unresolved Threads
            </p>
          </div>
        </div>

        {/* Card 4: Localization Continuity (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-[rgba(242,202,80,0.2)] space-y-4">
          <div className="flex items-center gap-2 text-[#f2ca50]">
            <Languages className="h-5 w-5" />
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-semibold italic text-[#f5f0e8]"
            >
              Localization Continuity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Box 1: Source Fact EN */}
            <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.15)] space-y-1">
              <span className="text-[#9a9280] text-[10px] uppercase font-bold block">Source Fact (EN)</span>
              <p className="text-[#f5f0e8] italic">&ldquo;The sword is made of star-iron.&rdquo;</p>
            </div>

            {/* Box 2: Translation ES with Conflict Alert */}
            <div className="bg-[rgba(255,92,77,0.06)] p-4 rounded-xl border border-[rgba(255,92,77,0.3)] space-y-2">
              <span className="text-[#ff5c4d] text-[10px] uppercase font-bold block flex items-center justify-between">
                <span>Translation (ES)</span>
                <ShieldAlert className="h-3.5 w-3.5 text-[#ff5c4d]" />
              </span>
              <p className="text-[#f5f0e8] italic">&ldquo;La espada es de hierro oscuro.&rdquo;</p>
              <div className="text-[10px] text-[#ff5c4d] font-bold border-t border-[rgba(255,92,77,0.2)] pt-1.5">
                [!] CONFLICT: &apos;Dark-iron&apos; contradicts &apos;Star-iron&apos; properties.
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Audience Cohorts Waveform Chart (12 cols) */}
        <div className="lg:col-span-12 glass-panel rounded-2xl p-6 border border-[rgba(242,202,80,0.2)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(242,202,80,0.1)] pb-3">
            <div className="flex items-center gap-2 text-[#7ee08a]">
              <TrendingUp className="h-5 w-5" />
              <h2
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-semibold italic text-[#f5f0e8]"
              >
                Audience Cohorts
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-[#9a9280]">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#7ee08a]" /> Core Fans</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f2ca50]" /> Casuals</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ffb347]" /> Shippers</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ff5c4d]" /> Lore Theorists</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#a6a297]" /> Critics</span>
            </div>
          </div>

          {/* SVG Waveform Chart */}
          <div className="relative h-44 w-full bg-[#080800] rounded-xl border border-[rgba(242,202,80,0.1)] overflow-hidden p-4 flex items-center">
            <svg className="w-full h-full fill-none">
              {/* Wave 1: Core Fans (Green) */}
              <path d="M 0 110 Q 150 40 300 90 T 600 60 T 900 110 T 1200 50" stroke="#7ee08a" strokeWidth="2.5" />
              {/* Wave 2: Casuals (Gold) */}
              <path d="M 0 90 Q 200 130 400 70 T 800 100 T 1200 80" stroke="#f2ca50" strokeWidth="2" opacity="0.9" />
              {/* Wave 3: Shippers (Amber) */}
              <path d="M 0 70 Q 180 110 360 60 T 720 120 T 1200 90" stroke="#ffb347" strokeWidth="2" opacity="0.8" />
              {/* Wave 4: Lore Theorists (Red) */}
              <path d="M 0 130 Q 220 70 440 120 T 880 50 T 1200 110" stroke="#ff5c4d" strokeWidth="2" opacity="0.75" />
            </svg>
          </div>
        </div>

        {/* Card 6: Discovery Mood Search (12 cols) */}
        <div className="lg:col-span-12 glass-panel-gold rounded-2xl p-6 border border-[rgba(242,202,80,0.3)] space-y-4">
          <div className="flex items-center gap-2 text-[#f2ca50]">
            <Compass className="h-5 w-5" />
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-xl font-semibold italic text-[#f5f0e8]"
            >
              Discovery / Mood Search
            </h2>
          </div>

          <form onSubmit={handleVibeSearch} className="flex gap-3">
            <input
              type="text"
              value={vibeQuery}
              onChange={(e) => setVibeQuery(e.target.value)}
              placeholder="Mood/Vibe search (e.g., 'Scenes feeling like isolation')"
              style={{ fontFamily: "var(--font-body)" }}
              className="flex-1 bg-[#080800] border border-[rgba(242,202,80,0.25)] rounded-xl px-4 py-3 text-xs text-[#f5f0e8] placeholder-[#9a9280]/60 focus:outline-none focus:border-[#f2ca50]"
            />
            <button type="submit" className="gold-button px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span>Search</span>
              <Search className="h-3.5 w-3.5" />
            </button>
          </form>

          {vibeResult && (
            <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.15)] space-y-2 text-xs">
              <span style={{ fontFamily: "var(--font-mono)" }} className="text-[#f2ca50] font-bold block">
                Result: {vibeResult.ep}, {vibeResult.scene}
              </span>
              <p style={{ fontFamily: "var(--font-body)" }} className="text-[#f5f0e8] italic">
                &ldquo;{vibeResult.text}&rdquo;
              </p>
              <button
                onClick={() => setShowExplainModal(true)}
                className="text-[#7ee08a] font-mono hover:underline flex items-center gap-1 pt-1"
              >
                Explain why &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for "Explain Why" */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080800]/85 backdrop-blur-md">
          <div className="glass-panel-hero max-w-md w-full p-6 rounded-2xl border border-[rgba(242,202,80,0.4)] space-y-4">
            <div className="flex items-center gap-2 text-[#7ee08a] font-mono text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>SEMANTIC ATTRIBUTION EXPLANATION</span>
            </div>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#f5f0e8] italic leading-relaxed">
              {vibeResult?.explanation}
            </p>
            <button
              onClick={() => setShowExplainModal(false)}
              className="gold-button w-full py-2.5 rounded text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
