"use client";

import React, { useState } from "react";
import { Clock, Eye, Cpu, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { MotionCard } from "./MotionCard";

export const ArchitectureDiagram: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<"all" | "perceived" | "true">("all");

  return (
    <section id="architecture" className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.1)] bg-[#080800]/40 overflow-hidden">
      {/* Right-side glow */}
      <div className="absolute -bottom-20 -right-10 w-[600px] h-[500px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.22)_0%,rgba(200,140,20,0.1)_40%,transparent_65%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-14">
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-[0.28em] text-[#f2ca50] uppercase">
              ARCHITECTURE
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Two Timelines.
              <br />
              <em className="italic text-[#d4c49a]">One Story.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-base text-[#9a9280] italic">
              CanonPulse evaluates both audience presentation order and true story chronology simultaneously.
            </p>

            {/* Layer Tabs */}
            <div className="pt-4 flex justify-center gap-3">
              {[
                { key: "all", label: "Dual-Layer Matrix" },
                { key: "perceived", label: "G_perceived Only" },
                { key: "true", label: "G_true Only" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveLayer(tab.key as typeof activeLayer)}
                  style={{ fontFamily: "var(--font-body)" }}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                    activeLayer === tab.key
                      ? "gold-button shadow-[0_0_20px_rgba(242,202,80,0.35)]"
                      : "ghost-button"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Timeline Matrix Panel */}
        <ScrollReveal direction="up" delay={150}>
          <div className="glass-panel-gold rounded-2xl p-8 relative overflow-hidden">
            <div className="grid grid-cols-1 gap-10 relative z-10">
              {/* G_perceived Layer */}
              <div
                className={`transition-all duration-400 p-6 rounded-xl border ${
                  activeLayer === "true"
                    ? "opacity-25 grayscale pointer-events-none"
                    : "border-[rgba(242,202,80,0.35)] bg-[rgba(20,20,8,0.8)]"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-[#f2ca50]" />
                    <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs font-bold tracking-widest text-[#f2ca50] uppercase">
                      G_perceived — Audience Presentation Order
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280]">
                    perceived_index axis
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    { ep: "EP 01", label: "Claim Planted", color: "border-[rgba(242,202,80,0.2)]", textColor: "#f5f0e8" },
                    { ep: "EP 47", label: "Poison Setup", color: "border-[rgba(255,179,71,0.4)]", textColor: "#ffb347" },
                    { ep: "EP 84", label: "Amulet Conflict", color: "border-[rgba(255,92,77,0.4)]", textColor: "#ff5c4d" },
                    { ep: "EP 218", label: "Payoff Reveal", color: "border-[rgba(126,224,138,0.4)]", textColor: "#7ee08a" },
                  ].map((node) => (
                    <div key={node.ep} className={`p-3 rounded-lg bg-[#080800] border ${node.color} transition-transform hover:scale-105`}>
                      <p style={{ fontFamily: "var(--font-mono)", color: node.textColor }} className="text-[10px]">{node.ep}</p>
                      <p style={{ fontFamily: "var(--font-display)", color: node.textColor }} className="text-sm font-semibold italic mt-0.5">{node.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Central Resolver */}
              <div className="flex items-center justify-center my-[-16px] relative z-20">
                <div className="glass-panel-gold rounded-full px-7 py-3 flex items-center gap-3 border border-[#f2ca50] shadow-[0_0_30px_rgba(242,202,80,0.3)]">
                  <Cpu className="h-5 w-5 text-[#f2ca50] animate-pulse" />
                  <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs font-bold tracking-widest text-[#f2ca50] uppercase">
                    DETERMINISTIC LEDGER RESOLVER
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-[#7ee08a]" />
                </div>
              </div>

              {/* G_true Layer */}
              <div
                className={`transition-all duration-400 p-6 rounded-xl border ${
                  activeLayer === "perceived"
                    ? "opacity-25 grayscale pointer-events-none"
                    : "border-[rgba(126,224,138,0.35)] bg-[rgba(20,20,8,0.8)]"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#7ee08a]" />
                    <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs font-bold tracking-widest text-[#7ee08a] uppercase">
                      G_true — Actual Story Chronology
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280]">
                    true_time axis
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    { ep: "YEAR −10", label: "Ancient Pact", color: "border-[rgba(242,202,80,0.2)]", textColor: "#f5f0e8" },
                    { ep: "DAY 14", label: "Poison Created", color: "border-[rgba(126,224,138,0.4)]", textColor: "#7ee08a" },
                    { ep: "DAY 48", label: "Furnace Event", color: "border-[rgba(255,92,77,0.4)]", textColor: "#ff5c4d" },
                    { ep: "DAY 100", label: "Final Climax", color: "border-[rgba(242,202,80,0.4)]", textColor: "#f2ca50" },
                  ].map((node) => (
                    <div key={node.ep} className={`p-3 rounded-lg bg-[#080800] border ${node.color} transition-transform hover:scale-105`}>
                      <p style={{ fontFamily: "var(--font-mono)", color: node.textColor }} className="text-[10px]">{node.ep}</p>
                      <p style={{ fontFamily: "var(--font-display)", color: node.textColor }} className="text-sm font-semibold italic mt-0.5">{node.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Feature Takeaways — 3 Perfectly Equal Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {[
            {
              color: "#f2ca50",
              glow: "rgba(242, 202, 80, 0.2)",
              borderColor: "border-[#f2ca50]/40",
              label: "Graph Traversal Logic",
              body: "Verification relies on deterministic graph traversal, not an LLM call. The same input always produces the same verdict.",
              delay: 200,
            },
            {
              color: "#7ee08a",
              glow: "rgba(126, 224, 138, 0.2)",
              borderColor: "border-[#7ee08a]/40",
              label: "Contestable Outcomes",
              body: "Every finding links directly to reachable text citations so authors can argue with specific graph assertions.",
              delay: 300,
            },
            {
              color: "#ff5c4d",
              glow: "rgba(255, 92, 77, 0.2)",
              borderColor: "border-[#ff5c4d]/40",
              label: "Defect Resolution",
              body: "Identifies broken setups before release, reducing expensive back-catalog rework during localization.",
              delay: 400,
            },
          ].map((item) => (
            <ScrollReveal key={item.label} direction="up" delay={item.delay} className="h-full">
              <MotionCard glowColor={item.glow} className="h-full">
                <div
                  className={`glass-panel p-6 rounded-xl border-l-4 ${item.borderColor} h-full flex flex-col justify-between`}
                >
                  <div>
                    <h4 style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }} className="text-lg font-semibold italic mb-2">
                      {item.label}
                    </h4>
                    <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#9a9280] leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              </MotionCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
