"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { MotionCard } from "./MotionCard";

export const ComparisonSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"hole" | "twist">("hole");

  return (
    <section className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.1)] overflow-hidden">
      {/* Bottom-left glow */}
      <div className="absolute -bottom-20 -left-10 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.2)_0%,rgba(200,140,20,0.08)_40%,transparent_65%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center space-y-14">
        {/* Section Heading */}
        <ScrollReveal direction="up" delay={0}>
          <div className="space-y-4">
            <p
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] tracking-[0.28em] text-[#f2ca50] uppercase"
            >
              THE PAYOFF TEST
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Not every contradiction
              <br />
              <em className="italic text-[#d4c49a]">is a plot hole.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-base text-[#9a9280] max-w-xl mx-auto italic">
              Traditional checkers flag every inconsistency indiscriminately. CanonPulse tests whether
              a contradiction is backed by a downstream payoff before declaring it a defect.
            </p>
          </div>
        </ScrollReveal>

        {/* Comparison Cards with Motion UI Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Card A: Real Plot Hole */}
          <ScrollReveal direction="up" delay={150}>
            <MotionCard glowColor="rgba(255, 92, 77, 0.25)">
              <div
                onClick={() => setActiveTab("hole")}
                className={`rounded-xl p-7 cursor-pointer transition-all duration-300 border-l-4 ${
                  activeTab === "hole"
                    ? "glass-panel-hero border-[#ff5c4d] shadow-[0_0_35px_rgba(255,92,77,0.15)]"
                    : "glass-panel border-[rgba(255,92,77,0.3)] hover:border-[#ff5c4d]/70"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-[#ff5c4d]" />
                    <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs font-medium tracking-widest text-[#f5f0e8] uppercase">
                      Scenario A
                    </span>
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="px-3 py-1 rounded text-[10px] font-bold tracking-wider bg-[rgba(255,92,77,0.12)] text-[#ff5c4d] border border-[rgba(255,92,77,0.3)] uppercase"
                  >
                    REAL HOLE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs text-[#9a9280] bg-[#080800] p-4 rounded border border-[rgba(242,202,80,0.06)]">
                  <div className="flex items-center justify-between">
                    <span>Ep 84 · Furnace Scene</span>
                    <span className="text-[#f5f0e8] font-medium">&ldquo;Amulet destroyed&rdquo;</span>
                  </div>
                  <div className="flex justify-center text-[#9a9280]/50">↓ No downstream payoff link found</div>
                  <div className="flex items-center justify-between">
                    <span>Ep 192 · The Amulet</span>
                    <span className="text-[#ff5c4d] font-medium">&ldquo;Pulled intact amulet&rdquo;</span>
                  </div>
                </div>

                <p style={{ fontFamily: "var(--font-body)" }} className="mt-5 text-sm text-[#9a9280] leading-relaxed italic">
                  Two incompatible claims across 108 episodes with no explanatory payoff.
                  Flagged as a genuine narrative defect.
                </p>
              </div>
            </MotionCard>
          </ScrollReveal>

          {/* Card B: Protected Twist */}
          <ScrollReveal direction="up" delay={250}>
            <MotionCard glowColor="rgba(126, 224, 138, 0.25)">
              <div
                onClick={() => setActiveTab("twist")}
                className={`rounded-xl p-7 cursor-pointer transition-all duration-300 border-l-4 ${
                  activeTab === "twist"
                    ? "glass-panel-hero border-[#7ee08a] shadow-[0_0_35px_rgba(126,224,138,0.15)]"
                    : "glass-panel border-[rgba(126,224,138,0.3)] hover:border-[#7ee08a]/70"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#7ee08a]" />
                    <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs font-medium tracking-widest text-[#f5f0e8] uppercase">
                      Scenario B
                    </span>
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="px-3 py-1 rounded text-[10px] font-bold tracking-wider bg-[rgba(126,224,138,0.12)] text-[#7ee08a] border border-[rgba(126,224,138,0.3)] uppercase"
                  >
                    PROTECTED TWIST
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs text-[#9a9280] bg-[#080800] p-4 rounded border border-[rgba(242,202,80,0.06)]">
                  <div className="flex items-center justify-between">
                    <span>Ep 47 · Poison Setup</span>
                    <span className="text-[#f5f0e8] font-medium">&ldquo;Untraceable toxin&rdquo;</span>
                  </div>
                  <div className="flex justify-center text-[#7ee08a]/70">↓ Discharged by verified payoff at Ep 218</div>
                  <div className="flex items-center justify-between">
                    <span>Ep 218 · Final Reveal</span>
                    <span className="text-[#7ee08a] font-medium">&ldquo;Synthesized antidote&rdquo;</span>
                  </div>
                </div>

                <p style={{ fontFamily: "var(--font-body)" }} className="mt-5 text-sm text-[#9a9280] leading-relaxed italic">
                  An apparent contradiction protected as craft — Episode 218 contains verifiable
                  story-time evidence that resolves the setup.
                </p>
              </div>
            </MotionCard>
          </ScrollReveal>
        </div>

        {/* Insight Strip */}
        <ScrollReveal direction="up" delay={300}>
          <div className="glass-panel-gold rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-[#f2ca50] shrink-0" />
              <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#f5f0e8] italic">
                <span className="font-bold text-[#f2ca50] not-italic">The Payoff Rule:</span>{" "}
                A contradiction is only protected if independent story-time evidence verifies the downstream resolution.
              </p>
            </div>
            <a
              href="#architecture"
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-xs font-medium text-[#f2ca50] hover:underline whitespace-nowrap"
            >
              See Architecture →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
