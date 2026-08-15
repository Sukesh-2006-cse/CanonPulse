"use client";

import React, { useState } from "react";
import { Activity } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { MotionCard } from "./MotionCard";
import { AnimatedCounter } from "./AnimatedCounter";
import { InteractiveGraphCanvas } from "./InteractiveGraphCanvas";

export const DashboardShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"graph" | "heatmap" | "audits">("graph");

  return (
    <section className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.1)] bg-[#080800]/40 overflow-hidden">
      {/* Golden glow bottom-right matching reference */}
      <div className="absolute -bottom-20 -right-10 w-[700px] h-[600px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.28)_0%,rgba(200,140,20,0.12)_35%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(220,150,20,0.12)_0%,transparent_55%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-14">
        {/* Title */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-[0.28em] text-[#f2ca50] uppercase">
              WORKSPACE PREVIEW
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              See the story
              <br />
              <em className="italic text-[#d4c49a]">beneath the story.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-base text-[#9a9280] italic">
              The narrative graph tracks claims, setups, payoffs, and reader tolerance simultaneously.
            </p>
          </div>
        </ScrollReveal>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={150}>
            <MotionCard glowColor="rgba(242,202,80,0.3)">
              <div className="glass-panel-gold p-6 rounded-xl flex items-center justify-between">
                <div>
                  <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase">CONTINUATION RATE</p>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-semibold text-[#f2ca50] mt-1">
                    <AnimatedCounter end={74.2} decimals={1} suffix="%" />
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] mt-1">90th Percentile CI: 71.8% – 76.5%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[rgba(242,202,80,0.1)] border border-[rgba(242,202,80,0.3)] flex items-center justify-center text-[#f2ca50] animate-pulse">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </MotionCard>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={250}>
            <MotionCard glowColor="rgba(255,179,71,0.25)">
              <div className="glass-panel p-6 rounded-xl">
                <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase mb-3">
                  NARRATIVE DEBT HEATMAP (EP 1–220)
                </p>
                <div className="flex gap-1.5 h-6 items-center">
                  {[
                    { w: "20%", bg: "rgba(126,224,138,0.8)" },
                    { w: "20%", bg: "rgba(242,202,80,0.8)" },
                    { w: "25%", bg: "rgba(255,179,71,0.9)" },
                    { w: "15%", bg: "rgba(255,92,77,0.8)" },
                    { w: "20%", bg: "rgba(126,224,138,0.9)" },
                  ].map((seg, i) => (
                    <div key={i} className="h-full rounded-sm transition-all hover:opacity-100" style={{ flex: seg.w, background: seg.bg }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {["Low Debt", "Growing", "Peak Mystery", "Unresolved", "Resolving"].map((label, i) => (
                    <span key={label} style={{ fontFamily: "var(--font-mono)" }} className={`text-[9px] ${i === 2 ? "text-[#ffb347]" : i === 3 ? "text-[#ff5c4d]" : "text-[#9a9280]"}`}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </MotionCard>
          </ScrollReveal>
        </div>

        {/* Product Workspace Mockup with Interactive Graph Canvas */}
        <ScrollReveal direction="up" delay={300}>
          <InteractiveGraphCanvas />
        </ScrollReveal>
      </div>
    </section>
  );
};
