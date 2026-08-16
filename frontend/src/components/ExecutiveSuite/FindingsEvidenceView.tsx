"use client";

import React, { useState } from "react";
import { ShieldAlert, ShieldCheck, Clock, ArrowRight, RefreshCw, FileText, CheckCircle2 } from "lucide-react";

interface Finding {
  id: string;
  type: "broken" | "suspended" | "outstanding";
  title: string;
  episode: string;
  span: string;
  reason: string;
  citation: string;
  repairAvailable?: boolean;
}

const DEMO_FINDINGS: Finding[] = [
  {
    id: "f1",
    type: "broken",
    title: "Unresolved Silver Amulet Origin",
    episode: "Ep 84",
    span: "134 episodes span",
    reason: "Amulet introduced in Ep 47 as ancient starlight metal is contradicted in Ep 84 as ordinary dark-iron.",
    citation: "Ep 84 line 412: 'He drew the dark-iron medallion from his coat, unbothered by its dull gray shine.'",
    repairAvailable: true,
  },
  {
    id: "f2",
    type: "suspended",
    title: "Poison Origin Toxin Setup",
    episode: "Ep 47 → Ep 218",
    span: "171 episodes span",
    reason: "Antidote recipe planted in Ep 47 is intentionally kept secret until Ep 218 revelation.",
    citation: "Ep 47 line 89: 'The rare orchid blooms only once every hundred winters in the northern pass.'",
    repairAvailable: false,
  },
  {
    id: "f3",
    type: "broken",
    title: "Missing Vault Key Transmission",
    episode: "Ep 102",
    span: "98 episodes span",
    reason: "Character B unlocks vault in Ep 102 without ever receiving key from Character A in Ep 60.",
    citation: "Ep 102 line 14: 'Character B inserted the brass key into the lock cylinder and turned it slowly.'",
    repairAvailable: true,
  },
  {
    id: "f4",
    type: "outstanding",
    title: "Overdue Oath of Silence",
    episode: "Ep 31",
    span: "Overdue by 40 episodes",
    reason: "Vow taken in Ep 31 remains unaddressed past the 150-episode narrative threshold.",
    citation: "Ep 31 line 204: 'I swear upon my house that this truth shall never cross my lips until the fall.'",
    repairAvailable: false,
  },
];

export const FindingsEvidenceView: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "broken" | "suspended" | "outstanding">("all");
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(DEMO_FINDINGS[0]);
  const [repairing, setRepairing] = useState(false);
  const [repaired, setRepaired] = useState(false);

  const filteredFindings = DEMO_FINDINGS.filter((f) => filter === "all" || f.type === filter);

  const handleRepair = () => {
    setRepairing(true);
    setTimeout(() => {
      setRepairing(false);
      setRepaired(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.12)] pb-4">
        <div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-3xl font-semibold italic text-[#f5f0e8]"
          >
            Findings & Evidence
          </h1>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-sm text-[#9a9280] italic mt-1"
          >
            Inspect continuity citations and execute minimal attribution repairs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Findings (11)" },
            { id: "broken", label: "Real Holes (6)", color: "#ff5c4d" },
            { id: "suspended", label: "Twists (5)", color: "#7ee08a" },
            { id: "outstanding", label: "Overdue (0)", color: "#ffb347" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id as typeof filter)}
              style={{ fontFamily: "var(--font-mono)" }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === item.id
                  ? "gold-button border border-[#ffd966]"
                  : "ghost-button"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Finding Cards List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              onClick={() => {
                setSelectedFinding(finding);
                setRepaired(false);
              }}
              className={`glass-panel p-5 rounded-xl cursor-pointer transition-all border-l-4 ${
                selectedFinding?.id === finding.id
                  ? "border-l-[#d4af37] border-t border-r border-b border-[rgba(212,175,55,0.4)] bg-[#141408]/60"
                  : finding.type === "broken"
                  ? "border-l-[#ff5c4d] hover:border-l-[#ff5c4d]"
                  : finding.type === "suspended"
                  ? "border-l-[#7ee08a] hover:border-l-[#7ee08a]"
                  : "border-l-[#ffb347] hover:border-l-[#ffb347]"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                    finding.type === "broken"
                      ? "text-[#ff5c4d] bg-[rgba(255,92,77,0.1)]"
                      : finding.type === "suspended"
                      ? "text-[#7ee08a] bg-[rgba(126,224,138,0.1)]"
                      : "text-[#ffb347] bg-[rgba(255,179,71,0.1)]"
                  }`}
                >
                  {finding.type === "broken"
                    ? "Real Plot Hole"
                    : finding.type === "suspended"
                    ? "Protected Twist"
                    : "Overdue Obligation"}
                </span>

                <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280]">
                  {finding.episode}
                </span>
              </div>

              <h3
                style={{ fontFamily: "var(--font-display)" }}
                className="text-lg font-semibold italic text-[#f5f0e8] mb-1"
              >
                {finding.title}
              </h3>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="text-xs text-[#9a9280] line-clamp-2"
              >
                {finding.reason}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] bg-[#7ee08a] text-[#080800] px-2 py-0.5 rounded font-extrabold"
                >
                  {finding.span}
                </span>
                <span className="text-xs text-[#f2ca50] flex items-center gap-1 font-mono">
                  View Evidence <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Citation & Simulated Repair Drawer (5 cols) */}
        <div className="lg:col-span-5">
          {selectedFinding ? (
            <div className="glass-panel-gold rounded-2xl p-6 space-y-5 border border-[rgba(242,202,80,0.3)] sticky top-24">
              <div className="flex items-center gap-2 text-xs font-mono text-[#f2ca50] border-b border-[rgba(242,202,80,0.15)] pb-3">
                <FileText className="h-4 w-4" />
                <span className="uppercase tracking-widest font-semibold">CITATION & EVIDENCE</span>
              </div>

              <div>
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-xl font-semibold italic text-[#f5f0e8]"
                >
                  {selectedFinding.title}
                </h3>
                <p style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#f2ca50] mt-1">
                  {selectedFinding.episode} ({selectedFinding.span})
                </p>
              </div>

              {/* Source Quote */}
              <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.15)] space-y-2">
                <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] uppercase tracking-wider block">
                  Source Citation
                </span>
                <blockquote style={{ fontFamily: "var(--font-body)" }} className="text-xs italic text-[#f5f0e8] border-l-2 border-[#7ee08a] pl-3 py-1">
                  &ldquo;{selectedFinding.citation}&rdquo;
                </blockquote>
              </div>

              {/* Simulated Repair Attribution */}
              {selectedFinding.repairAvailable && (
                <div className="bg-[#141408] p-4 rounded-xl border border-[rgba(126,224,138,0.25)] space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#7ee08a] uppercase font-bold tracking-wider">
                      Simulated Minimal Repair
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#7ee08a] font-bold">
                      +1.4% P(Continuation)
                    </span>
                  </div>

                  {!repaired ? (
                    <div className="space-y-3">
                      <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#9a9280] italic">
                        Replace line 412 in Ep 84 to state &ldquo;starlight amulet&rdquo; instead of &ldquo;dark-iron medallion&rdquo;.
                      </p>
                      <button
                        onClick={handleRepair}
                        disabled={repairing}
                        className="gold-button w-full py-2.5 rounded text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        {repairing ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Attributing Repair...</span>
                          </>
                        ) : (
                          <>
                            <span>Simulate Repair</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[rgba(126,224,138,0.1)] p-3 rounded-lg border border-[#7ee08a] text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-[#7ee08a] font-bold text-xs">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Repair Verified &amp; Attributed</span>
                      </div>
                      <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#d4c49a]">
                        Continuity graph re-indexed. 0 defects remaining for Ep 84.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl text-center text-[#9a9280] italic text-sm">
              Select a finding card to view source citations and evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
