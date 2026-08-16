"use client";

import React, { useState } from "react";
import {
  FileText,
  Cpu,
  Network,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Search,
  Code2,
  Terminal,
  Activity
} from "lucide-react";
import { D3TopologyGraph, NodeData, LinkData } from "./D3TopologyGraph";

type PipelineStage = "ingestion" | "extraction" | "adjacency";

export const GraphEngineView: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<"true" | "perceived">("true");
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>("adjacency");
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
            <div className="flex bg-[#080800] p-1 rounded-lg border border-[rgba(212,175,55,0.3)] font-mono text-[10px]">
              <button
                type="button"
                onClick={() => setActiveLayer("true")}
                className={`px-3 py-1 rounded transition-all font-bold ${
                  activeLayer === "true" ? "gold-button border border-[#ffd966]" : "text-[#9a9280] hover:text-[#f5f0e8]"
                }`}
              >
                G_TRUE
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer("perceived")}
                className={`px-3 py-1 rounded transition-all font-bold ${
                  activeLayer === "perceived" ? "gold-button border border-[#ffd966]" : "text-[#9a9280] hover:text-[#f5f0e8]"
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
          <div className="glass-panel rounded-2xl p-5 border border-[rgba(212,175,55,0.3)] space-y-3">
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block">
                DELTA LAKE SCHEMA INSPECTOR
              </span>
              {selectedNode && (
                <span className="text-[10px] font-mono text-[#f2ca50] bg-[rgba(212,175,55,0.1)] px-2 py-0.5 rounded border border-[rgba(212,175,55,0.3)]">
                  Node: {selectedNode.name}
                </span>
              )}
            </div>

            <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(212,175,55,0.2)] font-mono text-[11px] text-[#9a9280] space-y-1 overflow-x-auto min-h-[160px]">
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
          <div className="glass-panel rounded-2xl p-5 border border-[rgba(212,175,55,0.3)] space-y-3">
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block">
              ACTIVE EDGE ANALYSIS {activeLayer === "true" ? "(G_TRUE)" : "(G_PERCEIVED)"}
            </span>

            <div className="space-y-2.5 font-mono text-xs">
              {/* Edge 1 */}
              <button
                type="button"
                onClick={() => setSelectedLink({ id: "EDGE_EP02_EP26_01", source: "EP02_SC83_N14", target: "EP02_SC83_N15", type: "CAUSAL_LINK", status: "SUSPENDED", statusText: "Broken Path" })}
                className={`w-full text-left bg-[#080800] p-3 rounded-xl border transition-all ${selectedLink?.id === "EDGE_EP02_EP26_01" ? "border-2 border-[#ff5c4d] bg-[#141408]" : "border-[rgba(255,92,77,0.25)] hover:border-[#ff5c4d]"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f0e8] font-bold text-[11px]">EDGE_EP02_EP26_01</span>
                  <span className="text-[#ff5c4d] bg-[rgba(255,92,77,0.15)] px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-[rgba(255,92,77,0.3)]">
                    SUSPENDED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9a9280] mt-1">
                  <span>Type: CAUSAL_LINK</span>
                  <span className="text-[#ff5c4d] font-bold">Broken Path</span>
                </div>
              </button>

              {/* Edge 2 */}
              <button
                type="button"
                onClick={() => setSelectedLink({ id: "EDGE_EP02_EP86_04", source: "EP02_SC83_N15", target: "EP02_SC83_N16", type: "PLANT_PAYOFF", status: "VERIFIED", statusText: "is_protected: true", is_protected: true })}
                className={`w-full text-left bg-[#080800] p-3 rounded-xl border transition-all ${selectedLink?.id === "EDGE_EP02_EP86_04" ? "border-2 border-[#7ee08a] bg-[#141408]" : "border-[rgba(126,224,138,0.25)] hover:border-[#7ee08a]"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f0e8] font-bold text-[11px]">EDGE_EP02_EP86_04</span>
                  <span className="text-[#7ee08a] bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-[rgba(126,224,138,0.3)]">
                    VERIFIED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9a9280] mt-1">
                  <span>Type: PLANT_PAYOFF</span>
                  <span className="text-[#7ee08a] font-bold">is_protected: true</span>
                </div>
              </button>

              {/* Edge 3 */}
              <button
                type="button"
                onClick={() => setSelectedLink({ id: "EDGE_EP02_EP88_04", source: "EP02_SC83_N16", target: "EP02_SC83_N17", type: "PLANT_PAYOFF", status: "VERIFIED", statusText: "is_protected: true", is_protected: true })}
                className={`w-full text-left bg-[#080800] p-3 rounded-xl border transition-all ${selectedLink?.id === "EDGE_EP02_EP88_04" ? "border-2 border-[#7ee08a] bg-[#141408]" : "border-[rgba(126,224,138,0.25)] hover:border-[#7ee08a]"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[#f5f0e8] font-bold text-[11px]">EDGE_EP02_EP88_04</span>
                  <span className="text-[#7ee08a] bg-[rgba(126,224,138,0.15)] px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-[rgba(126,224,138,0.3)]">
                    VERIFIED
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#9a9280] mt-1">
                  <span>Type: PLANT_PAYOFF</span>
                  <span className="text-[#7ee08a] font-bold">is_protected: true</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── TRANSFORMATION PIPELINE (Interactive 3-Step Pipeline) ── */}
        <div className="lg:col-span-12 glass-panel rounded-2xl p-6 border border-[rgba(212,175,55,0.3)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(212,175,55,0.15)] pb-3">
            <div>
              <span style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-widest text-[#f2ca50] uppercase font-semibold block">
                TRANSFORMATION PIPELINE
              </span>
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold italic text-[#f5f0e8]">
                Interactive Pipeline Stages
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#9a9280]">
              <span className="h-2 w-2 rounded-full bg-[#7ee08a] animate-pulse" />
              <span>STAGE {pipelineStage === "ingestion" ? "01/03" : pipelineStage === "extraction" ? "02/03" : "03/03"} ACTIVE</span>
            </div>
          </div>

          {/* Interactive Pipeline Action Buttons (Metallic Gold Border, No Glow) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Step 1: Raw Script Ingestion */}
            <button
              type="button"
              onClick={() => setPipelineStage("ingestion")}
              className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all cursor-pointer ${
                pipelineStage === "ingestion"
                  ? "bg-[#080800] border-[#d4af37] text-[#f2ca50] font-bold"
                  : "bg-[#080800] border-[rgba(212,175,55,0.25)] text-[#9a9280] hover:text-[#f5f0e8] hover:border-[#d4af37]"
              }`}
            >
              <FileText className={`h-4 w-4 ${pipelineStage === "ingestion" ? "text-[#d4af37]" : "text-[#9a9280]"}`} />
              <span>Raw Script Ingestion</span>
              {pipelineStage === "ingestion" && <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37]" />}
            </button>

            {/* Step 2: Entity Extraction */}
            <button
              type="button"
              onClick={() => setPipelineStage("extraction")}
              className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all cursor-pointer ${
                pipelineStage === "extraction"
                  ? "bg-[#080800] border-[#d4af37] text-[#f2ca50] font-bold"
                  : "bg-[#080800] border-[rgba(212,175,55,0.25)] text-[#9a9280] hover:text-[#f5f0e8] hover:border-[#d4af37]"
              }`}
            >
              <Cpu className={`h-4 w-4 ${pipelineStage === "extraction" ? "text-[#d4af37]" : "text-[#9a9280]"}`} />
              <span>Entity Extraction</span>
              {pipelineStage === "extraction" && <CheckCircle2 className="h-3.5 w-3.5 text-[#d4af37]" />}
            </button>

            {/* Step 3: Dual-Layer Adjacency Mapping */}
            <button
              type="button"
              onClick={() => setPipelineStage("adjacency")}
              className={`p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all cursor-pointer ${
                pipelineStage === "adjacency"
                  ? "bg-[#080800] border-[#d4af37] text-[#ffd966] font-bold"
                  : "bg-[#080800] border-[rgba(212,175,55,0.25)] text-[#9a9280] hover:text-[#f5f0e8] hover:border-[#d4af37]"
              }`}
            >
              <Network className={`h-4 w-4 ${pipelineStage === "adjacency" ? "text-[#ffd966]" : "text-[#9a9280]"}`} />
              <span>Dual-Layer Adjacency Mapping</span>
              {pipelineStage === "adjacency" && <CheckCircle2 className="h-3.5 w-3.5 text-[#ffd966]" />}
            </button>
          </div>

          {/* ── STAGE 01 CONTENT: Raw Script Ingestion Inspector ── */}
          {pipelineStage === "ingestion" && (
            <div className="bg-[#080800] border border-[rgba(242,202,80,0.3)] rounded-xl p-5 space-y-4 font-mono text-xs animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(242,202,80,0.15)] pb-3">
                <div className="flex items-center gap-2 text-[#f2ca50] font-bold">
                  <Terminal className="h-4 w-4" />
                  <span>PARSER PIPELINE: DOCLING &amp; SCREENPLAY AST</span>
                </div>
                <span className="text-[10px] text-[#7ee08a] bg-[#141408] px-2.5 py-1 rounded border border-[rgba(126,224,138,0.3)]">
                  Throughput: 8,450 tokens/sec
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[#9a9280]">
                <div className="bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.15)]">
                  <span className="text-[10px] uppercase text-[#f2ca50] block font-bold">AST Scene Chunker</span>
                  <p className="text-[#f5f0e8] mt-1">220 Episodes · 3,412 Scenes Parsed</p>
                  <span className="text-[10px] text-[#7ee08a]">Zero parse dropped tokens</span>
                </div>
                <div className="bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.15)]">
                  <span className="text-[10px] uppercase text-[#f2ca50] block font-bold">File Formats Supported</span>
                  <p className="text-[#f5f0e8] mt-1">Final Draft (.fdx), Fountain, PDF, TXT</p>
                  <span className="text-[10px] text-[#9a9280]">Automatic AST delimiter alignment</span>
                </div>
                <div className="bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.15)]">
                  <span className="text-[10px] uppercase text-[#f2ca50] block font-bold">Causal Timestamping</span>
                  <p className="text-[#f5f0e8] mt-1">Epoch index assigned to every line</p>
                  <span className="text-[10px] text-[#7ee08a]">100% Immutable Provenance</span>
                </div>
              </div>

              <div className="bg-[#141408] p-3.5 rounded-lg border border-[rgba(242,202,80,0.15)] text-[#d4c49a] space-y-1">
                <span className="text-[10px] text-[#9a9280] uppercase block font-bold">Live Stream Log (Episode 220):</span>
                <p className="text-xs text-[#7ee08a]">[PARSER_OK] Ingested &apos;The Crimson Solstice&apos; (3,420 words) in 38ms.</p>
                <p className="text-xs text-[#9a9280]">[AST_CHUNK] Created 14 Scene Boundaries &bull; Extracted 42 dialogue turns &bull; Tokenized 4,890 tokens.</p>
              </div>
            </div>
          )}

          {/* ── STAGE 02 CONTENT: Entity Extraction Inspector ── */}
          {pipelineStage === "extraction" && (
            <div className="bg-[#080800] border border-[rgba(242,202,80,0.3)] rounded-xl p-5 space-y-4 font-mono text-xs animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(242,202,80,0.15)] pb-3">
                <div className="flex items-center gap-2 text-[#f2ca50] font-bold">
                  <Cpu className="h-4 w-4" />
                  <span>NER &amp; NARRATIVE CLAIM EXTRACTION REGISTRY</span>
                </div>
                <span className="text-[10px] text-[#ffd966] bg-[#141408] px-2.5 py-1 rounded border border-[rgba(242,202,80,0.3)]">
                  488 Claims &bull; 99.2% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.2)]">
                  <span className="text-[10px] text-[#9a9280] uppercase block">Characters</span>
                  <span className="text-xl font-bold text-[#f5f0e8]">24 Tracked</span>
                </div>
                <div className="bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.2)]">
                  <span className="text-[10px] text-[#9a9280] uppercase block">Relics / Items</span>
                  <span className="text-xl font-bold text-[#ffd966]">14 Active</span>
                </div>
                <div className="bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.2)]">
                  <span className="text-[10px] text-[#9a9280] uppercase block">Vows &amp; Promises</span>
                  <span className="text-xl font-bold text-[#f2ca50]">12 Open</span>
                </div>
                <div className="bg-[#141408] p-3 rounded-lg border border-[rgba(242,202,80,0.2)]">
                  <span className="text-[10px] text-[#9a9280] uppercase block">Locations</span>
                  <span className="text-xl font-bold text-[#7ee08a]">8 Indexed</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#141408] rounded-lg border border-[rgba(242,202,80,0.15)] space-y-2">
                <div className="flex justify-between items-center text-[10px] text-[#9a9280]">
                  <span>SAMPLE EXTRACTED CLAIMS IN ACTIVE BUFFER:</span>
                  <span className="text-[#7ee08a]">SCHEMA: DELTA_GRAPH_V2</span>
                </div>
                <div className="space-y-1 text-[11px] text-[#d4c49a]">
                  <p>&bull; <span className="text-[#f2ca50]">Entity #418 [Relic]:</span> &quot;Sword of Southern Crags&quot; &rarr; Property: material = star-iron [Ep 84]</p>
                  <p>&bull; <span className="text-[#7ee08a]">Character #12 [State]:</span> Elena &rarr; Vow: reveal silver seal secret before solstice [Ep 218]</p>
                  <p>&bull; <span className="text-[#ff5c4d]">Contradiction Candidate #03:</span> Ep 199 claim &quot;vault never breached&quot; conflicts with Ep 47 breach event.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STAGE 03 CONTENT: Dual-Layer Adjacency Mapping Inspector ── */}
          {pipelineStage === "adjacency" && (
            <div className="bg-[#080800] border border-[rgba(126,224,138,0.35)] rounded-xl p-5 space-y-4 font-mono text-xs animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(242,202,80,0.15)] pb-3">
                <div className="flex items-center gap-2 text-[#7ee08a] font-bold">
                  <Network className="h-4 w-4" />
                  <span>DUAL-LAYER ADJACENCY MATRIX &amp; BIPARTITE MATCHING</span>
                </div>
                <span className="text-[10px] text-[#7ee08a] bg-[#141408] px-2.5 py-1 rounded border border-[rgba(126,224,138,0.3)]">
                  Traversal: 11.4ms &bull; Delta Sync: LIVE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#141408] p-3.5 rounded-lg border border-[rgba(242,202,80,0.2)] space-y-1">
                  <span className="text-[10px] text-[#f2ca50] font-bold block">G_TRUE (STORY TIME)</span>
                  <p className="text-[#9a9280]">Sorts 14,208 nodes strictly by in-universe chronological causation.</p>
                  <span className="text-[10px] text-[#7ee08a]">Epoch indexing active</span>
                </div>
                <div className="bg-[#141408] p-3.5 rounded-lg border border-[rgba(242,202,80,0.2)] space-y-1">
                  <span className="text-[10px] text-[#f2ca50] font-bold block">G_PERCEIVED (REVEAL ORDER)</span>
                  <p className="text-[#9a9280]">Audience episode sequence enforcing strict information horizon boundaries.</p>
                  <span className="text-[10px] text-[#ffd966]">No lookahead leakage</span>
                </div>
                <div className="bg-[#141408] p-3.5 rounded-lg border border-[rgba(126,224,138,0.3)] space-y-1">
                  <span className="text-[10px] text-[#7ee08a] font-bold block">PAYOFF BIPARTITE MATCHING</span>
                  <p className="text-[#9a9280]">Distinguishes intentional twists (protected payoffs) from real plot holes.</p>
                  <span className="text-[10px] text-[#7ee08a]">8 / 8 Twists Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

