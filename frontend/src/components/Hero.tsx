"use client";

import React from "react";
import { ArrowRight, BookMarked, Activity, GitBranch, Eye, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { MotionCard } from "./MotionCard";
import { AnimatedCounter } from "./AnimatedCounter";

interface HeroProps {
  onOpenAudit: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAudit }) => {
  return (
    <section
      id="overview"
      className="section-glow relative overflow-hidden pt-20 pb-28 border-b border-[rgba(242,202,80,0.1)]"
    >
      {/* Multi-point radial golden glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-20 -right-20 w-[700px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(242,202,80,0.32)_0%,rgba(200,140,20,0.15)_35%,transparent_65%)] blur-[1px]" />
        <div className="absolute -bottom-10 -left-10 w-[400px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(220,150,20,0.16)_0%,transparent_55%)]" />
        <div className="absolute top-0 right-1/3 w-[300px] h-[200px] bg-[radial-gradient(ellipse_at_center,rgba(180,120,10,0.06)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-8">
          <ScrollReveal direction="up" delay={0}>
            {/* Eyebrow Badge */}
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="inline-flex items-center gap-2.5 rounded-sm border border-[rgba(242,202,80,0.35)] bg-[rgba(242,202,80,0.06)] px-4 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-[#f2ca50] shadow-[0_0_12px_rgba(242,202,80,0.1)] transition-all hover:bg-[rgba(242,202,80,0.12)]"
            >
              <BookMarked className="h-3.5 w-3.5" />
              <span>NARRATIVE INTELLIGENCE FOR SERIALIZED FICTION</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            {/* Main Headline */}
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#f5f0e8] leading-[1.05]"
            >
              Protect the{" "}
              <em className="not-italic text-[#f2ca50] drop-shadow-[0_0_30px_rgba(242,202,80,0.4)]">
                300&nbsp;episodes
              </em>{" "}
              <br />
              <span className="text-[#d4c49a]">you already shipped.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={250}>
            {/* Description */}
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-base text-[#9a9280] leading-relaxed max-w-lg italic"
            >
              Every clue, vow, wound, threat, and romance arc is a promise made to your reader.
              CanonPulse tells you which of those promises are broken, which are intentional twists
              still waiting on their payoff, and which are overdue — with the exact episodes to prove it.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={350}>
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenAudit}
                className="gold-button flex items-center gap-2.5 rounded px-7 py-3 text-sm font-semibold group"
              >
                <span>Start Audit</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#architecture"
                className="ghost-button rounded px-7 py-3 text-sm"
              >
                Explore the System
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={450}>
            {/* Animated Counter Stats */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-[rgba(242,202,80,0.12)] max-w-md">
              <div>
                <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-semibold text-[#f5f0e8]">
                  <AnimatedCounter end={220} suffix="+" />
                </p>
                <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] tracking-wider uppercase mt-0.5">
                  Episodes Audited
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-semibold text-[#7ee08a]">
                  <AnimatedCounter end={100} suffix="%" />
                </p>
                <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] tracking-wider uppercase mt-0.5">
                  Deterministic
                </p>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-semibold text-[#f2ca50]">
                  <AnimatedCounter end={74.2} decimals={1} suffix="%" />
                </p>
                <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] tracking-wider uppercase mt-0.5">
                  Continuation CI
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: High-Fidelity 3D Motion Glass Hero Graph Canvas */}
        <div className="lg:col-span-6 relative">
          <ScrollReveal direction="left" delay={200}>
            <MotionCard glowColor="rgba(242,202,80,0.35)">
              <div className="glass-panel-hero rounded-2xl p-6 relative overflow-hidden">
                {/* Window Chrome Header */}
                <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.12)] pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5c4d]/90 shadow-[0_0_8px_rgba(255,92,77,0.5)]" />
                    <div className="h-3 w-3 rounded-full bg-[#ffb347]/90 shadow-[0_0_8px_rgba(255,179,71,0.5)]" />
                    <div className="h-3 w-3 rounded-full bg-[#7ee08a]/90 shadow-[0_0_8px_rgba(126,224,138,0.5)]" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="text-[10px] tracking-widest text-[#f2ca50] font-semibold uppercase flex items-center gap-1.5"
                    >
                      <span className="h-2 w-2 rounded-full bg-[#7ee08a] animate-pulse" />
                      G_perceived × G_true Matrix
                    </span>
                  </div>
                </div>

                {/* Graph Canvas Container */}
                <div className="relative h-80 sm:h-96 rounded-xl bg-[#080800] border border-[rgba(242,202,80,0.12)] p-4 flex flex-col justify-between overflow-hidden">
                  {/* Ambient Canvas Light Gradients */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,202,80,0.07)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse,rgba(242,202,80,0.2)_0%,transparent_70%)] pointer-events-none" />

                  {/* SVG Connected Neural Pathway Curve Lines */}
                  <svg className="absolute inset-0 w-full h-full fill-none pointer-events-none">
                    {/* Horizontal Axis Guides */}
                    <line x1="5%" y1="32%" x2="95%" y2="32%" stroke="rgba(242,202,80,0.08)" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="5%" y1="68%" x2="95%" y2="68%" stroke="rgba(242,202,80,0.08)" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Flow 1: Ep 47 setup -> Central Resolver -> Ep 218 Payoff (Green Protected Path) */}
                    <path
                      d="M 100,85 Q 240,75 250,160 T 420,105"
                      stroke="#7ee08a"
                      strokeWidth="2.5"
                      opacity="0.85"
                    />
                    <path
                      d="M 100,85 Q 240,75 250,160 T 420,105"
                      stroke="rgba(126,224,138,0.4)"
                      strokeWidth="6"
                      opacity="0.4"
                    />

                    {/* Flow 2: Ep 84 contradiction -> Central Resolver -> Red Defect Callout */}
                    <path
                      d="M 120,230 Q 200,210 250,160 T 400,240"
                      stroke="#ff5c4d"
                      strokeWidth="2.5"
                      opacity="0.85"
                    />
                    <path
                      d="M 120,230 Q 200,210 250,160 T 400,240"
                      stroke="rgba(255,92,77,0.4)"
                      strokeWidth="6"
                      opacity="0.4"
                    />

                    {/* Dashed Signal Line */}
                    <line
                      x1="50"
                      y1="85"
                      x2="250"
                      y2="160"
                      stroke="#f2ca50"
                      strokeWidth="1.5"
                      strokeDasharray="6 6"
                      className="animate-dash-flow"
                    />

                    {/* Center Resolver Pulse Ring */}
                    <circle cx="50%" cy="48%" r="42" stroke="rgba(242,202,80,0.25)" strokeWidth="1" className="animate-pulse-glow" />
                  </svg>

                  {/* Top Axis Label */}
                  <div className="relative z-10 flex justify-between items-center text-[9px] font-mono text-[#9a9280]/70 uppercase tracking-widest px-2">
                    <span className="flex items-center gap-1 text-[#f2ca50]">
                      <Eye className="h-3 w-3" /> G_perceived Timeline
                    </span>
                    <span className="flex items-center gap-1 text-[#7ee08a]">
                      <Clock className="h-3 w-3" /> G_true Chronology
                    </span>
                  </div>

                  {/* Node Badges Grid Overlay */}
                  <div className="relative z-10 grid grid-cols-2 gap-4 items-center flex-1 my-auto">
                    {/* Node 1: Ep 47 Setup */}
                    <div className="justify-self-start glass-panel px-3.5 py-2.5 rounded-lg border-l-4 border-[#ffb347] transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,179,71,0.15)] max-w-[190px]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#ffb347] font-semibold">Ep 47 Setup</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ffb347]" />
                      </div>
                      <p style={{ fontFamily: "var(--font-display)" }} className="text-xs font-semibold text-[#f5f0e8] italic">Poison Origin Toxin</p>
                    </div>

                    {/* Node 2: Ep 218 Discharged Payoff */}
                    <div className="justify-self-end glass-panel px-3.5 py-2.5 rounded-lg border-l-4 border-[#7ee08a] transition-all hover:scale-105 shadow-[0_0_15px_rgba(126,224,138,0.15)] max-w-[190px]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#7ee08a] font-semibold">Ep 218 Payoff</span>
                        <ShieldCheck className="h-3 w-3 text-[#7ee08a]" />
                      </div>
                      <p style={{ fontFamily: "var(--font-display)" }} className="text-xs font-semibold text-[#7ee08a] italic">Antidote Verified</p>
                    </div>

                    {/* Central Resolver Hub */}
                    <div className="col-span-2 justify-self-center text-center my-1 z-20">
                      <div className="h-14 w-14 rounded-full bg-[#141408] border-2 border-[#f2ca50] mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(242,202,80,0.5)] animate-node-beacon">
                        <GitBranch className="h-6 w-6 text-[#f2ca50]" />
                      </div>
                      <p style={{ fontFamily: "var(--font-mono)" }} className="mt-1.5 text-[9px] tracking-widest text-[#f2ca50] font-bold uppercase">
                        Ledger Graph Resolver
                      </p>
                    </div>

                    {/* Node 3: Ep 84 Real Plot Hole */}
                    <div className="justify-self-start glass-panel px-3.5 py-2.5 rounded-lg border-l-4 border-[#ff5c4d] transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,92,77,0.15)] max-w-[190px]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#ff5c4d] font-semibold">Ep 84 Contradiction</span>
                        <AlertTriangle className="h-3 w-3 text-[#ff5c4d]" />
                      </div>
                      <p style={{ fontFamily: "var(--font-display)" }} className="text-xs font-semibold text-[#ff5c4d] italic">Unresolved Amulet</p>
                    </div>

                    {/* Node 4: Payoff Status Tag */}
                    <div className="justify-self-end glass-panel px-3 py-2 rounded-lg border border-[rgba(242,202,80,0.2)] text-right max-w-[190px]">
                      <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#7ee08a] font-bold block">
                        5 Twists Protected
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)" }} className="text-[9px] text-[#9a9280]">
                        Verified Payoff Link
                      </span>
                    </div>
                  </div>

                  {/* Bottom Analytical Summary Bar */}
                  <div className="relative z-10 flex justify-between items-center glass-panel p-3 rounded-lg border border-[rgba(242,202,80,0.15)] mt-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-[#7ee08a] animate-pulse" />
                      <span style={{ fontFamily: "var(--font-body)" }} className="text-xs font-medium text-[#f5f0e8] italic">
                        74.2% Predicted Continuation
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span className="text-[#ff5c4d] font-bold">6 Real Holes</span>
                      <span className="text-[#7ee08a] font-bold">5 Twists Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </MotionCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
