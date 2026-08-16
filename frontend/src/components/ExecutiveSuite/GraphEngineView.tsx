"use client";

import React, { useState } from "react";
import { FileText, Cpu, Network } from "lucide-react";

export const GraphEngineView: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<"true" | "perceived">("true");

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="border-b border-[rgba(242,202,80,0.12)] pb-4">
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-3xl font-semibold italic text-[#f5f0e8]"
        >
          Graph Engine: Narrative Topology Viewer
        </h1>
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-sm text-[#9a9280] italic mt-1"
        >
          Real-time dual-layer graph traversal across narrative state nodes and causal edges.
        </p>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.15)] space-y-1">
          <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] uppercase tracking-wider font-semibold block">
            NODES TRAVERSED
          </span>
          <p style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-[#f5f0e8]">
            14,208
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.15)] space-y-1">
          <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] uppercase tracking-wider font-semibold block">
            EDGES RESOLVED
          </span>
          <p style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-[#f5f0e8]">
            38,912
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.15)] space-y-1">
          <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280] uppercase tracking-wider font-semibold block">
            GRAPH DENSITY
          </span>
          <p style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-[#f5f0e8]">
            0.084
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-[rgba(255,92,77,0.3)] bg-[rgba(255,92,77,0.04)] space-y-1">
          <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#ff5c4d] uppercase tracking-wider font-semibold block">
            CONFLICTS DETECTED
          </span>
          <p style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-[#ff5c4d]">
            3
          </p>
        </div>
      </div>

      {/* Main Section: Topology Viewer (Left 7 cols) & Schema/Edges (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topology Viewer Canvas Panel (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-[rgba(242,202,80,0.2)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold">
              TOPOLOGY VIEWER
            </span>

            {/* Layer Toggles */}
            <div className="flex bg-[#080800] p-1 rounded-lg border border-[rgba(242,202,80,0.15)] font-mono text-[10px]">
              <button
                onClick={() => setActiveLayer("true")}
                className={`px-3 py-1 rounded transition-all font-bold ${
                  activeLayer === "true" ? "gold-button shadow-[0_0_12px_rgba(242,202,80,0.3)]" : "text-[#9a9280] hover:text-[#f5f0e8]"
                }`}
              >
                G_TRUE
              </button>
              <button
                onClick={() => setActiveLayer("perceived")}
                className={`px-3 py-1 rounded transition-all font-bold ${
                  activeLayer === "perceived" ? "gold-button shadow-[0_0_12px_rgba(242,202,80,0.3)]" : "text-[#9a9280] hover:text-[#f5f0e8]"
                }`}
              >
                G_PERCEIVED
              </button>
            </div>
          </div>

          {/* Interactive Topology Graph Visualizer */}
          <div className="relative h-[380px] w-full bg-[#080800] rounded-xl border border-[rgba(242,202,80,0.12)] p-6 overflow-hidden flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#9a9280" />
                </marker>
              </defs>

              {/* Connected Arrow Paths matching reference screenshot */}
              {/* Node 1 (Amber) -> Node 2 (Blue) */}
              <line x1="50%" y1="18%" x2="50%" y2="38%" stroke="#9a9280" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Node 2 (Blue) -> Node 3 (Green) */}
              <line x1="50%" y1="46%" x2="50%" y2="66%" stroke="#9a9280" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Node 3 (Green) -> Node 4 (Red) */}
              <line x1="50%" y1="74%" x2="62%" y2="88%" stroke="#9a9280" strokeWidth="1.5" markerEnd="url(#arrow)" />
              {/* Node 4 (Red) -> Node 5 (Purple) */}
              <line x1="66%" y1="86%" x2="78%" y2="70%" stroke="#9a9280" strokeWidth="1.5" markerEnd="url(#arrow)" />
            </svg>

            {/* Nodes Overlay matching screenshot layout */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-4">
              {/* Node 1: Amber */}
              <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110 cursor-pointer">
                <div className="h-9 w-9 rounded-full bg-[#f2ca50] shadow-[0_0_20px_rgba(242,202,80,0.6)] border-2 border-[#ffd966]" />
                <span style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#f5f0e8] font-medium italic">
                  Brass Keycard Damaged
                </span>
              </div>

              {/* Node 2: Blue */}
              <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110 cursor-pointer">
                <div className="h-9 w-9 rounded-full bg-[#4d94ff] shadow-[0_0_20px_rgba(77,148,255,0.6)] border-2 border-[#80b3ff]" />
                <span style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#f5f0e8] font-medium italic">
                  Vault B3 Breached
                </span>
              </div>

              {/* Node 3: Green */}
              <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110 cursor-pointer">
                <div className="h-9 w-9 rounded-full bg-[#7ee08a] shadow-[0_0_20px_rgba(126,224,138,0.6)] border-2 border-[#a3ebb0]" />
                <span style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#f5f0e8] font-medium italic">
                  Raj Infiltrating
                </span>
              </div>

              {/* Bottom Branch Nodes */}
              <div className="w-full flex justify-between px-16">
                {/* Node 4: Red */}
                <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110 cursor-pointer ml-auto mr-12">
                  <div className="h-9 w-9 rounded-full bg-[#ff5c4d] shadow-[0_0_20px_rgba(255,92,77,0.6)] border-2 border-[#ff8578]" />
                  <span style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#f5f0e8] font-medium italic">
                    Silver Cufflink
                  </span>
                </div>

                {/* Node 5: Purple */}
                <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110 cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-[#b366ff] shadow-[0_0_20px_rgba(179,102,255,0.6)] border-2 border-[#cc99ff]" />
                  <span style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#f5f0e8] font-medium italic">
                    Narrative Debt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schema Inspector & Edge Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delta Lake Schema Inspector */}
          <div className="glass-panel rounded-2xl p-5 border border-[rgba(242,202,80,0.15)] space-y-3">
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block">
              DELTA LAKE SCHEMA INSPECTOR
            </span>

            <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.1)] font-mono text-[11px] text-[#9a9280] space-y-1 overflow-x-auto">
              <p className="text-[#f5f0e8] font-semibold">
                &#123;
              </p>
              <p className="pl-4">
                <span className="text-[#ff5c4d]">&quot;node_id&quot;</span>: <span className="text-[#ffb347]">&quot;EP02_SC83_N14&quot;</span>,
              </p>
              <p className="pl-4">
                <span className="text-[#ff5c4d]">&quot;type&quot;</span>: <span className="text-[#ffb347]">&quot;CHARACTER_STATE&quot;</span>,
              </p>
              <p className="pl-4">
                <span className="text-[#ff5c4d]">&quot;attributes&quot;</span>: &#123; <span className="text-[#7ee08a]">&quot;character&quot;</span>: <span className="text-[#f2ca50]">&quot;Raj&quot;</span>, <span className="text-[#7ee08a]">&quot;status&quot;</span>: <span className="text-[#ff5c4d]">&quot;UNCONSCIOUS&quot;</span>, <span className="text-[#7ee08a]">&quot;location_id&quot;</span>: <span className="text-[#f2ca50]">&quot;LOC_MUM_B4&quot;</span> &#125;,
              </p>
              <p className="pl-4">
                <span className="text-[#ff5c4d]">&quot;layer_indices&quot;</span>: &#123; <span className="text-[#7ee08a]">&quot;true_time&quot;</span>: <span className="text-[#7ee08a]">1402</span>, <span className="text-[#7ee08a]">&quot;presentation_idx&quot;</span>: <span className="text-[#7ee08a]">28</span> &#125;
              </p>
              <p className="text-[#f5f0e8] font-semibold">
                &#125;
              </p>
            </div>
          </div>

          {/* Active Edge Analysis */}
          <div className="glass-panel rounded-2xl p-5 border border-[rgba(242,202,80,0.15)] space-y-3">
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block">
              ACTIVE EDGE ANALYSIS
            </span>

            <div className="space-y-2.5 font-mono text-xs">
              {/* Edge 1 */}
              <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(255,92,77,0.2)] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f0e8] font-bold text-[11px]">EDGE_EP02_EP26_01</span>
                  <span className="text-[#ff5c4d] bg-[rgba(255,92,77,0.15)] px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    SUSPENDED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9a9280]">
                  <span>Type: CAUSAL_LINK</span>
                  <span className="text-[#ff5c4d] font-bold">Broken Path</span>
                </div>
              </div>

              {/* Edge 2 */}
              <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(126,224,138,0.2)] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f0e8] font-bold text-[11px]">EDGE_EP02_EP86_04</span>
                  <span className="text-[#7ee08a] bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    VERIFIED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9a9280]">
                  <span>Type: PLANT_PAYOFF</span>
                  <span className="text-[#7ee08a] font-bold">is_protected: true</span>
                </div>
              </div>

              {/* Edge 3 */}
              <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(126,224,138,0.2)] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f0e8] font-bold text-[11px]">EDGE_EP02_EP88_04</span>
                  <span className="text-[#7ee08a] bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    VERIFIED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9a9280]">
                  <span>Type: PLANT_PAYOFF</span>
                  <span className="text-[#7ee08a] font-bold">is_protected: true</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transformation Pipeline (Full Width 12 cols) */}
        <div className="lg:col-span-12 glass-panel rounded-2xl p-6 border border-[rgba(242,202,80,0.15)] space-y-4">
          <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block">
            TRANSFORMATION PIPELINE
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Step 1 */}
            <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.15)] flex items-center justify-center gap-3 text-[#9a9280]">
              <FileText className="h-4 w-4 text-[#9a9280]" />
              <span>Raw Script Ingestion</span>
            </div>

            {/* Step 2 */}
            <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.15)] flex items-center justify-center gap-3 text-[#9a9280]">
              <Cpu className="h-4 w-4 text-[#9a9280]" />
              <span>Entity Extraction</span>
            </div>

            {/* Step 3 (Active) */}
            <div className="bg-[#141408] p-4 rounded-xl border-2 border-[#7ee08a] flex items-center justify-center gap-3 text-[#7ee08a] font-bold shadow-[0_0_20px_rgba(126,224,138,0.2)]">
              <Network className="h-4 w-4 text-[#7ee08a]" />
              <span>Dual-Layer Adjacency Mapping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
