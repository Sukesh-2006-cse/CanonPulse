"use client";

import React, { useState } from "react";
import { FileCode, FileText, UploadCloud, CheckCircle2, RefreshCw, Clock, Layers } from "lucide-react";

export const SeriesIngestionView: React.FC = () => {
  const [selectedAssetType, setSelectedAssetType] = useState<"bible" | "script" | "draft">("bible");
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-[rgba(242,202,80,0.12)] pb-4">
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="text-3xl font-semibold italic text-[#f5f0e8]"
        >
          Series Ingestion
        </h1>
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-sm text-[#9a9280] italic mt-1"
        >
          Securely upload scripts, series bibles, and story drafts for engine analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dropzone & Asset Classification (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-[rgba(242,202,80,0.2)] space-y-6">
            {/* Asset Classification Toggles */}
            <div>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold block mb-3"
              >
                ASSET CLASSIFICATION
              </span>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "bible", label: "Series Bible" },
                  { id: "script", label: "Current Script" },
                  { id: "draft", label: "Initial Draft" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedAssetType(type.id as "bible" | "script" | "draft")}
                    style={{ fontFamily: "var(--font-mono)" }}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      selectedAssetType === type.id
                        ? "gold-button shadow-[0_0_15px_rgba(242,202,80,0.3)]"
                        : "ghost-button"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all flex flex-col items-center justify-center space-y-4 ${
                dragActive
                  ? "border-[#f2ca50] bg-[rgba(242,202,80,0.08)] scale-[1.01]"
                  : "border-[rgba(242,202,80,0.2)] bg-[#080800]/60 hover:border-[rgba(242,202,80,0.4)]"
              }`}
            >
              {/* File Format Icons */}
              <div className="flex items-center justify-center gap-4 text-[#f2ca50]">
                <div className="p-3 rounded-lg bg-[#141408] border border-[rgba(242,202,80,0.3)]">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="p-3 rounded-lg bg-[#141408] border border-[rgba(242,202,80,0.3)]">
                  <FileCode className="h-6 w-6" />
                </div>
                <div className="p-3 rounded-lg bg-[#141408] border border-[rgba(242,202,80,0.3)]">
                  <UploadCloud className="h-6 w-6 text-[#7ee08a]" />
                </div>
              </div>

              <div>
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-2xl font-semibold italic text-[#f5f0e8]"
                >
                  Drop series assets here
                </h3>
                <p
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-xs text-[#9a9280] italic mt-1 max-w-sm"
                >
                  Engine supports PDF, DOCX, and TXT formats for deep structural analysis.
                </p>
              </div>

              {/* Upload CTA Button (Uiverse Shiny Style) */}
              <label className="gold-button flex items-center gap-2 rounded px-6 py-2.5 text-xs font-semibold cursor-pointer">
                <span>Select Files</span>
                <input type="file" multiple className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Verification & Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Initial Graph Verification Status */}
          <div className="glass-panel rounded-2xl p-5 border border-[rgba(242,202,80,0.2)] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#f2ca50] font-semibold">
              <CheckCircle2 className="h-4 w-4 text-[#7ee08a]" />
              <span className="uppercase tracking-wider text-[11px]">INITIAL GRAPH VERIFICATION</span>
            </div>

            <div className="space-y-2.5 font-mono text-xs border-t border-[rgba(242,202,80,0.1)] pt-3">
              <div className="flex justify-between items-center text-[#9a9280]">
                <span>Ledger Sep.</span>
                <span className="text-[#7ee08a] font-bold">✓ PASS</span>
              </div>
              <div className="flex justify-between items-center text-[#9a9280]">
                <span>E2E Integrity</span>
                <span className="text-[#7ee08a] font-bold">✓ ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-[#9a9280]">
                <span>Engine Sync</span>
                <span className="text-[#ffb347] font-bold flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" /> AWAITING PUSH
                </span>
              </div>
            </div>
          </div>

          {/* Current Processing Queue */}
          <div className="glass-panel rounded-2xl p-5 border border-[rgba(242,202,80,0.15)] space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.1)] pb-3">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] tracking-widest text-[#9a9280] uppercase font-semibold"
              >
                Current Processing Queue
              </span>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] bg-[rgba(242,202,80,0.1)] text-[#f2ca50] px-2 py-0.5 rounded font-semibold"
              >
                3 items
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Item 1: Processing */}
              <div className="bg-[#080800]/80 p-3 rounded-xl border border-[rgba(242,202,80,0.1)] space-y-1.5">
                <div className="flex justify-between items-center font-bold text-[#f5f0e8]">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <FileText className="h-3.5 w-3.5 text-[#f2ca50]" /> Script_E402_V3.pdf
                  </span>
                  <span className="text-[#f2ca50]">65%</span>
                </div>
                <p className="text-[10px] text-[#9a9280]">Analyzing character dialogue paths...</p>
                <div className="w-full bg-[#141408] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#f2ca50] h-full w-[65%]" />
                </div>
              </div>

              {/* Item 2: Queued */}
              <div className="bg-[#080800]/80 p-3 rounded-xl border border-[rgba(242,202,80,0.1)] space-y-1">
                <div className="flex justify-between items-center font-bold text-[#f5f0e8]">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Layers className="h-3.5 w-3.5 text-[#9a9280]" /> Series_Bible_S4.docx
                  </span>
                  <span className="text-[#9a9280] text-[10px] uppercase">QUEUED</span>
                </div>
                <p className="text-[10px] text-[#9a9280]">Waiting for engine resources.</p>
              </div>

              {/* Item 3: Completed */}
              <div className="bg-[#080800]/80 p-3 rounded-xl border border-[rgba(126,224,138,0.2)] space-y-1">
                <div className="flex justify-between items-center font-bold text-[#f5f0e8]">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#7ee08a]" /> Story_Draft_Alpha.txt
                  </span>
                  <span className="text-[#7ee08a] text-[10px] uppercase">COMPLETED</span>
                </div>
                <p className="text-[10px] text-[#7ee08a]">Graph integrated successfully.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
