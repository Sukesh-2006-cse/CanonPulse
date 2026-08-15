"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export const ComparisonTableSection: React.FC = () => {
  const rows = [
    {
      feature: "Dual-Layer Graph (Audience Time vs Story Time)",
      canonPulse: true,
      llm: false,
      manual: false,
    },
    {
      feature: "Protected Twist Resolution (Setup Payoff Verification)",
      canonPulse: true,
      llm: false,
      manual: false,
    },
    {
      feature: "Exact Page & Episode Evidence Citations",
      canonPulse: true,
      llm: false,
      manual: true,
    },
    {
      feature: "Deterministic Graph Traversal (100% Reproducible)",
      canonPulse: true,
      llm: false,
      manual: true,
    },
    {
      feature: "Surgical Repair Attribution & Edit Simulation",
      canonPulse: true,
      llm: false,
      manual: false,
    },
    {
      feature: "Scales to 300+ Episodes without Context Window Loss",
      canonPulse: true,
      llm: false,
      manual: false,
    },
  ];

  return (
    <section className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.1)] bg-[#080800]/40 overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[500px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.18)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 space-y-14">
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-[0.28em] text-[#f2ca50] uppercase">
              EDITORIAL MATRIX
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Why traditional tools
              <br />
              <em className="italic text-[#d4c49a]">fail narrative canon.</em>
            </h2>
          </div>
        </ScrollReveal>

        {/* High-Density Editorial Glass Comparison Table */}
        <ScrollReveal direction="up" delay={150}>
          <div className="glass-panel-gold rounded-2xl p-6 sm:p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(242,202,80,0.2)]">
                  <th style={{ fontFamily: "var(--font-mono)" }} className="pb-4 text-xs text-[#9a9280] uppercase tracking-wider">
                    Continuity Capability
                  </th>
                  <th style={{ fontFamily: "var(--font-display)" }} className="pb-4 text-center text-lg font-semibold text-[#f2ca50] italic px-4">
                    CanonPulse
                  </th>
                  <th style={{ fontFamily: "var(--font-mono)" }} className="pb-4 text-center text-xs text-[#9a9280] uppercase tracking-wider px-4">
                    Naive LLM Prompts
                  </th>
                  <th style={{ fontFamily: "var(--font-mono)" }} className="pb-4 text-center text-xs text-[#9a9280] uppercase tracking-wider px-4">
                    Manual Series Wiki
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(242,202,80,0.08)]">
                {rows.map((row) => (
                  <tr key={row.feature} className="hover:bg-[rgba(242,202,80,0.03)] transition-colors">
                    <td style={{ fontFamily: "var(--font-body)" }} className="py-4 text-sm text-[#f5f0e8] italic pr-4">
                      {row.feature}
                    </td>
                    <td className="py-4 text-center px-4">
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(126,224,138,0.15)] text-[#7ee08a] border border-[rgba(126,224,138,0.4)]">
                        <Check className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="py-4 text-center px-4">
                      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,92,77,0.1)] text-[#ff5c4d]/60 border border-[rgba(255,92,77,0.2)]">
                        <X className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="py-4 text-center px-4">
                      {row.manual ? (
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,179,71,0.15)] text-[#ffb347] border border-[rgba(255,179,71,0.3)]">
                          <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] font-bold">Partial</span>
                        </div>
                      ) : (
                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,92,77,0.1)] text-[#ff5c4d]/60 border border-[rgba(255,92,77,0.2)]">
                          <X className="h-4 w-4" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
