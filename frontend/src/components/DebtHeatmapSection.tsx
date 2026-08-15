"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Sliders } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { MotionCard } from "./MotionCard";

interface ArcData {
  episode: number;
  arcName: string;
  debtScore: number;
  activePromises: number;
  status: "setup" | "growing" | "peak" | "unresolved" | "resolving";
  headline: string;
  description: string;
  payoffStatus: string;
}

export const DebtHeatmapSection: React.FC = () => {
  const [currentEp, setCurrentEp] = useState(84);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play scrubber animation loop
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentEp((prev) => (prev >= 220 ? 1 : prev + 1));
      }, 180);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  const getArcDetails = (ep: number): ArcData => {
    if (ep <= 45) {
      return {
        episode: ep,
        arcName: "Arc 1: World Building & Setup",
        debtScore: Math.round(15 + (ep / 45) * 20),
        activePromises: Math.round(4 + (ep / 45) * 12),
        status: "setup",
        headline: "Initial Promises Planted",
        description: "Characters and lore contracts established. Reader mystery tolerance is high.",
        payoffStatus: "Normal Promise Growth",
      };
    } else if (ep <= 90) {
      return {
        episode: ep,
        arcName: "Arc 2: The Shattered Amulet",
        debtScore: Math.round(35 + ((ep - 45) / 45) * 35),
        activePromises: Math.round(16 + ((ep - 45) / 45) * 18),
        status: "unresolved",
        headline: ep === 84 ? "CRITICAL CONTRADICTION DETECTED" : "Growing Narrative Debt",
        description:
          ep === 84
            ? "Episode 84 asserts amulet destruction without downstream payoff link. Genuine plot hole."
            : "Setup frequency accelerates. Mystery accumulation requires payoff planning.",
        payoffStatus: ep === 84 ? "🔴 Unbacked Plot Hole" : "⚠️ Debt Accumulating",
      };
    } else if (ep <= 140) {
      return {
        episode: ep,
        arcName: "Arc 3: Peak Mystery & Complications",
        debtScore: Math.round(70 + ((ep - 90) / 50) * 25),
        activePromises: Math.round(34 + ((ep - 90) / 50) * 20),
        status: "peak",
        headline: "Peak Storyline Complexity",
        description: "54 active promises open simultaneously. High risk of reader frustration if unpaid.",
        payoffStatus: "🟠 High Debt Window",
      };
    } else if (ep <= 185) {
      return {
        episode: ep,
        arcName: "Arc 4: Divergent Threads & Handoffs",
        debtScore: Math.round(95 - ((ep - 140) / 45) * 30),
        activePromises: Math.round(54 - ((ep - 140) / 45) * 20),
        status: "growing",
        headline: "Early Climax Discharges",
        description: "Subplots begin resolving as main finale arcs converge.",
        payoffStatus: "🟡 Discharging Subplots",
      };
    } else {
      return {
        episode: ep,
        arcName: "Arc 5: Finale & Payoff Resolution",
        debtScore: Math.round(65 - ((ep - 185) / 35) * 45),
        activePromises: Math.round(34 - ((ep - 185) / 35) * 28),
        status: "resolving",
        headline: "Verified Payoff Convergence",
        description: "Episode 218 antidote setup resolves Ep 47 poison claim. Intentional twist protected.",
        payoffStatus: "🟢 Payoffs Discharged",
      };
    }
  };

  const currentArc = getArcDetails(currentEp);

  const getStatusBadge = (status: ArcData["status"]) => {
    switch (status) {
      case "unresolved":
        return { label: "REAL HOLE", bg: "bg-[rgba(255,92,77,0.15)]", text: "text-[#ff5c4d]", border: "border-[rgba(255,92,77,0.4)]" };
      case "peak":
        return { label: "PEAK DEBT", bg: "bg-[rgba(255,179,71,0.15)]", text: "text-[#ffb347]", border: "border-[rgba(255,179,71,0.4)]" };
      case "resolving":
        return { label: "RESOLVED", bg: "bg-[rgba(126,224,138,0.15)]", text: "text-[#7ee08a]", border: "border-[rgba(126,224,138,0.4)]" };
      case "growing":
        return { label: "DISCHARGING", bg: "bg-[rgba(242,202,80,0.15)]", text: "text-[#f2ca50]", border: "border-[rgba(242,202,80,0.4)]" };
      case "setup":
      default:
        return { label: "SETUP PHASE", bg: "bg-[rgba(242,202,80,0.1)]", text: "text-[#f5f0e8]", border: "border-[rgba(242,202,80,0.2)]" };
    }
  };

  const badge = getStatusBadge(currentArc.status);

  // Generate 22 interactive visual timeline bars representing 220 episodes
  const timelineBars = Array.from({ length: 22 }, (_, idx) => {
    const targetEp = (idx + 1) * 10;
    const arc = getArcDetails(targetEp);
    return {
      ep: targetEp,
      debt: arc.debtScore,
      status: arc.status,
    };
  });

  return (
    <section id="debt-timeline" className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.1)] bg-[#080800]/40 overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-[600px] h-[500px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.2)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-14">
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-[0.28em] text-[#f2ca50] uppercase">
              INTERACTIVE STORYLINE SCRUBBER
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Scrub the episode timeline.
              <br />
              <em className="italic text-[#d4c49a]">Track narrative debt live.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-base text-[#9a9280] italic">
              Drag the scrubber or click episode bars to inspect how promises accumulate and resolve live.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Interactive Scrubber Control Panel (Dampened 3D Tilt: tiltIntensity={0.25}) */}
        <ScrollReveal direction="up" delay={150}>
          <MotionCard glowColor="rgba(242, 202, 80, 0.25)" tiltIntensity={0.25}>
            <div className="glass-panel-gold rounded-2xl p-8 space-y-8">
              {/* Header Bar with Ep & Arc Title & Play/Pause Animation Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.15)] pb-6">
                <div>
                  <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#f2ca50] font-bold tracking-widest uppercase block mb-1">
                    {currentArc.arcName}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-semibold italic text-[#f5f0e8]">
                    Episode {currentEp} of 220
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {/* Play / Pause Auto-Scrub Button */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="gold-button px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(242,202,80,0.3)]"
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                    {isPlaying ? "PAUSE SIMULATION" : "PLAY TIMELINE"}
                  </button>

                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentEp(1);
                    }}
                    className="ghost-button p-2 rounded-lg text-[#9a9280] hover:text-[#f2ca50]"
                    title="Reset to Ep 1"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Interactive Visual Episode Bar Chart Matrix (Clickable Bars) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#9a9280]">
                  <span>INTERACTIVE DEBT SPECTRUM (CLICK ANY BAR)</span>
                  <span className="text-[#f2ca50]">EPISODE {currentEp} / 220</span>
                </div>

                <div className="flex items-end gap-1.5 h-20 p-2 rounded-xl bg-[#080800]/80 border border-[rgba(242,202,80,0.12)] overflow-hidden">
                  {timelineBars.map((bar) => {
                    const isActive = Math.abs(currentEp - bar.ep) < 6;
                    const isPassed = currentEp >= bar.ep;
                    let barColor = "bg-[rgba(242,202,80,0.5)]";
                    if (bar.status === "unresolved") barColor = "bg-[#ff5c4d]";
                    else if (bar.status === "peak") barColor = "bg-[#ffb347]";
                    else if (bar.status === "resolving") barColor = "bg-[#7ee08a]";

                    return (
                      <button
                        key={bar.ep}
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentEp(bar.ep);
                        }}
                        className={`flex-1 rounded-sm transition-all duration-200 relative group ${barColor} ${
                          isActive
                            ? "ring-2 ring-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.8)] scale-y-105 z-10"
                            : isPassed
                            ? "opacity-90 hover:opacity-100"
                            : "opacity-35 hover:opacity-75"
                        }`}
                        style={{ height: `${Math.max(bar.debt, 18)}%` }}
                        title={`Episode ${bar.ep}: Debt ${bar.debt}/100`}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                          <div className="bg-[#0d0d08] border border-[#f2ca50]/50 text-[#f5f0e8] text-[10px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap">
                            EP {bar.ep} — Debt: {bar.debt}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Episode Scrubber Range Slider & Milestone Buttons */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="220"
                    value={currentEp}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setCurrentEp(Number(e.target.value));
                    }}
                    className="w-full h-3 bg-[#080800] rounded-lg appearance-none cursor-pointer accent-[#f2ca50] border border-[rgba(242,202,80,0.3)] shadow-[0_0_15px_rgba(242,202,80,0.2)]"
                  />
                </div>

                {/* Quick Jump Milestones */}
                <div className="flex flex-wrap justify-between gap-2 pt-1">
                  {[
                    { ep: 1, label: "Ep 01: Setup" },
                    { ep: 47, label: "Ep 47: Poison Origin" },
                    { ep: 84, label: "Ep 84: Furnace Defect" },
                    { ep: 150, label: "Ep 150: Mystery Peak" },
                    { ep: 218, label: "Ep 218: Finale Payoff" },
                  ].map((m) => (
                    <button
                      key={m.ep}
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentEp(m.ep);
                      }}
                      style={{ fontFamily: "var(--font-mono)" }}
                      className={`px-3 py-1.5 rounded text-[11px] font-medium transition-all ${
                        currentEp === m.ep
                          ? "gold-button shadow-[0_0_15px_rgba(242,202,80,0.4)]"
                          : "ghost-button"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Metrics & Status Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[rgba(242,202,80,0.12)]">
                {/* Metric 1: Narrative Debt Score */}
                <div className="glass-panel p-5 rounded-xl space-y-1">
                  <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] uppercase tracking-wider">
                    Accumulated Debt Index
                  </p>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-semibold text-[#f2ca50]">
                    {currentArc.debtScore} <span className="text-sm font-normal text-[#9a9280] italic">/ 100</span>
                  </p>
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#9a9280] italic pt-1">
                    {currentArc.payoffStatus}
                  </p>
                </div>

                {/* Metric 2: Open Promises */}
                <div className="glass-panel p-5 rounded-xl space-y-1">
                  <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] uppercase tracking-wider">
                    Active Open Promises
                  </p>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-semibold text-[#f5f0e8]">
                    {currentArc.activePromises} <span className="text-sm font-normal text-[#9a9280] italic">Setups</span>
                  </p>
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#9a9280] italic pt-1">
                    Tracked in G_perceived order
                  </p>
                </div>

                {/* Metric 3: Active Arc Finding */}
                <div className="glass-panel p-5 rounded-xl space-y-1 border-l-2 border-[#f2ca50]">
                  <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#f2ca50] uppercase tracking-wider">
                    Storyline Finding
                  </p>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-base font-semibold text-[#f5f0e8] italic">
                    {currentArc.headline}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#9a9280] leading-relaxed italic pt-1">
                    {currentArc.description}
                  </p>
                </div>
              </div>
            </div>
          </MotionCard>
        </ScrollReveal>
      </div>
    </section>
  );
};
