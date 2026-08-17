"use client";

import React, { useState } from "react";
import {
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Eye,
  Clock,
  Zap,
  Radio,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { MotionCard } from "./MotionCard";

interface LokiTimelineGraphProps {
  className?: string;
}

export const LokiTimelineGraph: React.FC<LokiTimelineGraphProps> = ({ className = "" }) => {
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);

  return (
    <MotionCard glowColor="rgba(242,202,80,0.45)">
      <div className={`glass-panel-hero rounded-2xl p-5 relative overflow-hidden border-2 border-[#d4af37] bg-[#080802] ${className}`}>
        {/* Retro TVA Monitor Bezel Chrome Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[rgba(242,202,80,0.22)] pb-3 mb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5c4d] shadow-[0_0_10px_rgba(255,92,77,0.8)]" />
            <div className="h-3 w-3 rounded-full bg-[#ffb347] shadow-[0_0_10px_rgba(255,179,71,0.8)]" />
            <div className="h-3 w-3 rounded-full bg-[#7ee08a] shadow-[0_0_10px_rgba(126,224,138,0.8)]" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#141408] px-3.5 py-1 rounded-full border border-[rgba(242,202,80,0.4)] shadow-[0_0_15px_rgba(242,202,80,0.25)]">
              <Radio className="h-3.5 w-3.5 text-[#7ee08a] animate-pulse" />
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#f2ca50] font-bold uppercase"
              >
                TVA TEMPORAL MULTIVERSE LOOM • YGGDRASIL MATRIX
              </span>
            </div>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-[#ff5c4d] font-bold bg-[#ff5c4d]/20 border border-[#ff5c4d]/50 px-2.5 py-0.5 rounded shadow-[0_0_10px_rgba(255,92,77,0.3)]"
            >
              <Zap className="h-3 w-3 animate-bounce" /> NEXUS VOLATILITY: ACTIVE
            </span>
          </div>
        </div>

        {/* TVA CRT Monitor Display Frame */}
        <div className="relative h-[500px] rounded-xl bg-[#040401] border-2 border-[rgba(242,202,80,0.3)] p-3 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.98)]">
          {/* Subtle CRT Scanlines & Ambient Light Pulse */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_50%,rgba(0,0,0,0.45)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.14)_0%,transparent_70%)] pointer-events-none" />

          {/* SVG BREATHTAKING LOKI YGGDRASIL MULTIVERSE LOOM GRAPH */}
          <svg className="absolute inset-0 w-full h-full fill-none pointer-events-none z-0">
            <defs>
              <linearGradient id="sacredCoreGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#fff8dc" stopOpacity="1" />
                <stop offset="70%" stopColor="#ffd966" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#f2ca50" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="greenPayoffGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd966" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#7ee08a" stopOpacity="1" />
                <stop offset="100%" stopColor="#40c057" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="redNexusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f2ca50" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#ff5c4d" stopOpacity="1" />
                <stop offset="100%" stopColor="#ff1a00" stopOpacity="0.9" />
              </linearGradient>

              <filter id="glowWhite" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Baseline Grid */}
            <line x1="2%" y1="50%" x2="98%" y2="50%" stroke="rgba(242,202,80,0.12)" strokeWidth="1" strokeDasharray="4 4" />

            {/* ── PARALLEL TVA RED BOUNDARY LINES (Nexus Threshold Limits) ── */}
            {/* Upper Red Boundary Line */}
            <line x1="2%" y1="18%" x2="98%" y2="18%" stroke="#ff5c4d" strokeWidth="2.5" opacity="0.85" filter="url(#glowRed)" />
            <line x1="2%" y1="18%" x2="98%" y2="18%" stroke="rgba(255,92,77,0.4)" strokeWidth="7" />
            <text x="30" y="74" fill="#ff5c4d" fontSize="9" fontFamily="var(--font-mono)" fontWeight="bold" opacity="0.9">
              UPPER NEXUS BOUNDARY LINE
            </text>

            {/* Lower Red Boundary Line */}
            <line x1="2%" y1="82%" x2="98%" y2="82%" stroke="#ff5c4d" strokeWidth="2.5" opacity="0.85" filter="url(#glowRed)" />
            <line x1="2%" y1="82%" x2="98%" y2="82%" stroke="rgba(255,92,77,0.4)" strokeWidth="7" />
            <text x="30" y="400" fill="#ff5c4d" fontSize="9" fontFamily="var(--font-mono)" fontWeight="bold" opacity="0.9">
              LOWER NEXUS BOUNDARY LINE
            </text>

            {/* ── BREATHTAKING ORGANIC YGGDRASIL BRANCHING TREE ── */}

            {/* 1. GREEN PROTECTED PAYOFF LOOP (Ep 47 Setup -> Loom Core -> Ep 218 Payoff) */}
            <path
              d="M 65,240 C 110,130 180,70 300,240 C 420,410 490,140 550,110"
              stroke="url(#greenPayoffGradient)"
              strokeWidth="3.5"
              filter="url(#glowGreen)"
              className="animate-branch-glow"
            />
            <path
              d="M 65,240 C 110,130 180,70 300,240 C 420,410 490,140 550,110"
              stroke="rgba(126,224,138,0.3)"
              strokeWidth="8"
            />

            {/* 2. RED NEXUS EVENT VOLATILE BRANCH (Ep 84 Contradiction Crossing Red Line) */}
            <path
              d="M 120,240 C 180,360 220,420 300,240 C 370,80 430,30 510,75"
              stroke="url(#redNexusGradient)"
              strokeWidth="3.8"
              filter="url(#glowRed)"
              className="animate-nexus-flare"
            />
            <path
              d="M 120,240 C 180,360 220,420 300,240 C 370,80 430,30 510,75"
              stroke="rgba(255,92,77,0.35)"
              strokeWidth="9"
            />

            {/* 3. SACRED TIMELINE SWEEPING BRANCHES (Gold/Cyan Yggdrasil Tendrils) */}
            {/* Upper Gold Tendril A */}
            <path
              d="M 300,240 C 360,150 430,90 530,140"
              stroke="#ffd966"
              strokeWidth="2.2"
              filter="url(#glowWhite)"
            />
            {/* Upper Cyan Tendril B */}
            <path
              d="M 180,140 C 230,95 280,60 360,50"
              stroke="#7ee08a"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="animate-branch-sprout animate-dash-flow"
            />
            {/* Lower Gold Tendril C */}
            <path
              d="M 300,240 C 350,330 420,410 500,430"
              stroke="#ffd966"
              strokeWidth="2.4"
              filter="url(#glowWhite)"
            />
            {/* Lower Red Sub-Branch D (Sprouting into Lower Red Line) */}
            <path
              d="M 210,320 C 260,380 320,430 410,440"
              stroke="#ff5c4d"
              strokeWidth="2.2"
              strokeDasharray="5 5"
              className="animate-nexus-flare animate-dash-flow"
            />
            {/* Upper Red Sub-Branch E (Sprouting into Upper Red Line) */}
            <path
              d="M 390,95 C 440,40 480,20 540,15"
              stroke="#ff1a00"
              strokeWidth="2.2"
              strokeDasharray="5 5"
              className="animate-nexus-flare animate-dash-flow"
            />

            {/* 4. CENTRAL SACRED TIMELINE TRUNK (Undulating Glowing Energy Core) */}
            <path
              d="M 10,240 Q 150,235 300,240 T 590,240"
              stroke="url(#sacredCoreGlow)"
              strokeWidth="5"
              filter="url(#glowWhite)"
              className="animate-branch-glow"
            />
            <path
              d="M 10,240 Q 150,235 300,240 T 590,240"
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Animated Energy Signal Particle Streams */}
            <path
              d="M 65,240 C 110,130 180,70 300,240 C 420,410 490,140 550,110"
              stroke="#ffd966"
              strokeWidth="2"
              strokeDasharray="10 14"
              className="animate-dash-flow"
            />
            <path
              d="M 120,240 C 180,360 220,420 300,240 C 370,80 430,30 510,75"
              stroke="#ff5c4d"
              strokeWidth="2"
              strokeDasharray="8 12"
              className="animate-dash-flow"
            />

            {/* ── JUNCTION BEACON NODES (Glowing Red Line Breach & Payoff Dots) ── */}
            <circle cx="65" cy="240" r="4" fill="#ffb347" />
            <circle cx="120" cy="240" r="4" fill="#ff5c4d" className="animate-ping" />
            <circle cx="205" cy="415" r="4.5" fill="#ff5c4d" className="animate-ping" />
            <circle cx="455" cy="50" r="4.5" fill="#ff1a00" className="animate-ping" />
            <circle cx="550" cy="110" r="4" fill="#7ee08a" />

            {/* TVA Watermark Tag */}
            <text x="545" y="460" fill="#f2ca50" fontSize="12" fontFamily="var(--font-mono)" fontWeight="900" opacity="0.6">
              TVA
            </text>
          </svg>

          {/* Central TVA Loom Core Beacon Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center pointer-events-auto">
            <div className="relative group cursor-pointer">
              <div className="h-14 w-14 rounded-full bg-[#070703] border-2 border-[#f2ca50] mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(242,202,80,0.85)] animate-node-beacon">
                <GitBranch className="h-6.5 w-6.5 text-[#f2ca50] group-hover:rotate-45 transition-transform duration-500" />
              </div>
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#7ee08a] border-2 border-[#070703] animate-pulse" />
            </div>
            <span style={{ fontFamily: "var(--font-mono)" }} className="mt-1 text-[9px] tracking-[0.2em] text-[#f2ca50] font-bold uppercase block shadow-sm">
              <Sparkles className="h-3 w-3 inline text-[#f2ca50] mr-1" />
              LOOM CORE
            </span>
          </div>

          {/* ── SLEEK FLOATING TVA BADGES (Positioned Cleanly Without Overlap) ── */}
          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-30 pointer-events-none">
            {/* Badge 1: Ep 47 Setup (Top Left) */}
            <div
              onMouseEnter={() => setActiveHoverNode("ep47")}
              onMouseLeave={() => setActiveHoverNode(null)}
              className={`pointer-events-auto transition-all cursor-pointer ${
                activeHoverNode === "ep47" ? "scale-105" : ""
              }`}
            >
              <div className="flex items-center gap-2 bg-[#070703]/95 px-3 py-1 rounded-full border border-[#ffb347] shadow-[0_0_15px_rgba(255,179,71,0.35)] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#ffb347] animate-ping" />
                <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#ffb347] font-bold">
                  Ep 47 Setup: <em className="not-italic text-[#f5f0e8]">Poison Toxin</em>
                </span>
              </div>
            </div>

            {/* Badge 2: Ep 218 Payoff (Top Right) */}
            <div
              onMouseEnter={() => setActiveHoverNode("ep218")}
              onMouseLeave={() => setActiveHoverNode(null)}
              className={`pointer-events-auto transition-all cursor-pointer ${
                activeHoverNode === "ep218" ? "scale-105" : ""
              }`}
            >
              <div className="flex items-center gap-2 bg-[#070703]/95 px-3 py-1 rounded-full border border-[#7ee08a] shadow-[0_0_15px_rgba(126,224,138,0.35)] backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-[#7ee08a]" />
                <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#7ee08a] font-bold">
                  Ep 218 Payoff: <em className="not-italic text-[#f5f0e8]">Antidote Verified</em>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Floating Badges — Dedicated Flex Container (Guaranteed No Overlap) */}
          <div className="absolute bottom-[85px] left-3 right-3 flex justify-between items-center z-30 pointer-events-none">
            {/* Badge 3: Ep 84 Nexus Breach (Bottom Left) */}
            <div
              onMouseEnter={() => setActiveHoverNode("ep84")}
              onMouseLeave={() => setActiveHoverNode(null)}
              className={`pointer-events-auto transition-all cursor-pointer ${
                activeHoverNode === "ep84" ? "scale-105" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 bg-[#070703]/95 px-3 py-1 rounded-full border border-[#ff5c4d] shadow-[0_0_18px_rgba(255,92,77,0.45)] backdrop-blur-md">
                <AlertTriangle className="h-3.5 w-3.5 text-[#ff5c4d] animate-bounce" />
                <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#ff5c4d] font-bold">
                  Ep 84 Red Line Breach
                </span>
                <span className="text-[8px] bg-[#ff5c4d]/30 text-[#ff5c4d] px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                  NEXUS
                </span>
              </div>
            </div>

            {/* Badge 4: Payoff Protection Status (Bottom Right) */}
            <div
              onMouseEnter={() => setActiveHoverNode("twists")}
              onMouseLeave={() => setActiveHoverNode(null)}
              className={`pointer-events-auto transition-all cursor-pointer ${
                activeHoverNode === "twists" ? "scale-105" : ""
              }`}
            >
              <div className="flex items-center gap-2 bg-[#070703]/95 px-3 py-1 rounded-full border border-[rgba(242,202,80,0.45)] shadow-[0_0_15px_rgba(242,202,80,0.35)] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#7ee08a]" />
                <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#7ee08a] font-bold">
                  5 Twists Protected
                </span>
              </div>
            </div>
          </div>

          {/* Bottom TVA Status Bar */}
          <div className="relative z-30 flex flex-wrap items-center justify-between glass-panel p-2.5 rounded-lg border border-[rgba(242,202,80,0.25)] mt-auto gap-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#7ee08a] animate-pulse" />
              <span style={{ fontFamily: "var(--font-body)" }} className="text-xs font-semibold text-[#f5f0e8] italic">
                74.2% Continuation CI
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px]">
              <span className="text-[#ff5c4d] font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff5c4d] animate-ping" />
                6 Red Line Breaches
              </span>
              <span className="text-[#7ee08a] font-bold">5 Twists Safe</span>
              <span className="text-[#f2ca50] font-bold hidden sm:inline">98.4% TVA Loom Stability</span>
            </div>
          </div>
        </div>
      </div>
    </MotionCard>
  );
};

export default LokiTimelineGraph;
