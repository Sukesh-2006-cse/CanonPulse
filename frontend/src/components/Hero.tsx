"use client";

import React from "react";
import { ArrowRight, BookMarked, Activity, GitBranch, Eye, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { MotionCard } from "./MotionCard";
import { AnimatedCounter } from "./AnimatedCounter";
import { FoldText } from "./FoldText/FoldText";
import { LokiTimelineGraph } from "./LokiTimelineGraph";

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
            {/* Main Headline with 3D GSAP FoldText Scroll Animation */}
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#f5f0e8] leading-[1.05]"
            >
              <FoldText
                text="Protect the"
                splitBy="word"
                trigger="scroll"
                hinge="top"
                duration={0.7}
                stagger={0.06}
                color="#f5f0e8"
              />{" "}
              <em className="not-italic text-[#f2ca50] drop-shadow-[0_0_30px_rgba(242,202,80,0.4)]">
                <FoldText
                  text="300 episodes"
                  splitBy="word"
                  trigger="scroll"
                  hinge="top"
                  duration={0.8}
                  stagger={0.08}
                  color="#f2ca50"
                />
              </em>{" "}
              <br />
              <FoldText
                text="you already shipped."
                splitBy="word"
                trigger="scroll"
                hinge="top"
                duration={0.8}
                stagger={0.06}
                color="#d4c49a"
              />
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

        {/* Right Column: High-Fidelity Loki TVA Multiverse Timeline Graph */}
        <div className="lg:col-span-6 relative">
          <ScrollReveal direction="left" delay={200}>
            <LokiTimelineGraph />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
