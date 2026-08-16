"use client";

import React, { useState } from "react";
import { FileText, Cpu, Network } from "lucide-react";
import { D3TopologyGraph, NodeData, LinkData } from "./D3TopologyGraph";

export const GraphEngineView: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<"true" | "perceived">("true");
  const [selectedNode, setSelectedNode] = useState<NodeData | null>({
    id: "EP02_SC83_N16",
    name: "Raj Infiltrating",
    type: "CHARACTER_STATE",
    color: "#7ee08a",
    glowColor: "rgba(126,224,138,0.6)",
    status: "UNCONSCIOUS",
    attributes: { character: "Raj", status: "UNCONSCIOUS", location_id: "LOC_MUM_B4" },
    layer_indices: { true_time: 1402, presentation_idx: 28 },
  });
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);

  const handleSelectNode = (node: NodeData) => {
    setSelectedNode(node);
    setSelectedLink(null);
  };

  const handleSelectLink = (link: LinkData) => {
    setSelectedLink(link);
  };

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
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold">
                TOPOLOGY VIEWER (D3 FORCE GRAPH)
              </span>
              <span className="text-[9px] font-mono text-[#7ee08a] bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded font-bold">
                INTERACTIVE
              </span>
            </div>

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

          {/* Interactive D3 Topology Graph Visualizer */}
          <D3TopologyGraph
            activeLayer={activeLayer}
            selectedNodeId={selectedNode?.id || ""}
            onSelectNode={handleSelectNode}
            onSelectLink={handleSelectLink}
          />
          <p className="text-[11px] text-[#9a9280] italic font-mono flex items-center justify-between">
            <span>💡 Click and drag any node to reposition. Scroll/Pinch to zoom. Click node to inspect Delta schema.</span>
          </p>
        </div>

        {/* Right Column: Schema Inspector & Edge Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delta Lake Schema Inspector */}
          <div className="glass-panel rounded-2xl p-5 border border-[rgba(242,202,80,0.15)] space-y-3">
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block">
                DELTA LAKE SCHEMA INSPECTOR
              </span>
              {selectedNode && (
                <span className="text-[10px] font-mono text-[#f2ca50] bg-[rgba(242,202,80,0.1)] px-2 py-0.5 rounded border border-[rgba(242,202,80,0.2)]">
                  Node: {selectedNode.name}
                </span>
              )}
            </div>

            <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.1)] font-mono text-[11px] text-[#9a9280] space-y-1 overflow-x-auto min-h-[160px]">
              {selectedNode ? (
                <>
                  <p className="text-[#f5f0e8] font-semibold">&#123;</p>
                  <p className="pl-4">
                    <span className="text-[#ff5c4d]">&quot;node_id&quot;</span>: <span className="text-[#ffb347]">&quot;{selectedNode.id}&quot;</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#ff5c4d]">&quot;type&quot;</span>: <span className="text-[#ffb347]">&quot;{selectedNode.type}&quot;</span>,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#ff5c4d]">&quot;attributes&quot;</span>: &#123;{" "}
                    {Object.entries(selectedNode.attributes).map(([key, val], idx, arr) => (
                      <span key={key}>
                        <span className="text-[#7ee08a]">&quot;{key}&quot;</span>: <span className="text-[#f2ca50]">&quot;{String(val)}&quot;</span>
                        {idx < arr.length - 1 ? ", " : " "}
                      </span>
                    ))}
                    &#125;,
                  </p>
                  <p className="pl-4">
                    <span className="text-[#ff5c4d]">&quot;layer_indices&quot;</span>: &#123;{" "}
                    <span className="text-[#7ee08a]">&quot;true_time&quot;</span>: <span className="text-[#7ee08a]">{selectedNode.layer_indices.true_time}</span>,{" "}
                    <span className="text-[#7ee08a]">&quot;presentation_idx&quot;</span>: <span className="text-[#7ee08a]">{selectedNode.layer_indices.presentation_idx}</span> &#125;
                  </p>
                  <p className="text-[#f5f0e8] font-semibold">&#125;</p>
                </>
              ) : (
                <div className="text-center text-[#9a9280] py-8">Select a node in the D3 graph to inspect schema</div>
              )}
            </div>
          </div>

          {/* Active Edge Analysis */}
          <div className="glass-panel rounded-2xl p-5 border border-[rgba(242,202,80,0.15)] space-y-3">
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block">
              ACTIVE EDGE ANALYSIS {activeLayer === "true" ? "(G_TRUE)" : "(G_PERCEIVED)"}
            </span>

            <div className="space-y-2.5 font-mono text-xs">
              {/* Edge 1 */}
              <div className={`bg-[#080800] p-3 rounded-xl border transition-all ${selectedLink?.id === "EDGE_EP02_EP26_01" ? "border-[#ff5c4d] shadow-[0_0_12px_rgba(255,92,77,0.3)]" : "border-[rgba(255,92,77,0.2)]"}`}>
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f0e8] font-bold text-[11px]">EDGE_EP02_EP26_01</span>
                  <span className="text-[#ff5c4d] bg-[rgba(255,92,77,0.15)] px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    SUSPENDED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9a9280] mt-1">
                  <span>Type: CAUSAL_LINK</span>
                  <span className="text-[#ff5c4d] font-bold">Broken Path</span>
                </div>
              </div>

              {/* Edge 2 */}
              <div className={`bg-[#080800] p-3 rounded-xl border transition-all ${selectedLink?.id === "EDGE_EP02_EP86_04" ? "border-[#7ee08a] shadow-[0_0_12px_rgba(126,224,138,0.3)]" : "border-[rgba(126,224,138,0.2)]"}`}>
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f0e8] font-bold text-[11px]">EDGE_EP02_EP86_04</span>
                  <span className="text-[#7ee08a] bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    VERIFIED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9a9280] mt-1">
                  <span>Type: PLANT_PAYOFF</span>
                  <span className="text-[#7ee08a] font-bold">is_protected: true</span>
                </div>
              </div>

              {/* Edge 3 */}
              <div className={`bg-[#080800] p-3 rounded-xl border transition-all ${selectedLink?.id === "EDGE_EP02_EP88_04" ? "border-[#7ee08a] shadow-[0_0_12px_rgba(126,224,138,0.3)]" : "border-[rgba(126,224,138,0.2)]"}`}>
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f0e8] font-bold text-[11px]">EDGE_EP02_EP88_04</span>
                  <span className="text-[#7ee08a] bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                    VERIFIED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9a9280] mt-1">
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
