"use client";

import React, { useState } from "react";
import {
  Film,
  PenTool,
  MessageSquareX,
  HeartHandshake,
  Scroll,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users2,
  Scale,
} from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { MotionCard } from "./MotionCard";
import { FoldText } from "./FoldText/FoldText";

interface WritersRoomSectionProps {
  onOpenCollaboration?: () => void;
}

export const WritersRoomSection: React.FC<WritersRoomSectionProps> = ({ onOpenCollaboration }) => {
  const [activePersona, setActivePersona] = useState<number>(0);

  const personas = [
    {
      id: "director",
      name: "Director",
      badge: "Macro Narrative Pacing",
      icon: Film,
      color: "#f2ca50",
      accentBg: "rgba(242, 202, 80, 0.12)",
      borderColor: "border-[rgba(242,202,80,0.3)]",
      focus: "Macro narrative pacing, season-level arcs, and structural dramatic momentum.",
      sampleAnnotation: {
        issue: "Episode 60 Diving Scene",
        verdict: "Accelerate Reveal",
        rationale:
          "The midpoint twist lands well, but the aftermath drags across episodes 61-64. Tighten the investigation beats to sustain audience momentum.",
        action: "Compress the 3-episode lull into a single high-tension interrogation sequence.",
        confidence: 0.94,
        citations: ["ex-060-dive", "ex-062-interrogation"],
      },
    },
    {
      id: "editor",
      name: "Editor",
      badge: "Prose & Scene Flow",
      icon: PenTool,
      color: "#7ee08a",
      accentBg: "rgba(126, 224, 138, 0.12)",
      borderColor: "border-[rgba(126,224,138,0.3)]",
      focus: "Prose tightness, dialogue cadence, sensory subtext, and seamless scene transitions.",
      sampleAnnotation: {
        issue: "Dialogue Repetition in Ep 14",
        verdict: "Trim Dialogue Clutter",
        rationale:
          "Asha repeats the phrase 'the tape cannot lie' four times in consecutive conversations. Let the ambient sound of the rain carry the unsaid dread.",
        action: "Cut repetitive exposition in Scene 3; rely on the cassette crackle sound cue.",
        confidence: 0.98,
        citations: ["ex-014-cassette-dialogue"],
      },
    },
    {
      id: "critic",
      name: "Critic",
      badge: "Trope & Logic Auditor",
      icon: MessageSquareX,
      color: "#ff5c4d",
      accentBg: "rgba(255, 92, 77, 0.12)",
      borderColor: "border-[rgba(255,92,77,0.3)]",
      focus: "Tropes, cliché detection, plot conveniences, and unearned sudden reveals.",
      sampleAnnotation: {
        issue: "Sudden Password Discovery (Ep 88)",
        verdict: "Unearned Plot Convenience",
        rationale:
          "Finding the vault key under a loose floorboard feels contrived without prior foreshadowing in the harbor warehouse scenes.",
        action: "Plant subtle visual micro-foreshadowing in Episode 22 during the initial raid.",
        confidence: 0.91,
        citations: ["ex-088-vault-key", "ex-022-harbor-raid"],
      },
    },
    {
      id: "psychologist",
      name: "Psychologist",
      badge: "Emotional Logic",
      icon: HeartHandshake,
      color: "#ffb347",
      accentBg: "rgba(255, 179, 71, 0.12)",
      borderColor: "border-[rgba(255,179,71,0.3)]",
      focus: "Character motivation, trauma consistency, grief pacing, and relationship arcs.",
      sampleAnnotation: {
        issue: "Asha's Reaction to Vikram's Betrayal",
        verdict: "Emotional Disconnect",
        rationale:
          "Asha moves from shock to tactical planning in under two minutes without processing nine years of grief and deceit.",
        action: "Insert a breath of isolation before she picks up the radio console.",
        confidence: 0.96,
        citations: ["ex-110-grief-break"],
      },
    },
    {
      id: "historian",
      name: "Historian",
      badge: "World Lore & Canon",
      icon: Scroll,
      color: "#b388ff",
      accentBg: "rgba(179, 136, 255, 0.12)",
      borderColor: "border-[rgba(179,136,255,0.3)]",
      focus: "World-building rules, historical timeline constraints, and translation lore parity.",
      sampleAnnotation: {
        issue: "Konkan Rani Radio Model Discrepancy",
        verdict: "Lore Continuity Drift",
        rationale:
          "Episode 1 establishes the ship sank in 2008 with a vacuum-tube transponder; Episode 92 describes digital GPS logs.",
        action: "Align all ship equipment references to the 2008 maritime analog standard.",
        confidence: 0.99,
        citations: ["ex-001-radio-spec", "ex-092-gps-log"],
      },
    },
  ];

  const current = personas[activePersona];

  return (
    <section className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.12)] bg-[#0a0a04]/40 overflow-hidden">
      <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-[radial-gradient(circle,rgba(242,202,80,0.06)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-16">
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(242,202,80,0.3)] bg-[rgba(242,202,80,0.08)] shadow-[0_0_20px_rgba(242,202,80,0.15)]">
              <Users2 className="h-3.5 w-3.5 text-[#f2ca50]" />
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[11px] font-semibold tracking-[0.25em] text-[#f2ca50] uppercase"
              >
                VIRTUAL WRITERS ROOM
              </span>
            </div>

            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              <FoldText text="Five Editorial Minds." splitBy="word" trigger="scroll" hinge="top" color="#f5f0e8" />
              <br />
              <em className="italic text-[#f2ca50]">
                <FoldText text="One Multi-Perspective Review." splitBy="word" trigger="scroll" hinge="top" color="#f2ca50" />
              </em>
            </h2>

            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-base sm:text-lg text-[#9a9280] italic max-w-2xl mx-auto"
            >
              Every proposed episode draft is audited across five distinct storytelling perspectives without generic fluff—each grounded in explicit excerpt citations.
            </p>
          </div>
        </ScrollReveal>

        {/* Persona Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 5 Persona Switcher (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1 px-1">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase font-semibold tracking-wider text-[#9a9280]"
              >
                Select Writers Room Agent
              </span>
              <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#7ee08a]">
                Consensus Engine Active
              </span>
            </div>

            {personas.map((persona, idx) => {
              const Icon = persona.icon;
              const isActive = activePersona === idx;

              return (
                <button
                  key={persona.id}
                  onClick={() => setActivePersona(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group relative ${
                    isActive
                      ? `bg-[#141408] ${persona.borderColor} shadow-[0_0_25px_${persona.accentBg}]`
                      : "bg-[#0c0c06]/70 border-[rgba(242,202,80,0.08)] hover:bg-[#111107] hover:border-[rgba(242,202,80,0.2)]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="p-2.5 rounded-xl border flex-shrink-0"
                      style={{
                        backgroundColor: isActive ? persona.accentBg : "#080800",
                        borderColor: isActive ? persona.color : "rgba(242,202,80,0.15)",
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: persona.color }} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          style={{ fontFamily: "var(--font-display)" }}
                          className={`text-lg font-semibold ${
                            isActive ? "text-[#f5f0e8] italic" : "text-[#d4c49a] group-hover:text-[#f5f0e8]"
                          }`}
                        >
                          {persona.name}
                        </h3>
                      </div>
                      <span
                        style={{ fontFamily: "var(--font-mono)", color: persona.color }}
                        className="text-[10px] font-bold uppercase tracking-wider block"
                      >
                        {persona.badge}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: persona.color }}
                      />
                    )}
                    <ArrowRight
                      className={`h-4 w-4 transition-transform ${
                        isActive ? "translate-x-1 opacity-100" : "opacity-20 group-hover:opacity-60"
                      }`}
                      style={{ color: persona.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Persona Audit Console (7 cols) */}
          <div className="lg:col-span-7">
            <div
              className="glass-panel p-6 sm:p-8 rounded-3xl border space-y-6 shadow-2xl relative transition-all duration-300"
              style={{
                borderColor: current.color + "50",
                boxShadow: `0 0 45px ${current.accentBg}, inset 0 0 25px ${current.accentBg}`,
              }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.12)] pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-xl border"
                    style={{ backgroundColor: current.accentBg, borderColor: current.color }}
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
                      {current.badge}
                    </span>
                    <h3
                      style={{ fontFamily: "var(--font-display)" }}
                      className="text-2xl sm:text-3xl font-semibold italic text-[#f5f0e8]"
                    >
                      {current.name} Review Console
                    </h3>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-[#9a9280] block text-[10px]">CONFIDENCE</span>
                  <span className="text-[#7ee08a] font-bold">
                    {(current.sampleAnnotation.confidence * 100).toFixed(0)}% Certainty
                  </span>
                </div>
              </div>

              {/* Persona Focus Statement */}
              <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#d4c49a] italic leading-relaxed">
                &ldquo;{current.focus}&rdquo;
              </p>

              {/* Live Annotation Preview Box */}
              <div className="bg-[#080800] p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.1)] pb-2.5">
                  <span className="text-[#f5f0e8] font-bold flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" style={{ color: current.color }} />
                    Audit Subject: {current.sampleAnnotation.issue}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded font-bold uppercase text-[10px]"
                    style={{ color: current.color, backgroundColor: current.accentBg }}
                  >
                    {current.sampleAnnotation.verdict}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[#9a9280] text-[10px] uppercase font-bold block">Editorial Rationale</span>
                    <p style={{ fontFamily: "var(--font-body)" }} className="text-[#f5f0e8] text-sm italic pt-0.5">
                      {current.sampleAnnotation.rationale}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[rgba(242,202,80,0.1)]">
                    <span className="text-[#7ee08a] text-[10px] uppercase font-bold block flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Recommended Surgical Action
                    </span>
                    <p style={{ fontFamily: "var(--font-body)" }} className="text-[#d4c49a] text-xs italic pt-0.5">
                      {current.sampleAnnotation.action}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-[#9a9280]">
                  <span>Evidence Citations:</span>
                  {current.sampleAnnotation.citations.map((cite) => (
                    <span key={cite} className="bg-[#141408] px-2 py-0.5 rounded border border-[rgba(242,202,80,0.15)] text-[#f2ca50]">
                      {cite}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#9a9280] font-mono flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-[#f2ca50]" />
                  <span>Structured Consensus Agreement: 4/5 Personas Aligned</span>
                </span>

                {onOpenCollaboration && (
                  <button
                    onClick={onOpenCollaboration}
                    className="gold-button px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
                  >
                    <span>Launch Full Writers Room</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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
