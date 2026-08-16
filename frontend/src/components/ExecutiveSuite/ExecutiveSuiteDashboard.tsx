"use client";

import React, { useState } from "react";
import { LayoutGrid, Network, ShieldCheck, FileEdit, Plus, Settings, HelpCircle, Bell, History, Search, BookOpen, ArrowLeft, X, Menu } from "lucide-react";
import { OverviewView } from "./OverviewView";
import { GraphEngineView } from "./GraphEngineView";
import { SeriesIngestionView } from "./SeriesIngestionView";
import { FindingsEvidenceView } from "./FindingsEvidenceView";
import { WriterSurfacesView } from "./WriterSurfacesView";

interface ExecutiveSuiteDashboardProps {
  onBackToLanding: () => void;
  initialTab?: "overview" | "graphengine" | "ingestion" | "findings" | "surfaces";
}

export const ExecutiveSuiteDashboard: React.FC<ExecutiveSuiteDashboardProps> = ({
  onBackToLanding,
  initialTab = "overview",
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "graphengine" | "ingestion" | "findings" | "surfaces">(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "graphengine", label: "Graph Engine", icon: Network },
    { id: "findings", label: "Findings & Evidence", icon: ShieldCheck },
    { id: "surfaces", label: "Writer Surfaces", icon: FileEdit },
  ];

  return (
    <div className="min-h-screen bg-[#080800] text-[#f5f0e8] flex flex-col md:flex-row relative">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[rgba(242,202,80,0.15)] bg-[#0d0d08]">
        <div className="flex items-center gap-2 text-[#f2ca50]">
          <BookOpen className="h-5 w-5" />
          <span style={{ fontFamily: "var(--font-display)" }} className="font-semibold text-lg italic text-[#f5f0e8]">
            CanonPulse
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#9a9280] hover:text-[#f2ca50] rounded-lg bg-[#141408]"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Left Sidebar Navigation matching reference designs */}
      <aside
        className={`w-64 bg-[#0d0d08] border-r border-[rgba(242,202,80,0.12)] p-6 flex flex-col justify-between z-40 transition-all duration-300 ${
          sidebarOpen ? "fixed inset-y-0 left-0 shadow-2xl" : "hidden md:flex"
        }`}
      >
        <div className="space-y-8">
          {/* Brand Logo & Suite Tag */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(242,202,80,0.4)] bg-[#141408] text-[#f2ca50] shadow-[0_0_18px_rgba(242,202,80,0.25)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-semibold tracking-[0.1em] text-[#f5f0e8] italic block"
              >
                CanonPulse
              </span>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[9px] tracking-[0.2em] text-[#9a9280] uppercase block"
              >
                Executive Suite
              </span>
            </div>
          </div>

          {/* "+ New Ingestion" CTA Button (Uiverse Shiny Style) */}
          <button
            onClick={() => {
              setActiveTab("ingestion");
              setSidebarOpen(false);
            }}
            className="gold-button w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Ingestion</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as typeof activeTab);
                    setSidebarOpen(false);
                  }}
                  style={{ fontFamily: "var(--font-body)" }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#141408] text-[#f2ca50] border-l-4 border-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.15)] font-semibold"
                      : "text-[#9a9280] hover:text-[#f5f0e8] hover:bg-[#141408]/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#f2ca50]" : "text-[#9a9280]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Links */}
        <div className="border-t border-[rgba(242,202,80,0.1)] pt-4 space-y-1">
          <button
            style={{ fontFamily: "var(--font-body)" }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-[#9a9280] hover:text-[#f5f0e8] transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <button
            style={{ fontFamily: "var(--font-body)" }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-[#9a9280] hover:text-[#f5f0e8] transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Support</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar matching reference screenshots */}
        <header className="sticky top-0 z-30 bg-[#080800]/95 backdrop-blur-md border-b border-[rgba(242,202,80,0.12)] px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left: Breadcrumbs & Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLanding}
              className="ghost-button flex items-center gap-1.5 px-3 py-1.5 rounded text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to Landing</span>
            </button>

            <div style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280] hidden sm:flex items-center gap-2">
              <span>Executive Suite</span>
              <span>&rsaquo;</span>
              <span className="text-[#f2ca50] font-semibold capitalize">
                {activeTab === "overview"
                  ? "Overview"
                  : activeTab === "graphengine"
                  ? "Graph Engine"
                  : activeTab === "ingestion"
                  ? "Series Ingestion"
                  : activeTab === "findings"
                  ? "Findings & Evidence"
                  : "Writer Surfaces"}
              </span>
            </div>
          </div>

          {/* Right: Search Bar & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block w-64">
              <input
                type="text"
                placeholder="Search CanonPulse..."
                style={{ fontFamily: "var(--font-body)" }}
                className="w-full bg-[#141408] border border-[rgba(242,202,80,0.2)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#f5f0e8] placeholder-[#9a9280]/60 focus:outline-none focus:border-[#f2ca50]"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#9a9280]" />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-1.5 text-[#9a9280] hover:text-[#f2ca50] rounded-lg transition-colors">
                <Bell className="h-4 w-4" />
              </button>
              <button className="p-1.5 text-[#9a9280] hover:text-[#f2ca50] rounded-lg transition-colors">
                <History className="h-4 w-4" />
              </button>
              <div className="h-7 w-7 rounded-full bg-[#141408] border border-[rgba(242,202,80,0.4)] flex items-center justify-center text-xs font-mono font-bold text-[#f2ca50]">
                CP
              </div>
            </div>
          </div>
        </header>

        {/* View Viewport */}
        <main className="p-6 max-w-7xl mx-auto w-full flex-1">
          {activeTab === "overview" && <OverviewView />}
          {activeTab === "graphengine" && <GraphEngineView />}
          {activeTab === "ingestion" && <SeriesIngestionView />}
          {activeTab === "findings" && <FindingsEvidenceView />}
          {activeTab === "surfaces" && <WriterSurfacesView />}
        </main>
      </div>
    </div>
  );
};
