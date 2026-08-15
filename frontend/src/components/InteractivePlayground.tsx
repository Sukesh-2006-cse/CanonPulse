"use client";

import React, { useState } from "react";
import { FileSearch, Sparkles, ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export const InteractivePlayground: React.FC = () => {
  const [proposedText, setProposedText] = useState(
    "The amulet appeared to vanish into the furnace, but its metallic sheen flickered in the shadows."
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult] = useState({
    totalDelta: "+3.20pp",
    unattributed: "0.10pp",
    beforePct: "71.0%",
    afterPct: "74.2%",
  });

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <section id="playground" className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.1)] overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-[600px] h-[500px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.24)_0%,rgba(200,140,20,0.1)_40%,transparent_65%)] pointer-events-none" />
      <div className="absolute top-20 -left-10 w-[350px] h-[300px] bg-[radial-gradient(ellipse,rgba(220,150,20,0.12)_0%,transparent_55%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-14">
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-[0.28em] text-[#f2ca50] uppercase">
              INTERACTIVE DEMO
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Evidence &amp; Surgical
              <br />
              <em className="italic text-[#d4c49a]">Repair.</em>
            </h2>
          </div>
        </ScrollReveal>

        {/* Two Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Evidence Drawer */}
          <ScrollReveal direction="up" delay={150}>
            <div className="glass-panel-gold p-7 rounded-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.12)] pb-5">
                <div className="flex items-center gap-2">
                  <FileSearch className="h-5 w-5 text-[#f2ca50]" />
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-xl font-semibold italic text-[#f5f0e8]"
                  >
                    Evidence Drawer
                  </h3>
                </div>
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="px-2.5 py-1 rounded text-[10px] font-bold bg-[rgba(255,92,77,0.12)] text-[#ff5c4d] border border-[rgba(255,92,77,0.3)] uppercase"
                >
                  REAL HOLE
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-[#080800] p-4 rounded border border-[rgba(242,202,80,0.08)]">
                  <p
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-[10px] text-[#9a9280] uppercase tracking-wider mb-2"
                  >
                    EPISODE 84 · PAGE 12
                  </p>
                  <blockquote
                    style={{ fontFamily: "var(--font-body)", borderLeftColor: "#ff5c4d" }}
                    className="italic text-[#f5f0e8] text-sm border-l-2 pl-3 py-0.5"
                  >
                    &ldquo;The amulet was{" "}
                    <span className="font-bold underline text-[#ff5c4d]">destroyed</span>
                    {" "}in the furnace.&rdquo;
                  </blockquote>
                </div>
                <div className="bg-[#080800] p-4 rounded border border-[rgba(242,202,80,0.08)]">
                  <p
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-[10px] text-[#9a9280] uppercase tracking-wider mb-2"
                  >
                    EPISODE 192 · PAGE 4
                  </p>
                  <blockquote
                    style={{ fontFamily: "var(--font-body)", borderLeftColor: "#ff5c4d" }}
                    className="italic text-[#f5f0e8] text-sm border-l-2 pl-3 py-0.5"
                  >
                    &ldquo;She drew the{" "}
                    <span className="font-bold underline text-[#ff5c4d]">undamaged amulet</span>
                    {" "}from her pocket.&rdquo;
                  </blockquote>
                </div>
              </div>

              <div className="p-3 bg-[#080800]/80 rounded border border-[rgba(242,202,80,0.08)]">
                <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#9a9280] italic">
                  <span className="text-[#f2ca50] font-semibold not-italic">Audit Verdict:</span>{" "}
                  No verified downstream payoff link found in story-time (G_true). Flagged as unbacked defect.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Surgical Repair */}
          <ScrollReveal direction="up" delay={250}>
            <div className="glass-panel-hero p-7 rounded-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.12)] pb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#f2ca50]" />
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-xl font-semibold italic text-[#f5f0e8]"
                  >
                    Surgical Repair
                  </h3>
                </div>
                <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280]">
                  Ep 84 fix
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-[10px] text-[#9a9280] uppercase tracking-wider block mb-2"
                  >
                    Original Hunk
                  </label>
                  <div
                    style={{ fontFamily: "var(--font-body)" }}
                    className="p-3 bg-[#080800] rounded border border-[rgba(255,92,77,0.3)] text-[#ff5c4d] italic text-sm"
                  >
                    &ldquo;The amulet was destroyed in the furnace.&rdquo;
                  </div>
                </div>

                <div>
                  <label
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-[10px] text-[#9a9280] uppercase tracking-wider block mb-2"
                  >
                    Proposed Surgical Edit
                  </label>
                  <textarea
                    value={proposedText}
                    onChange={(e) => setProposedText(e.target.value)}
                    rows={2}
                    style={{ fontFamily: "var(--font-body)" }}
                    className="w-full p-3 bg-[#080800] rounded border border-[rgba(126,224,138,0.4)] text-[#7ee08a] italic text-sm focus:outline-none focus:border-[#7ee08a]"
                  />
                </div>

                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="gold-button w-full py-3 rounded flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <span>{isSimulating ? "Computing Edit Movement…" : "Run Simulation"}</span>
                  {!isSimulating && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>

              {/* Result */}
              <div className="p-4 bg-[#080800] rounded border border-[rgba(126,224,138,0.3)] space-y-2">
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280]">
                    Predicted Movement:
                  </span>
                  <span style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold text-[#7ee08a]">
                    {simResult.totalDelta}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[rgba(242,202,80,0.08)] pt-2">
                  <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280]">
                    {simResult.beforePct} → {simResult.afterPct}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#f2ca50]">
                    Unattributed: {simResult.unattributed}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Closing tagline */}
        <ScrollReveal direction="up" delay={300}>
          <div className="text-center">
            <p style={{ fontFamily: "var(--font-display)" }} className="text-3xl sm:text-4xl font-semibold text-[#f5f0e8]">
              Your back catalog is{" "}
              <em className="italic text-[#f2ca50]">part of your story.</em>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
