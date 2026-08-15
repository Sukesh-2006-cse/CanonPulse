"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does CanonPulse differ from standard spellcheck or LLM proofreaders?",
      a: "Standard proofreaders analyze text linearly line-by-line or within a short context window. CanonPulse extracts claims, vows, and threats into a persistent dual-layer graph (G_perceived vs G_true), verifying setup-to-payoff links deterministically across up to 300 episodes.",
    },
    {
      q: "Will CanonPulse flag intentional plot twists as contradictions?",
      a: "No. That is CanonPulse's core breakthrough. Traditional checkers treat any inconsistency as a defect. CanonPulse checks whether downstream story-time evidence discharges the contradiction into a protected twist before declaring a defect.",
    },
    {
      q: "What format do I submit my series in?",
      a: "CanonPulse accepts plain text, Markdown, PDF, DOCX scripts, or structured JSON episode outlines. Files are automatically processed through the document ingestion pipeline.",
    },
    {
      q: "How are surgical repairs attributed?",
      a: "When you propose an edit to a defective episode hunk, CanonPulse runs a counterfactual graph simulation predicting the exact movement in storyline stability and unattributed debt percentage.",
    },
    {
      q: "Is my series manuscript secure and confidential?",
      a: "Yes. CanonPulse operates entirely offline in local mode or within enterprise-isolated Databricks Unity Catalog environments. Your unreleased story canon is never used to train public models.",
    },
  ];

  return (
    <section className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.1)] bg-[#080800]/40 overflow-hidden">
      <div className="absolute -bottom-10 -left-10 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.14)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 space-y-14">
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-[0.28em] text-[#f2ca50] uppercase">
              WRITERS&rsquo; ROOM FAQ
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Frequently asked
              <br />
              <em className="italic text-[#d4c49a]">questions.</em>
            </h2>
          </div>
        </ScrollReveal>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <ScrollReveal key={faq.q} direction="up" delay={idx * 100 + 100}>
                <div
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className={`glass-panel rounded-xl p-6 cursor-pointer transition-all duration-300 border ${
                    isOpen
                      ? "glass-panel-hero border-[#f2ca50]/40 shadow-[0_0_25px_rgba(242,202,80,0.15)]"
                      : "border-[rgba(242,202,80,0.12)] hover:border-[#f2ca50]/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg sm:text-xl font-semibold italic text-[#f5f0e8]">
                      {faq.q}
                    </h3>
                    <div className={`p-1.5 rounded-full bg-[#141408] border border-[rgba(242,202,80,0.2)] text-[#f2ca50] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-[rgba(242,202,80,0.1)] animate-fade-in-up">
                      <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#9a9280] leading-relaxed italic">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
