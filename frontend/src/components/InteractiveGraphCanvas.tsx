"use client";

import React, { useState } from "react";
import { GitBranch, ShieldCheck, AlertTriangle, Clock, Eye, Sparkles } from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  type: "hole" | "twist" | "obligation" | "payoff" | "plant";
  episode: number;
  time: string;
  x: number; // percentage
  y: number; // percentage
  description: string;
  citations: string[];
}

export const InteractiveGraphCanvas: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<"perceived" | "true">("perceived");

  const nodes: NodeData[] = [
    {
      id: "node-1",
      label: "Ep 01: Initial Claim",
      type: "plant",
      episode: 1,
      time: "Year -10",
      x: 15,
      y: 35,
      description: "Ancient amulet legend introduced in prolog monologue.",
      citations: ["Ep 1, Page 3: 'The golden amulet of Valen was forged in fire.'"],
    },
    {
      id: "node-2",
      label: "Ep 47: Poison Setup",
      type: "twist",
      episode: 47,
      time: "Day 14",
      x: 35,
      y: 20,
      description: "Untraceable toxin introduced by Alchemist Vane.",
      citations: ["Ep 47, Page 8: 'A poison with no scent, no trace, no cure.'"],
    },
    {
      id: "node-3",
      label: "Ep 84: Furnace Hole",
      type: "hole",
      episode: 84,
      time: "Day 48",
      x: 52,
      y: 65,
      description: "Statement asserting amulet was destroyed in furnace fire.",
      citations: ["Ep 84, Page 12: 'The amulet was destroyed in the furnace.'"],
    },
    {
      id: "node-4",
      label: "Ep 150: Archive Mystery",
      type: "obligation",
      episode: 150,
      time: "Day 75",
      x: 70,
      y: 78,
      description: "Unopened scroll sealed in royal vault.",
      citations: ["Ep 150, Page 19: 'The seal remained unbroken for three decades.'"],
    },
    {
      id: "node-5",
      label: "Ep 218: Antidote Reveal",
      type: "payoff",
      episode: 218,
      time: "Day 100",
      x: 85,
      y: 30,
      description: "Synthesized antidote discharges Ep 47 poison setup.",
      citations: ["Ep 218, Page 15: 'The rare botanical extract counteracted the toxin.'"],
    },
  ];

  const getColor = (type: NodeData["type"]) => {
    switch (type) {
      case "hole":
        return "#ff5c4d";
      case "twist":
      case "payoff":
        return "#7ee08a";
      case "obligation":
        return "#ffb347";
      case "plant":
      default:
        return "#f2ca50";
    }
  };

  return (
    <div className="glass-panel-gold rounded-2xl p-6 relative overflow-hidden border border-[#f2ca50]/30 shadow-[0_0_50px_rgba(242,202,80,0.15)]">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-[rgba(242,202,80,0.12)] pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#141408] border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.3)]">
            <GitBranch className="h-4 w-4" />
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-semibold italic text-[#f5f0e8]">
              Interactive Dual-Layer Graph
            </h3>
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280]">
              Click any node to inspect citations &amp; true-time resolution
            </p>
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-2 bg-[#080800] p-1 rounded border border-[rgba(242,202,80,0.15)] font-mono text-xs">
          <button
            onClick={() => setActiveLayer("perceived")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeLayer === "perceived" ? "gold-button" : "text-[#9a9280] hover:text-[#f5f0e8]"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>G_perceived</span>
          </button>
          <button
            onClick={() => setActiveLayer("true")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeLayer === "true" ? "gold-button" : "text-[#9a9280] hover:text-[#f5f0e8]"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>G_true</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas Area */}
      <div className="relative h-80 sm:h-96 rounded-xl bg-[#080800] border border-[rgba(242,202,80,0.12)] p-4 overflow-hidden select-none">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,202,80,0.06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Connection SVG Lines */}
        <svg className="absolute inset-0 w-full h-full fill-none pointer-events-none">
          {/* Path 1: Ep 1 -> Ep 47 */}
          <line x1="15%" y1="35%" x2="35%" y2="20%" stroke="#f2ca50" strokeWidth="2" strokeDasharray="5 5" className="animate-dash-flow" />
          {/* Path 2: Ep 47 -> Ep 218 (Protected Twist Link) */}
          <line x1="35%" y1="20%" x2="85%" y2="30%" stroke="#7ee08a" strokeWidth="2.5" opacity="0.85" />
          {/* Path 3: Ep 1 -> Ep 84 (Defective Hole Link) */}
          <line x1="15%" y1="35%" x2="52%" y2="65%" stroke="#ff5c4d" strokeWidth="2.5" opacity="0.85" />
          {/* Path 4: Ep 84 -> Ep 150 */}
          <line x1="52%" y1="65%" x2="70%" y2="78%" stroke="#ffb347" strokeWidth="2" strokeDasharray="4 4" className="animate-dash-flow" />
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const color = getColor(node.type);
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode?.id === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-10"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
            >
              {/* Node Pulse Ring */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isHovered || isSelected ? "scale-125 shadow-[0_0_25px_rgba(242,202,80,0.6)]" : ""
                }`}
                style={{
                  borderColor: color,
                  backgroundColor: "rgba(20, 20, 8, 0.9)",
                }}
              >
                <div
                  className="w-4 h-4 rounded-full transition-transform group-hover:scale-110"
                  style={{ backgroundColor: color }}
                />
              </div>

              {/* Label Badge */}
              <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded bg-[#141408] border border-[rgba(242,202,80,0.2)] text-[10px] font-mono transition-all group-hover:scale-105 shadow-md">
                <span style={{ color }}>{activeLayer === "perceived" ? `Ep ${node.episode}` : node.time}:</span>{" "}
                <span className="text-[#f5f0e8] font-medium">{node.label.split(": ")[1]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-[#080800] border border-[#f2ca50]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
                style={{
                  backgroundColor: getColor(selectedNode.type) + "20",
                  color: getColor(selectedNode.type),
                  border: `1px solid ${getColor(selectedNode.type)}50`,
                }}
              >
                {selectedNode.type}
              </span>
              <h4 style={{ fontFamily: "var(--font-display)" }} className="text-base font-semibold italic text-[#f5f0e8]">
                {selectedNode.label}
              </h4>
            </div>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#9a9280] italic">
              {selectedNode.description}
            </p>
            <div style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#f2ca50] pt-1">
              Citation: {selectedNode.citations[0]}
            </div>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-xs text-[#9a9280] hover:text-[#f5f0e8] underline self-end sm:self-center"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
