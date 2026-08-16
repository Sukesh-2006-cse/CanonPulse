"use client";

import React from "react";
import { Search, ShieldAlert, ShieldCheck, Clock, Activity, Database, FileText } from "lucide-react";

export const OverviewView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.12)] pb-4">
        <div>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-3xl font-semibold italic text-[#f5f0e8]"
          >
            Continuity Assessment Overview
          </h1>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-sm text-[#9a9280] italic mt-1"
          >
            Dual-layer ledger metrics (G_perceived × G_true) scored across 220 episodes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#f2ca50] bg-[rgba(242,202,80,0.08)] border border-[rgba(242,202,80,0.25)] px-3 py-1.5 rounded-full w-fit">
          <span className="h-2 w-2 rounded-full bg-[#7ee08a] animate-pulse" />
          <span>LIVE ENGINE SYNC</span>
        </div>
      </div>

      {/* Main Grid: Left Assessment Engine (col-span-8), Right Metrics (col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Continuity Assessment Engine */}
        <div className="lg:col-span-8 glass-panel-gold rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.12)] pb-4 mb-6">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-2xl font-semibold italic text-[#f5f0e8]"
            >
              Continuity Assessment Engine
            </h2>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] tracking-widest text-[#f2ca50] bg-[#141408] border border-[rgba(242,202,80,0.3)] px-3 py-1 rounded-sm uppercase font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(242,202,80,0.15)]"
            >
              <Activity className="h-3 w-3 text-[#7ee08a] animate-pulse" />
              LIVE ANALYSIS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Baseline Checker Panel */}
            <div className="bg-[#080800]/90 border border-[rgba(242,202,80,0.1)] rounded-xl p-5 space-y-4">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block"
              >
                BASELINE CHECKER
              </span>

              <div className="bg-[#141408] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 font-mono text-xs text-[#9a9280] space-y-2.5">
                <div className="flex items-center gap-2 text-[#d4c49a] font-semibold border-b border-[rgba(255,255,255,0.05)] pb-2 mb-2">
                  <Search className="h-3.5 w-3.5 text-[#9a9280]" />
                  <span>BASIC STRING MATCH</span>
                </div>
                <p className="flex items-center gap-1.5 text-[#9a9280]">
                  <span className="text-[#f2ca50]">&gt;</span> Character names verified.
                </p>
                <p className="flex items-center gap-1.5 text-[#9a9280]">
                  <span className="text-[#f2ca50]">&gt;</span> Locations matched.
                </p>
                <p className="flex items-center gap-1.5 text-[#ff5c4d] font-semibold">
                  <span className="text-[#ff5c4d]">&gt;</span> Critical subtext ignored.
                </p>
              </div>
            </div>

            {/* CanonPulse Deep Read Panel */}
            <div className="bg-[#080800]/90 border border-[rgba(242,202,80,0.2)] rounded-xl p-5 space-y-4 shadow-[0_0_20px_rgba(242,202,80,0.05)]">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#f2ca50] uppercase font-semibold block"
              >
                CANONPULSE DEEP READ
              </span>

              <div className="space-y-3 font-mono text-xs">
                {/* Plot Holes */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,92,77,0.06)] border border-[rgba(255,92,77,0.25)] transition-all hover:bg-[rgba(255,92,77,0.1)]">
                  <div className="flex items-center gap-2.5 text-[#ff5c4d]">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="font-semibold uppercase tracking-wider text-[11px]">PLOT HOLES</span>
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-xl font-bold text-[#ff5c4d]"
                  >
                    3
                  </span>
                </div>

                {/* Protected Twists */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(126,224,138,0.06)] border border-[rgba(126,224,138,0.25)] transition-all hover:bg-[rgba(126,224,138,0.1)]">
                  <div className="flex items-center gap-2.5 text-[#7ee08a]">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="font-semibold uppercase tracking-wider text-[11px]">PROTECTED TWISTS</span>
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-xl font-bold text-[#7ee08a]"
                  >
                    12
                  </span>
                </div>

                {/* Overdue Obligations */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,179,71,0.06)] border border-[rgba(255,179,71,0.25)] transition-all hover:bg-[rgba(255,179,71,0.1)]">
                  <div className="flex items-center gap-2.5 text-[#ffb347]">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold uppercase tracking-wider text-[11px]">OVERDUE OBLIGATIONS</span>
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-xl font-bold text-[#ffb347]"
                  >
                    7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Analytical Metrics */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Predicted Continuation */}
          <div className="glass-panel rounded-2xl p-6 space-y-4 border border-[rgba(242,202,80,0.2)]">
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block"
            >
              PREDICTED CONTINUATION
            </span>

            <div>
              <div className="flex items-baseline gap-2">
                <span
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-5xl font-semibold text-[#f5f0e8]"
                >
                  84%
                </span>
                <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280]">
                  ± 3% CI
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#141408] h-2 rounded-full mt-3 overflow-hidden border border-[rgba(242,202,80,0.15)]">
                <div className="bg-gradient-to-r from-[#e8a820] via-[#f2ca50] to-[#7ee08a] h-full w-[84%] rounded-full shadow-[0_0_12px_rgba(242,202,80,0.5)]" />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-mono text-[#9a9280] pt-1">
              <span>Confidence Interval:</span>
              <span className="text-[#7ee08a] font-semibold uppercase">High</span>
            </div>
          </div>

          {/* Card 2: Data Traversal */}
          <div className="glass-panel rounded-2xl p-6 space-y-4 border border-[rgba(242,202,80,0.15)]">
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block"
            >
              DATA TRAVERSAL
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#080800]/80 p-3.5 rounded-xl border border-[rgba(242,202,80,0.1)]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9a9280] uppercase mb-1">
                  <Database className="h-3 w-3 text-[#f2ca50]" />
                  <span>Ledger (Graph)</span>
                </div>
                <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-semibold text-[#f5f0e8]">
                  4,209
                </p>
                <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] mt-0.5">
                  Nodes verified
                </p>
              </div>

              <div className="bg-[#080800]/80 p-3.5 rounded-xl border border-[rgba(242,202,80,0.1)]">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#9a9280] uppercase mb-1">
                  <FileText className="h-3 w-3 text-[#7ee08a]" />
                  <span>End-to-End (Raw)</span>
                </div>
                <p style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-semibold text-[#f5f0e8]">
                  1.2M
                </p>
                <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] mt-0.5">
                  Words scanned
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
