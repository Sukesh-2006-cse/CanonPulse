"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ZoomIn, ZoomOut, RefreshCw, Maximize2 } from "lucide-react";

export interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  color: string;
  glowColor: string;
  status?: string;
  attributes: Record<string, any>;
  layer_indices: {
    true_time: number;
    presentation_idx: number;
  };
}

export interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  id: string;
  source: string | NodeData;
  target: string | NodeData;
  type: string;
  status: "SUSPENDED" | "VERIFIED" | "PENDING";
  statusText: string;
  is_protected?: boolean;
}

const NODES_TRUE_TIME: NodeData[] = [
  {
    id: "EP02_SC83_N14",
    name: "Brass Keycard Damaged",
    type: "ARTIFACT_STATE",
    color: "#f2ca50",
    glowColor: "rgba(242,202,80,0.6)",
    attributes: { item: "Brass Keycard", condition: "DAMAGED", location: "VAULT_ENTRY" },
    layer_indices: { true_time: 1400, presentation_idx: 26 },
  },
  {
    id: "EP02_SC83_N15",
    name: "Vault B3 Breached",
    type: "WORLD_EVENT",
    color: "#4d94ff",
    glowColor: "rgba(77,148,255,0.6)",
    attributes: { sector: "B3", breach_method: "KEYCARD_BYPASS", security_level: "ALPHA" },
    layer_indices: { true_time: 1401, presentation_idx: 27 },
  },
  {
    id: "EP02_SC83_N16",
    name: "Raj Infiltrating",
    type: "CHARACTER_STATE",
    color: "#7ee08a",
    glowColor: "rgba(126,224,138,0.6)",
    status: "UNCONSCIOUS",
    attributes: { character: "Raj", status: "INFILTRATING", location_id: "LOC_MUM_B4" },
    layer_indices: { true_time: 1402, presentation_idx: 28 },
  },
  {
    id: "EP02_SC83_N17",
    name: "Silver Cufflink",
    type: "FORESHADOWING_PLANT",
    color: "#ff5c4d",
    glowColor: "rgba(255,92,77,0.6)",
    attributes: { item: "Silver Cufflink", clue_id: "CLUE_88", owner: "Unknown" },
    layer_indices: { true_time: 1403, presentation_idx: 29 },
  },
  {
    id: "EP02_SC83_N18",
    name: "Narrative Debt",
    type: "OBLIGATION_NODE",
    color: "#b366ff",
    glowColor: "rgba(179,102,255,0.6)",
    attributes: { obligation: "UNRESOLVED_PAYOFF", weight: 0.89, urgency: "HIGH" },
    layer_indices: { true_time: 1404, presentation_idx: 30 },
  },
  {
    id: "EP02_SC83_N19",
    name: "Monsoon Protocol",
    type: "SYSTEM_STATE",
    color: "#38bdf8",
    glowColor: "rgba(56,189,248,0.6)",
    attributes: { protocol: "MONSOON_INIT", active: true, countdown: "04:12" },
    layer_indices: { true_time: 1398, presentation_idx: 24 },
  },
  {
    id: "EP02_SC83_N20",
    name: "Cipher Key Recovered",
    type: "RESOLUTION_PAYOFF",
    color: "#fb923c",
    glowColor: "rgba(251,146,60,0.6)",
    attributes: { key_type: "RSA_4096", state: "DECRYPTED", target: "VAULT_CORE" },
    layer_indices: { true_time: 1405, presentation_idx: 31 },
  },
];

const LINKS_TRUE_TIME: LinkData[] = [
  { id: "EDGE_EP02_EP26_01", source: "EP02_SC83_N14", target: "EP02_SC83_N15", type: "CAUSAL_LINK", status: "SUSPENDED", statusText: "Broken Path" },
  { id: "EDGE_EP02_EP86_04", source: "EP02_SC83_N15", target: "EP02_SC83_N16", type: "PLANT_PAYOFF", status: "VERIFIED", statusText: "is_protected: true", is_protected: true },
  { id: "EDGE_EP02_EP88_04", source: "EP02_SC83_N16", target: "EP02_SC83_N17", type: "PLANT_PAYOFF", status: "VERIFIED", statusText: "is_protected: true", is_protected: true },
  { id: "EDGE_EP02_EP90_02", source: "EP02_SC83_N17", target: "EP02_SC83_N18", type: "OBLIGATION_EDGE", status: "SUSPENDED", statusText: "Overdue 12 eps" },
  { id: "EDGE_EP02_EP91_03", source: "EP02_SC83_N19", target: "EP02_SC83_N14", type: "CAUSAL_LINK", status: "VERIFIED", statusText: "is_protected: true", is_protected: true },
  { id: "EDGE_EP02_EP92_05", source: "EP02_SC83_N18", target: "EP02_SC83_N20", type: "RESOLVES", status: "VERIFIED", statusText: "Payoff linked", is_protected: true },
];

const LINKS_PERCEIVED: LinkData[] = [
  { id: "EDGE_P_01", source: "EP02_SC83_N19", target: "EP02_SC83_N14", type: "FLASHBACK_EDGE", status: "VERIFIED", statusText: "Narrative Reveal", is_protected: true },
  { id: "EDGE_P_02", source: "EP02_SC83_N14", target: "EP02_SC83_N16", type: "PRESENTATION_STREAM", status: "SUSPENDED", statusText: "Non-linear Jump" },
  { id: "EDGE_P_03", source: "EP02_SC83_N16", target: "EP02_SC83_N15", type: "REVEAL_PAYOFF", status: "VERIFIED", statusText: "Twist Payoff", is_protected: true },
  { id: "EDGE_P_04", source: "EP02_SC83_N15", target: "EP02_SC83_N17", type: "SUSPENSE_THREAD", status: "SUSPENDED", statusText: "Unresolved Clue" },
  { id: "EDGE_P_05", source: "EP02_SC83_N17", target: "EP02_SC83_N18", type: "NARRATIVE_GAP", status: "SUSPENDED", statusText: "Broken Expectation" },
  { id: "EDGE_P_06", source: "EP02_SC83_N18", target: "EP02_SC83_N20", type: "FUTURE_TEASE", status: "VERIFIED", statusText: "Teaser Link", is_protected: true },
];

interface D3TopologyGraphProps {
  activeLayer: "true" | "perceived";
  selectedNodeId: string;
  onSelectNode: (node: NodeData) => void;
  onSelectLink?: (link: LinkData) => void;
}

export const D3TopologyGraph: React.FC<D3TopologyGraphProps> = ({
  activeLayer,
  selectedNodeId,
  onSelectNode,
  onSelectLink,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 380;

    // Deep clone nodes and links so simulation can mutate x, y, vx, vy
    const currentNodes: NodeData[] = JSON.parse(JSON.stringify(NODES_TRUE_TIME));
    const currentLinks: LinkData[] = JSON.parse(
      JSON.stringify(activeLayer === "true" ? LINKS_TRUE_TIME : LINKS_PERCEIVED)
    );

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Setup defs (arrowheads, glow filters)
    const defs = svg.append("defs");

    // Suspended Arrow
    defs
      .append("marker")
      .attr("id", "arrow-suspended")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 26)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#ff5c4d");

    // Verified Arrow
    defs
      .append("marker")
      .attr("id", "arrow-verified")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 26)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#7ee08a");

    // Default Arrow
    defs
      .append("marker")
      .attr("id", "arrow-default")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 26)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#9a9280");

    // Glow Filter
    const filter = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Container Group for Zoom/Pan
    const g = svg.append("g").attr("class", "main-graph-group");

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(Math.round(event.transform.k * 100) / 100);
      });

    svg.call(zoom as any).on("dblclick.zoom", null);
    zoomBehaviorRef.current = zoom;

    // Simulation forces
    const simulation = d3
      .forceSimulation<NodeData>(currentNodes)
      .force(
        "link",
        d3
          .forceLink<NodeData, LinkData>(currentLinks)
          .id((d) => d.id)
          .distance(110)
      )
      .force("charge", d3.forceManyBody().strength(-380))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(45));

    simulationRef.current = simulation;

    // Render Links
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(currentLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => (d.status === "SUSPENDED" ? "#ff5c4d" : d.status === "VERIFIED" ? "#7ee08a" : "#9a9280"))
      .attr("stroke-width", (d) => (d.status === "SUSPENDED" ? 2 : 1.5))
      .attr("stroke-dasharray", (d) => (d.status === "SUSPENDED" ? "4,4" : "none"))
      .attr("marker-end", (d) =>
        d.status === "SUSPENDED" ? "url(#arrow-suspended)" : d.status === "VERIFIED" ? "url(#arrow-verified)" : "url(#arrow-default)"
      )
      .attr("class", "cursor-pointer transition-opacity hover:opacity-100 opacity-80")
      .on("click", (event, d) => {
        event.stopPropagation();
        if (onSelectLink) onSelectLink(d);
      });

    // Link Labels (Edge Types)
    const linkText = g
      .append("g")
      .attr("class", "link-labels")
      .selectAll("text")
      .data(currentLinks)
      .enter()
      .append("text")
      .text((d) => d.type)
      .attr("font-size", "9px")
      .attr("font-family", "var(--font-mono)")
      .attr("fill", "#9a9280")
      .attr("text-anchor", "middle")
      .attr("dy", "-4");

    // Render Node Groups
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(currentNodes)
      .enter()
      .append("g")
      .attr("class", "node cursor-pointer")
      .call(
        d3
          .drag<SVGGElement, NodeData>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        onSelectNode(d);
      });

    // Glowing outer ring for active / selected node
    node
      .append("circle")
      .attr("r", 22)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", (d) => (d.id === selectedNodeId ? 3 : 1.5))
      .attr("opacity", (d) => (d.id === selectedNodeId ? 1 : 0.4))
      .attr("filter", "url(#glow)");

    // Core Node Circle
    node
      .append("circle")
      .attr("r", 14)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .attr("class", "transition-transform hover:scale-125");

    // Node Labels
    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 0)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-family", "var(--font-body)")
      .attr("font-style", "italic")
      .attr("font-weight", "500")
      .attr("fill", "#f5f0e8")
      .attr("class", "pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]");

    // Simulation tick handler
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkText
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Auto-select first node if none selected
    const initialSelected = currentNodes.find((n) => n.id === selectedNodeId) || currentNodes[0];
    if (initialSelected && (!selectedNodeId || !currentNodes.some((n) => n.id === selectedNodeId))) {
      onSelectNode(initialSelected);
    }
  }, [activeLayer, selectedNodeId]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy as any, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy as any, 0.7);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(500).call(zoomBehaviorRef.current.transform as any, d3.zoomIdentity);
    }
  };

  const handleReheatSimulation = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(0.8).restart();
    }
  };

  return (
    <div ref={containerRef} className="relative h-[380px] w-full bg-[#080800] rounded-xl border border-[rgba(242,202,80,0.12)] overflow-hidden">
      {/* Zoom and Physics Control Floating Toolbar */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-[rgba(8,8,0,0.85)] p-1.5 rounded-lg border border-[rgba(242,202,80,0.2)] backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 text-[#9a9280] hover:text-[#f5f0e8] hover:bg-[rgba(242,202,80,0.1)] rounded transition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 text-[#9a9280] hover:text-[#f5f0e8] hover:bg-[rgba(242,202,80,0.1)] rounded transition"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset View"
          className="p-1.5 text-[#9a9280] hover:text-[#f5f0e8] hover:bg-[rgba(242,202,80,0.1)] rounded transition"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <div className="h-3 w-[1px] bg-[rgba(242,202,80,0.2)] mx-0.5" />
        <button
          onClick={handleReheatSimulation}
          title="Reheat Force Physics"
          className="p-1.5 text-[#f2ca50] hover:bg-[rgba(242,202,80,0.15)] rounded transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* D3 SVG Canvas */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Status Indicator at bottom left */}
      <div className="absolute bottom-3 left-3 z-10 font-mono text-[10px] text-[#9a9280] bg-[rgba(8,8,0,0.7)] px-2.5 py-1 rounded border border-[rgba(242,202,80,0.1)] flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#7ee08a] animate-pulse" />
        <span>D3 Force Engine: {activeLayer === "true" ? "G_TRUE (Chronological)" : "G_PERCEIVED (Presentation)"}</span>
        <span className="text-[9px] text-[#4d94ff]">Zoom: {Math.round(zoomLevel * 100)}%</span>
      </div>
    </div>
  );
};
