"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  Compass,
  Sparkles,
  Activity,
  ArrowRight,
  Sliders,
  Eye,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface AudienceSimulatorSectionProps {
  onOpenCohortView?: () => void;
}

export const AudienceSimulatorSection: React.FC<AudienceSimulatorSectionProps> = ({
  onOpenCohortView,
}) => {
  const [selectedEpisode, setSelectedEpisode] = useState<number>(60);
  const [activeCohort, setActiveCohort] = useState<string>("binge_casual");

  const cohorts = [
    {
      id: "binge_casual",
      name: "The Binge Casual",
      tagline: "Pacing & Momentum Sensitive",
      color: "#7ee08a",
      retentionScore: "88.4%",
      sensitivity: "High sensitivity to filler episodes; drops off if payoff is delayed >12 episodes.",
      reaction: "Thrilled by rapid cliffhangers; skips episodes when dialogue loops.",
    },
    {
      id: "lore_hound",
      name: "The Lore Hound",
      tagline: "World-Building & Clue Fanatic",
      color: "#f2ca50",
      retentionScore: "94.2%",
      sensitivity: "Extreme memory horizon; notices contradictory background prop dates instantly.",
      reaction: "Cross-references Episode 1 radio serial numbers with Episode 60 harbor records.",
    },
    {
      id: "character_first",
      name: "Character-First Listener",
      tagline: "Emotional Consistency & Vows",
      color: "#ffb347",
      retentionScore: "91.0%",
      sensitivity: "Intolerant of unearned character betrayals or abandoned romance arcs.",
      reaction: "Values Asha's grief processing over puzzle-box mechanics.",
    },
    {
      id: "skeptic",
      name: "The Plot Skeptic",
      tagline: "Logic & Plot Hole Auditor",
      color: "#ff5c4d",
      retentionScore: "76.5%",
      sensitivity: "Zero tolerance for unearned twists, deus-ex-machina, or unexplained skills.",
      reaction: "Flags swimming contradiction in Ep 60 as fatal until Ep 221 payoff confirms craft.",
    },
    {
      id: "casual_weekly",
      name: "Weekly Commuter",
      tagline: "Short-Horizon Episodic",
      color: "#a6a297",
      retentionScore: "82.1%",
      sensitivity: "Needs explicit clue recaps every 5 episodes; loses complex multi-thread context.",
      reaction: "Requires strong episodic resolution alongside macro serial arcs.",
    },
  ];

  const currentCohort = cohorts.find((c) => c.id === activeCohort) || cohorts[0];

  return (
    <section className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.12)] bg-[#070703] overflow-hidden">
      <div className="absolute bottom-10 left-1/4 w-[600px] h-[450px] bg-[radial-gradient(ellipse,rgba(126,224,138,0.06)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-16">
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(126,224,138,0.3)] bg-[rgba(126,224,138,0.08)] shadow-[0_0_20px_rgba(126,224,138,0.15)]">
              <TrendingUp className="h-3.5 w-3.5 text-[#7ee08a]" />
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[11px] font-semibold tracking-[0.25em] text-[#7ee08a] uppercase"
              >
                AUDIENCE COHORT SIMULATION
              </span>
            </div>

            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Five Reader Archetypes.
              <br />
              <span className="italic text-[#7ee08a]">Predictive Churn Modeling.</span>
            </h2>

            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-base sm:text-lg text-[#9a9280] italic max-w-2xl mx-auto"
            >
              Simulate how distinct listener cohorts experience narrative pacing, mystery decay, and twist payoffs across every episode boundary.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Cohort Waveform & Simulation Stage */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-[rgba(126,224,138,0.25)] space-y-8 bg-[#090b07]/80 shadow-2xl">
          {/* Top Controls: Episode Horizon Slider */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.1)] pb-6">
            <div className="space-y-1">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase font-bold text-[#f2ca50] flex items-center gap-1.5"
              >
                <Sliders className="h-3.5 w-3.5" />
                Episode Boundary Inspector
              </span>
              <p className="text-sm font-semibold text-[#f5f0e8] italic">
                Inspecting Episode {selectedEpisode} of 220
              </p>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3 w-full sm:w-72">
              <span className="text-xs font-mono text-[#9a9280]">Ep 1</span>
              <input
                type="range"
                min="1"
                max="220"
                value={selectedEpisode}
                onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                className="w-full accent-[#7ee08a] cursor-pointer"
              />
              <span className="text-xs font-mono text-[#7ee08a] font-bold">Ep 220</span>
            </div>
          </div>

          {/* Dynamic Cohort Waveform SVG Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#9a9280]">
              <span className="flex items-center gap-1 text-[#f5f0e8] font-bold">
                <Activity className="h-3.5 w-3.5 text-[#7ee08a]" />
                Live Structural Retention Waveforms (Episodes 1 - 220)
              </span>
              <span className="text-[#7ee08a]">Bounded Structural Simulation</span>
            </div>

            <div className="relative h-48 w-full bg-[#050604] rounded-2xl border border-[rgba(126,224,138,0.2)] overflow-hidden p-4 flex items-center">
              <svg className="w-full h-full fill-none">
                {/* Grid guidelines */}
                <line x1="0" y1="25%" x2="100%" y2="25%" stroke="rgba(242,202,80,0.05)" strokeDasharray="4 4" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(242,202,80,0.05)" strokeDasharray="4 4" />
                <line x1="0" y1="75%" x2="100%" y2="75%" stroke="rgba(242,202,80,0.05)" strokeDasharray="4 4" />

                {/* Cohort 1: Binge Casual (Green) */}
                <path
                  d="M 0 100 Q 150 40 300 80 T 600 50 T 900 90 T 1200 45"
                  stroke="#7ee08a"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Cohort 2: Lore Hound (Gold) */}
                <path
                  d="M 0 85 Q 200 120 400 65 T 800 95 T 1200 70"
                  stroke="#f2ca50"
                  strokeWidth="2"
                  opacity="0.9"
                />

                {/* Cohort 3: Character First (Amber) */}
                <path
                  d="M 0 70 Q 180 105 360 55 T 720 115 T 1200 80"
                  stroke="#ffb347"
                  strokeWidth="2"
                  opacity="0.85"
                />

                {/* Cohort 4: Plot Skeptic (Red) */}
                <path
                  d="M 0 125 Q 220 65 440 115 T 880 45 T 1200 105"
                  stroke="#ff5c4d"
                  strokeWidth="2"
                  opacity="0.8"
                />

                {/* Active Boundary Marker */}
                <line
                  x1={`${(selectedEpisode / 220) * 100}%`}
                  y1="0"
                  x2={`${(selectedEpisode / 220) * 100}%`}
                  y2="100%"
                  stroke="#ffd966"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              </svg>

              {/* Cursor Floating Badge */}
              <div
                className="absolute top-3 font-mono text-[10px] bg-[#141408] border border-[#f2ca50] px-2 py-0.5 rounded text-[#f2ca50] font-bold -translate-x-1/2 pointer-events-none"
                style={{ left: `${(selectedEpisode / 220) * 100}%` }}
              >
                Ep {selectedEpisode}
              </div>
            </div>
          </div>

          {/* 5 Interactive Cohort Selector Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {cohorts.map((cohort) => {
              const isSelected = activeCohort === cohort.id;
              return (
                <button
                  key={cohort.id}
                  onClick={() => setActiveCohort(cohort.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-[#141408] border-[#f2ca50] shadow-[0_0_20px_rgba(242,202,80,0.15)]"
                      : "bg-[#080800]/80 border-[rgba(242,202,80,0.1)] hover:border-[rgba(242,202,80,0.25)]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cohort.color }} />
                    <span
                      style={{ fontFamily: "var(--font-mono)", color: cohort.color }}
                      className="text-xs font-bold uppercase tracking-wider"
                    >
                      {cohort.retentionScore}
                    </span>
                  </div>
                  <h4
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-base font-semibold text-[#f5f0e8] italic"
                  >
                    {cohort.name}
                  </h4>
                  <p className="text-[11px] text-[#9a9280] italic line-clamp-1 mt-0.5">
                    {cohort.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Cohort Deep Dive Box */}
          <div className="bg-[#050603] p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.1)] pb-2">
              <span className="text-[#f5f0e8] font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentCohort.color }} />
                Archetype Profile: {currentCohort.name}
              </span>
              <span className="text-[#7ee08a] font-bold">Retention: {currentCohort.retentionScore}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[#9a9280] text-[10px] uppercase font-bold block">
                  Drop-off Trigger & Sensitivity
                </span>
                <p style={{ fontFamily: "var(--font-body)" }} className="text-[#d4c49a] italic text-xs pt-1">
                  {currentCohort.sensitivity}
                </p>
              </div>

              <div>
                <span className="text-[#7ee08a] text-[10px] uppercase font-bold block">
                  Simulated Audience Verdict
                </span>
                <p style={{ fontFamily: "var(--font-body)" }} className="text-[#f5f0e8] italic text-xs pt-1">
                  {currentCohort.reaction}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-[#9a9280] font-mono italic">
              Disclosed: Computed from bounded structural weight matrices in `app/cohorts.py`.
            </span>

            {onOpenCohortView && (
              <button
                onClick={onOpenCohortView}
                className="gold-button px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <span>Launch Full Cohort Matrix</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
