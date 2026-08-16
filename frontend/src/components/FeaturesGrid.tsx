"use client";

import React, { useState } from "react";
import {
  Cpu,
  FileCheck2,
  ClipboardList,
  AlertTriangle,
  Languages,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Layers,
  Zap,
  Bookmark,
  ChevronRight,
  Activity,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface FeaturesGridProps {
  onOpenSurfaces?: () => void;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({ onOpenSurfaces }) => {
  const [activeSurface, setActiveSurface] = useState<number>(0);
  const [memoryQuery, setMemoryQuery] = useState("What did we plant in Ep 47 about the locket?");
  const [memorySearched, setMemorySearched] = useState(false);

  const surfaces = [
    {
      id: "series-memory",
      num: "01",
      title: "Series Memory",
      persona: "Writer / Showrunner",
      icon: Cpu,
      tagline: "Persistent Citation-Backed Narrative Index",
      color: "#f2ca50",
      accentBg: "rgba(242, 202, 80, 0.12)",
      borderColor: "border-[rgba(242,202,80,0.3)]",
      activeBorder: "border-[#f2ca50]",
      summary:
        'Instant answers to questions like "What did we plant in Ep 47?" with timeline horizon semantics, eliminating forgotten lore across 300+ episodes without spoilers.',
    },
    {
      id: "pre-publish",
      num: "02",
      title: "Pre-Publish Check",
      persona: "Writer",
      icon: FileCheck2,
      tagline: "Twist vs. Plot Hole Discrimination & ΔRetention",
      color: "#7ee08a",
      accentBg: "rgba(126, 224, 138, 0.12)",
      borderColor: "border-[rgba(126,224,138,0.3)]",
      activeBorder: "border-[#7ee08a]",
      summary:
        "Pre-release sidebar that extracts candidate draft text, distinguishes intentional non-linear twists from accidental plot holes, and computes live audience retention deltas.",
    },
    {
      id: "writer-handoff",
      num: "03",
      title: "Writer Handoff Sheet",
      persona: "Multi-Writer Team",
      icon: ClipboardList,
      tagline: "Zero-Leak Episode Boundary Transition Audit",
      color: "#ffb347",
      accentBg: "rgba(255, 179, 71, 0.12)",
      borderColor: "border-[rgba(255,179,71,0.3)]",
      activeBorder: "border-[#ffb347]",
      summary:
        "Automated transition audit detailing all open, overdue, and inherited obligations when writer teams rotate between episodes mid-season.",
    },
    {
      id: "debt-board",
      num: "04",
      title: "Showrunner Debt Board",
      persona: "Studio Executive",
      icon: AlertTriangle,
      tagline: "Portfolio Narrative Debt Index (NDI) Tracker",
      color: "#ff5c4d",
      accentBg: "rgba(255, 92, 77, 0.12)",
      borderColor: "border-[rgba(255,92,77,0.3)]",
      activeBorder: "border-[#ff5c4d]",
      summary:
        "Portfolio-level executive dashboard calculating the Narrative Debt Index (NDI) across multiple running series to forecast subscriber churn risk.",
    },
    {
      id: "localization",
      num: "05",
      title: "Localization Check",
      persona: "Localization Team",
      icon: Languages,
      tagline: "Cross-Language 1:1 Story Parity Validator",
      color: "#b388ff",
      accentBg: "rgba(179, 136, 255, 0.12)",
      borderColor: "border-[rgba(179,136,255,0.3)]",
      activeBorder: "border-[#b388ff]",
      summary:
        "Language-agnostic graph validator ensuring translated scripts (Hindi, Spanish, Japanese, etc.) maintain 1:1 edge alignment, entity parity, and factual continuity.",
    },
  ];

  const current = surfaces[activeSurface];

  return (
    <section
      id="features"
      className="section-glow relative py-32 border-b border-[rgba(242,202,80,0.12)] bg-[#070703] overflow-hidden"
    >
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(242,202,80,0.06)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[400px] bg-[radial-gradient(circle,rgba(126,224,138,0.04)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-16">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(242,202,80,0.3)] bg-[rgba(242,202,80,0.08)] shadow-[0_0_20px_rgba(242,202,80,0.15)]">
              <Sparkles className="h-3.5 w-3.5 text-[#f2ca50] animate-pulse" />
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[11px] font-semibold tracking-[0.25em] text-[#f2ca50] uppercase"
              >
                THE 5 UNIFIED PRODUCT SURFACES
              </span>
            </div>

            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Five Essential Views.
              <br />
              <span className="italic text-[#f2ca50]">One Dual-Layer Graph Ledger.</span>
            </h2>

            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-base sm:text-lg text-[#9a9280] italic max-w-2xl mx-auto"
            >
              Every role in production interacts with the exact same verified story ledger—tailored into five purpose-built visual workstations.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Studio Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Surface Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 px-1">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase font-semibold tracking-wider text-[#9a9280] flex items-center gap-1.5"
              >
                <Layers className="h-3.5 w-3.5 text-[#f2ca50]" />
                Select Production Surface
              </span>
              <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#f2ca50]/80">
                Interactive Studio
              </span>
            </div>

            {surfaces.map((surface, idx) => {
              const Icon = surface.icon;
              const isActive = activeSurface === idx;

              return (
                <button
                  key={surface.id}
                  onClick={() => setActiveSurface(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 group relative overflow-hidden ${
                    isActive
                      ? `bg-[#141408] ${surface.borderColor} shadow-[0_0_30px_${surface.accentBg}]`
                      : "bg-[#0d0d08]/60 border-[rgba(242,202,80,0.08)] hover:bg-[#121208] hover:border-[rgba(242,202,80,0.2)]"
                  }`}
                >
                  {/* Left accent bar on active */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                      style={{ backgroundColor: surface.color }}
                    />
                  )}

                  {/* Icon Box */}
                  <div
                    className="p-3 rounded-xl border flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: isActive ? surface.accentBg : "#080800",
                      borderColor: isActive ? surface.color : "rgba(242,202,80,0.15)",
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: surface.color }} />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        style={{ fontFamily: "var(--font-mono)", color: surface.color }}
                        className="text-[11px] font-bold tracking-wider uppercase"
                      >
                        {surface.num} • {surface.persona}
                      </span>
                      {isActive && (
                        <span className="flex h-2 w-2 relative">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ backgroundColor: surface.color }}
                          />
                          <span
                            className="relative inline-flex rounded-full h-2 w-2"
                            style={{ backgroundColor: surface.color }}
                          />
                        </span>
                      )}
                    </div>

                    <h3
                      style={{ fontFamily: "var(--font-display)" }}
                      className={`text-lg sm:text-xl font-semibold transition-colors ${
                        isActive ? "text-[#f5f0e8] italic" : "text-[#d4c49a] group-hover:text-[#f5f0e8]"
                      }`}
                    >
                      {surface.title}
                    </h3>

                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-xs text-[#9a9280] line-clamp-2 mt-1 italic"
                    >
                      {surface.tagline}
                    </p>
                  </div>

                  <ChevronRight
                    className={`h-4 w-4 mt-3 flex-shrink-0 transition-transform ${
                      isActive ? "translate-x-1 opacity-100" : "opacity-30 group-hover:opacity-70"
                    }`}
                    style={{ color: surface.color }}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Holographic Interactive Live Stage (7 cols) */}
          <div className="lg:col-span-7">
            <div
              className="glass-panel p-6 sm:p-8 rounded-3xl border relative space-y-6 shadow-2xl transition-all duration-500"
              style={{
                borderColor: current.color + "50",
                boxShadow: `0 0 50px ${current.accentBg}, inset 0 0 30px ${current.accentBg}`,
              }}
            >
              {/* Header inside stage */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(242,202,80,0.12)] pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl border"
                    style={{
                      backgroundColor: current.accentBg,
                      borderColor: current.color + "60",
                    }}
                  >
                    <current.icon className="h-6 w-6" style={{ color: current.color }} />
                  </div>
                  <div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: current.color,
                        backgroundColor: current.accentBg,
                      }}
                      className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-current/20 inline-block mb-1"
                    >
                      {current.persona}
                    </span>
                    <h3
                      style={{ fontFamily: "var(--font-display)" }}
                      className="text-2xl sm:text-3xl font-semibold italic text-[#f5f0e8]"
                    >
                      {current.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280] font-semibold">
                    SURFACE {current.num}/05
                  </span>
                </div>
              </div>

              {/* Surface Summary Description */}
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-sm text-[#d4c49a] leading-relaxed italic"
              >
                {current.summary}
              </p>

              {/* DYNAMIC LIVE INTERACTIVE MOCK STAGE PER SURFACE */}

              {/* Surface 1: Series Memory Live Stage */}
              {activeSurface === 0 && (
                <div className="space-y-4 bg-[#080800] p-5 rounded-2xl border border-[rgba(242,202,80,0.2)]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#f2ca50]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Search className="h-3.5 w-3.5" /> LIVE HORIZON SEARCH
                    </span>
                    <span className="text-[#9a9280]">Horizon: Ep 312</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={memoryQuery}
                      onChange={(e) => setMemoryQuery(e.target.value)}
                      className="flex-1 bg-[#141408] border border-[rgba(242,202,80,0.3)] rounded-xl px-4 py-2.5 text-xs text-[#f5f0e8] focus:outline-none focus:border-[#f2ca50] font-mono"
                    />
                    <button
                      onClick={() => setMemorySearched(true)}
                      className="gold-button px-4 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      Query Ledger
                    </button>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="bg-[#121206] p-3.5 rounded-xl border border-[rgba(242,202,80,0.25)] space-y-1 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-[#f2ca50] font-bold flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Finding: Promise Planted @ Ep 47 (Scene 2)
                        </span>
                        <span className="text-[#7ee08a] bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          Payoff Intact (Ep 84)
                        </span>
                      </div>
                      <p style={{ fontFamily: "var(--font-body)" }} className="text-[#f5f0e8] italic pt-1">
                        &ldquo;Asha finds Vikram&apos;s silver locket hidden inside the Konkan radio console, swearing never to open the clasp until the monsoon ends.&rdquo;
                      </p>
                      <span className="text-[10px] font-mono text-[#9a9280] block pt-1">
                        Citation: `ex-047-radio-console` • Timeline Verified: `true`
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Surface 2: Pre-Publish Check Live Stage */}
              {activeSurface === 1 && (
                <div className="space-y-4 bg-[#080800] p-5 rounded-2xl border border-[rgba(126,224,138,0.25)]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#7ee08a] font-bold flex items-center gap-1.5">
                      <FileCheck2 className="h-3.5 w-3.5" /> DRAFT VALIDATOR (EPISODE 221)
                    </span>
                    <span className="text-[#7ee08a] font-bold bg-[rgba(126,224,138,0.15)] px-2.5 py-0.5 rounded-full">
                      ✓ Zero Fatal Holes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-[#0e1710] p-3.5 rounded-xl border border-[rgba(126,224,138,0.3)] space-y-1">
                      <span className="text-[#7ee08a] font-bold block text-[10px] uppercase">
                        [✓ PROTECTED TWIST]
                      </span>
                      <p className="text-[#f5f0e8] text-[11px] italic">
                        Contradiction in Ep 60 resolved by secret diving lessons revealed in Ep 221.
                      </p>
                    </div>

                    <div className="bg-[#17140e] p-3.5 rounded-xl border border-[rgba(255,179,71,0.3)] space-y-1">
                      <span className="text-[#ffb347] font-bold block text-[10px] uppercase">
                        [⚡ RETENTION MOVEMENT]
                      </span>
                      <p className="text-[#f5f0e8] text-sm font-bold text-[#7ee08a]">
                        +4.8% Predicted Lift
                      </p>
                      <span className="text-[10px] text-[#9a9280]">
                        Closing overdue thread boosts completion rate.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0d140e] rounded-xl border border-[rgba(126,224,138,0.2)] flex items-center justify-between text-xs">
                    <span className="text-[#9a9280] font-mono">Pre-Publish Verdict:</span>
                    <span className="text-[#7ee08a] font-bold font-mono">READY TO LOCK SCRIPT</span>
                  </div>
                </div>
              )}

              {/* Surface 3: Writer Handoff Sheet Live Stage */}
              {activeSurface === 2 && (
                <div className="space-y-4 bg-[#080800] p-5 rounded-2xl border border-[rgba(255,179,71,0.25)]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#ffb347] font-bold flex items-center gap-1.5">
                      <ClipboardList className="h-3.5 w-3.5" /> ROTATING WRITERS ROOM AUDIT
                    </span>
                    <span className="text-[#f5f0e8] bg-[rgba(255,179,71,0.15)] px-2.5 py-0.5 rounded-full font-bold">
                      Handoff: Ep 120 → 121
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="bg-[#141008] p-3 rounded-xl border border-[rgba(255,179,71,0.2)] flex items-center justify-between">
                      <div>
                        <span className="text-[#f5f0e8] font-bold block">Inherited Loop: The Brass Key</span>
                        <span className="text-[10px] text-[#9a9280]">Authored by Writer #1 in Ep 12 • Priority: Critical</span>
                      </div>
                      <span className="text-[#ff5c4d] bg-[rgba(255,92,77,0.15)] px-2 py-0.5 rounded font-bold text-[10px]">
                        2 EPS OVERDUE
                      </span>
                    </div>

                    <div className="bg-[#141008] p-3 rounded-xl border border-[rgba(255,179,71,0.2)] flex items-center justify-between">
                      <div>
                        <span className="text-[#f5f0e8] font-bold block">Action Required: Discharge Vow</span>
                        <span className="text-[10px] text-[#9a9280]">Payoff must occur before Mid-Season Finale (Ep 125)</span>
                      </div>
                      <span className="text-[#7ee08a] bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded font-bold text-[10px]">
                        RESOLVE NEXT
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Surface 4: Showrunner Debt Board Live Stage */}
              {activeSurface === 3 && (
                <div className="space-y-4 bg-[#080800] p-5 rounded-2xl border border-[rgba(255,92,77,0.25)]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#ff5c4d] font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> PORTFOLIO NARRATIVE DEBT (NDI)
                    </span>
                    <span className="text-[#ff5c4d] bg-[rgba(255,92,77,0.15)] px-2.5 py-0.5 rounded-full font-bold">
                      NDI Score: 2.14 / 5.0
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
                    <div className="bg-[#140808] p-3 rounded-xl border border-[rgba(255,92,77,0.2)]">
                      <span className="text-[#9a9280] text-[10px] block">TOTAL OPEN THREADS</span>
                      <span className="text-xl font-bold text-[#f5f0e8]">14</span>
                    </div>
                    <div className="bg-[#140808] p-3 rounded-xl border border-[rgba(255,92,77,0.2)]">
                      <span className="text-[#9a9280] text-[10px] block">OVERDUE RISKS</span>
                      <span className="text-xl font-bold text-[#ff5c4d]">3</span>
                    </div>
                    <div className="bg-[#140808] p-3 rounded-xl border border-[rgba(255,92,77,0.2)]">
                      <span className="text-[#9a9280] text-[10px] block">SUBSCRIBER CHURN RISK</span>
                      <span className="text-xl font-bold text-[#ffb347]">Low-Mod</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#140a0a] rounded-xl border border-[rgba(255,92,77,0.2)] text-xs font-mono flex items-center justify-between">
                    <span className="text-[#9a9280]">Highest Risk Series:</span>
                    <span className="text-[#f5f0e8] font-bold">The Last Monsoon (Mumbai Thriller)</span>
                  </div>
                </div>
              )}

              {/* Surface 5: Localization Check Live Stage */}
              {activeSurface === 4 && (
                <div className="space-y-4 bg-[#080800] p-5 rounded-2xl border border-[rgba(179,136,255,0.25)]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#b388ff] font-bold flex items-center gap-1.5">
                      <Languages className="h-3.5 w-3.5" /> BILINGUAL GRAPH PARITY VALIDATOR
                    </span>
                    <span className="text-[#b388ff] bg-[rgba(179,136,255,0.15)] px-2.5 py-0.5 rounded-full font-bold">
                      EN &rarr; ES / HI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-[#0f0c17] p-3.5 rounded-xl border border-[rgba(179,136,255,0.2)] space-y-1">
                      <span className="text-[#9a9280] text-[10px] uppercase font-bold block">
                        Canonical Source (EN)
                      </span>
                      <p className="text-[#f5f0e8] italic text-[11px]">
                        &ldquo;Vikram waited 10 years at the Konkan dock.&rdquo;
                      </p>
                      <span className="text-[10px] text-[#7ee08a] block pt-1">
                        Fact: `10 years` • Entity: `Vikram`
                      </span>
                    </div>

                    <div className="bg-[#170e10] p-3.5 rounded-xl border border-[rgba(255,92,77,0.3)] space-y-1">
                      <span className="text-[#ff5c4d] text-[10px] uppercase font-bold block flex items-center justify-between">
                        <span>Translation (ES)</span>
                        <ShieldAlert className="h-3.5 w-3.5 text-[#ff5c4d]" />
                      </span>
                      <p className="text-[#f5f0e8] italic text-[11px]">
                        &ldquo;Vikram esperó 100 días en el muelle.&rdquo;
                      </p>
                      <span className="text-[10px] text-[#ff5c4d] font-bold block pt-1">
                        [!] NUMERIC DRIFT: &apos;100 days&apos; ≠ &apos;10 years&apos;
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Interactive CTA bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[rgba(242,202,80,0.12)]">
                <div className="flex items-center gap-2 text-xs text-[#9a9280] font-mono">
                  <Activity className="h-3.5 w-3.5 text-[#7ee08a]" />
                  <span>Powered by deterministic ledger traversal in `app/surfaces.py`</span>
                </div>

                {onOpenSurfaces && (
                  <button
                    onClick={onOpenSurfaces}
                    className="gold-button px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 group"
                  >
                    <span>Launch {current.title} in Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
