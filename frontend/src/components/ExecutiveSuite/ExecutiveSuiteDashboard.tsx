"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutGrid,
  Network,
  ShieldCheck,
  FileEdit,
  Users,
  Plus,
  Settings,
  HelpCircle,
  Bell,
  History,
  Search,
  BookOpen,
  ArrowLeft,
  X,
  Menu,
  Layers,
  Film,
  ChevronDown,
  Cpu,
  CheckCircle2,
  FileText,
  Activity,
  Play,
  Zap,
  Check,
  Folder,
} from "lucide-react";
import { OverviewView, INITIAL_PROJECTS, INITIAL_EPISODES, ProjectItem, EpisodeRecord } from "./OverviewView";
import { GraphEngineView } from "./GraphEngineView";
import { SeriesIngestionView } from "./SeriesIngestionView";
import { FindingsEvidenceView } from "./FindingsEvidenceView";
import { WriterSurfacesView } from "./WriterSurfacesView";
import { PersonaCollaborationView } from "./PersonaCollaborationView";
import { ContinuityStudioView } from "./ContinuityStudioView";

interface ExecutiveSuiteDashboardProps {
  onBackToLanding: () => void;
  initialTab?: "overview" | "graphengine" | "ingestion" | "findings" | "surfaces" | "personacollab" | "continuitystudio" | "episodedetail";
}

export const ExecutiveSuiteDashboard: React.FC<ExecutiveSuiteDashboardProps> = ({
  onBackToLanding,
  initialTab = "overview",
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "graphengine" | "ingestion" | "findings" | "surfaces" | "personacollab" | "continuitystudio" | "episodedetail"
  >(initialTab);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>("TLMS-001");
  const [episodesMap, setEpisodesMap] = useState<Record<string, EpisodeRecord[]>>(INITIAL_EPISODES);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string>("ep-218");

  // CUSTOM POPOVER BOX STATES
  const [isProjectPopoverOpen, setIsProjectPopoverOpen] = useState(false);
  const [isEpisodePopoverOpen, setIsEpisodePopoverOpen] = useState(false);

  // Active Project & Episodes Lookup
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activeEpisodes = episodesMap[activeProjectId] || episodesMap["TLMS-001"] || [];
  const activeEpisode = activeEpisodes.find((e) => e.id === activeEpisodeId) || activeEpisodes[0];

  // Sync episode selection whenever active project changes
  useEffect(() => {
    const currentProjectEps = episodesMap[activeProjectId] || [];
    if (currentProjectEps.length > 0) {
      setActiveEpisodeId(currentProjectEps[0].id);
    }
  }, [activeProjectId, episodesMap]);

  // Navigation Items
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "graphengine", label: "Graph Engine", icon: Network },
    { id: "findings", label: "Findings & Evidence", icon: ShieldCheck },
    { id: "personacollab", label: "Persona Collaboration", icon: Users },
    { id: "surfaces", label: "Writer Surfaces", icon: FileEdit },
    { id: "continuitystudio", label: "Continuity Studio", icon: Layers },
  ];

  const handleCreateProject = (title: string, type: "Series" | "Movie", genre: string) => {
    const newId = `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const newEps: EpisodeRecord[] = [
      { id: `ep-${Date.now()}-1`, number: 1, title: `${title} Scene 1`, wordCount: 1800, status: "Complete", graphStatus: 100, lastUpdated: "Just now", fastPass: true, deepExtraction: 100 },
      { id: `ep-${Date.now()}-2`, number: 2, title: `${title} Scene 2`, wordCount: 2100, status: "Complete", graphStatus: 100, lastUpdated: "Just now", fastPass: true, deepExtraction: 100 },
    ];

    const newProj: ProjectItem = {
      id: newId,
      title,
      type,
      genre,
      episodesCount: newEps.length,
      wordCount: "~3,900",
      status: "Ready",
      lastIngested: "Just now",
    };

    setProjects([newProj, ...projects]);
    setEpisodesMap((prev) => ({ ...prev, [newId]: newEps }));
    setActiveProjectId(newId);
    setActiveEpisodeId(newEps[0].id);
  };

  return (
    <div className="min-h-screen bg-[#080800] text-[#f5f0e8] flex flex-col md:flex-row relative">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Sidebar Toggle Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[rgba(242,202,80,0.15)] bg-[#0d0d08] sticky top-0 z-30">
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

      {/* Fixed & Scrollable Left Sidebar Navigation */}
      <aside
        className={`w-64 shrink-0 bg-[#0d0d08] border-r border-[rgba(212,175,55,0.25)] p-6 flex flex-col justify-between z-40 transition-all duration-300 h-screen sticky top-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0d0d08] [&::-webkit-scrollbar-thumb]:bg-[rgba(212,175,55,0.2)] hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(212,175,55,0.4)] [&::-webkit-scrollbar-thumb]:rounded-full ${sidebarOpen ? "fixed inset-y-0 left-0 shadow-2xl z-50" : "hidden md:flex"
          }`}
      >
        <div className="space-y-6">
          {/* Brand Logo & Suite Tag */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4af37] bg-[#080800] text-[#f2ca50]">
              <BookOpen className="h-5 w-5 text-[#d4af37]" />
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

          {/* ─────────────────────────────────────────────────────────────────────────
              CUSTOM POPOVER BOX SELECTORS FOR PROJECT & EPISODE (REPLACING NATIVE SELECT)
          ───────────────────────────────────────────────────────────────────────── */}
          <div className="bg-[#080800] p-3.5 rounded-xl border border-[rgba(242,202,80,0.3)] space-y-3 font-mono text-xs shadow-md relative">
            {/* 1. PROJECT POPOVER TRIGGER BUTTON */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#9a9280] uppercase tracking-wider block font-bold">SELECT PROJECT:</span>
                <span className="text-[9px] text-[#7ee08a] font-bold">✓ Ready</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsProjectPopoverOpen(!isProjectPopoverOpen);
                  setIsEpisodePopoverOpen(false);
                }}
                className="w-full bg-[#141408] hover:bg-[#1a1a0c] border border-[rgba(242,202,80,0.3)] hover:border-[#f2ca50] rounded-lg px-3 py-2 text-xs font-bold text-[#f5f0e8] flex items-center justify-between transition group cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder className="h-3.5 w-3.5 text-[#f2ca50] shrink-0" />
                  <span className="truncate">{activeProject.title}</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-[#f2ca50] shrink-0 transition-transform ${isProjectPopoverOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* 2. EPISODE POPOVER TRIGGER BUTTON */}
            <div className="space-y-1 pt-1.5 border-t border-[rgba(242,202,80,0.12)]">
              <span className="text-[9px] text-[#9a9280] uppercase font-bold block">SELECT EPISODE:</span>

              <button
                type="button"
                onClick={() => {
                  setIsEpisodePopoverOpen(!isEpisodePopoverOpen);
                  setIsProjectPopoverOpen(false);
                }}
                className="w-full bg-[#141408] hover:bg-[#1a1a0c] border border-[rgba(242,202,80,0.3)] hover:border-[#f2ca50] rounded-lg px-3 py-2 text-xs font-bold text-[#f2ca50] flex items-center justify-between transition group cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <Film className="h-3.5 w-3.5 text-[#f2ca50] shrink-0" />
                  <span className="truncate">Ep {activeEpisode?.number || 1} — {activeEpisode?.title || "Select"}</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-[#f2ca50] shrink-0 transition-transform ${isEpisodePopoverOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as typeof activeTab);
                    setSidebarOpen(false);
                  }}
                  style={{ fontFamily: "var(--font-body)" }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${isActive
                    ? "border border-[#d4af37] text-[#f5f0e8] bg-[#080800] font-semibold"
                    : "border border-transparent text-[#9a9280] hover:text-[#f5f0e8] hover:border-[rgba(212,175,55,0.45)] hover:bg-[#080800]/50"
                    }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#d4af37]" : "text-[#9a9280]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-[rgba(212,175,55,0.15)] pt-4 space-y-1 mt-6">
          <button
            type="button"
            style={{ fontFamily: "var(--font-body)" }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-[#9a9280] hover:text-[#f5f0e8] transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <button
            type="button"
            style={{ fontFamily: "var(--font-body)" }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs text-[#9a9280] hover:text-[#f5f0e8] transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Support</span>
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────────────────
          CUSTOM FLOATING POPOVER MODAL BOX: PROJECT SELECTOR
      ───────────────────────────────────────────────────────────────────────── */}
      {isProjectPopoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080800]/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0d0d08] border-2 border-[rgba(242,202,80,0.35)] p-5 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl font-mono text-xs text-[#f5f0e8]">
            <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2 text-[#f2ca50]">
                <Folder className="h-4 w-4" />
                <span className="font-bold uppercase tracking-wider text-xs">SELECT ACTIVE PROJECT</span>
              </div>
              <button
                onClick={() => setIsProjectPopoverOpen(false)}
                className="text-[#9a9280] hover:text-[#f5f0e8] p-1 rounded-lg hover:bg-[#141408]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {projects.map((p) => {
                const isSelected = p.id === activeProjectId;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveProjectId(p.id);
                      setIsProjectPopoverOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? "bg-[rgba(242,202,80,0.12)] border-[#f2ca50] text-[#f2ca50]"
                        : "bg-[#141408] border-[rgba(242,202,80,0.1)] text-[#f5f0e8] hover:border-[rgba(242,202,80,0.3)] hover:bg-[#1a1a0c]"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold block text-xs">{p.title}</span>
                      <span className="text-[10px] text-[#9a9280] block">
                        {p.id} • {p.episodesCount} Episodes • {p.genre}
                      </span>
                    </div>

                    {isSelected && <Check className="h-4 w-4 text-[#f2ca50] shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          CUSTOM FLOATING POPOVER MODAL BOX: EPISODE SELECTOR
      ───────────────────────────────────────────────────────────────────────── */}
      {isEpisodePopoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080800]/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0d0d08] border-2 border-[rgba(242,202,80,0.35)] p-5 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl font-mono text-xs text-[#f5f0e8]">
            <div className="flex items-center justify-between border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2 text-[#f2ca50]">
                <Film className="h-4 w-4" />
                <span className="font-bold uppercase tracking-wider text-xs">SELECT EPISODE</span>
              </div>
              <button
                onClick={() => setIsEpisodePopoverOpen(false)}
                className="text-[#9a9280] hover:text-[#f5f0e8] p-1 rounded-lg hover:bg-[#141408]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {activeEpisodes.map((ep) => {
                const isSelected = ep.id === activeEpisodeId;
                return (
                  <div
                    key={ep.id}
                    onClick={() => {
                      setActiveEpisodeId(ep.id);
                      setActiveTab("episodedetail");
                      setIsEpisodePopoverOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? "bg-[rgba(242,202,80,0.12)] border-[#f2ca50] text-[#f2ca50]"
                        : "bg-[#141408] border-[rgba(242,202,80,0.1)] text-[#f5f0e8] hover:border-[rgba(242,202,80,0.3)] hover:bg-[#1a1a0c]"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold block text-xs">
                        Ep {ep.number} — {ep.title}
                      </span>
                      <span className="text-[10px] text-[#9a9280] block">
                        {ep.wordCount.toLocaleString()} words • Graph {ep.graphStatus}%
                      </span>
                    </div>

                    {isSelected && <Check className="h-4 w-4 text-[#f2ca50] shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#080800]/95 backdrop-blur-md border-b border-[rgba(242,202,80,0.12)] px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Left Breadcrumb */}
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
                  : activeTab === "personacollab"
                  ? "Persona Collaboration"
                  : activeTab === "surfaces"
                  ? "Writer Surfaces"
                  : "Continuity Studio"}
              </span>
            </div>
          </div>

          {/* Right Actions */}
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
          {activeTab === "overview" && (
            <OverviewView
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={(id) => setActiveProjectId(id)}
              onSelectEpisode={(epId) => {
                setActiveEpisodeId(epId);
                setActiveTab("episodedetail");
              }}
              onCreateProject={handleCreateProject}
            />
          )}

          {activeTab === "graphengine" && <GraphEngineView />}
          {activeTab === "ingestion" && <SeriesIngestionView />}
          {activeTab === "findings" && <FindingsEvidenceView />}
          {activeTab === "personacollab" && <PersonaCollaborationView />}
          {activeTab === "surfaces" && <WriterSurfacesView />}
          {activeTab === "continuitystudio" && <ContinuityStudioView />}

          {/* EPISODE DETAIL VIEW */}
          {activeTab === "episodedetail" && activeEpisode && (
            <div className="space-y-6 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.15)] pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold italic text-[#f5f0e8]">
                      Episode {activeEpisode.number}: {activeEpisode.title}
                    </h1>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-[rgba(126,224,138,0.15)] text-[#7ee08a] border border-[rgba(126,224,138,0.3)] font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#7ee08a]" />
                      ✓ Ingestion & Graph Synced
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#9a9280] italic mt-0.5">
                    {activeProject.title} ({activeProject.id}) • Script Word Count: {activeEpisode.wordCount.toLocaleString()} words
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("overview")}
                  className="ghost-button px-4 py-2 rounded-xl text-xs font-mono text-[#f2ca50]"
                >
                  ← Return to Catalog
                </button>
              </div>

              {/* Two-Speed Ingestion Card */}
              <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-4">
                <span className="text-xs font-mono text-[#9a9280] uppercase tracking-widest block font-bold">
                  TWO-SPEED INGESTION PIPELINE STATUS
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.15)] space-y-2">
                    <span className="text-[#f2ca50] font-bold block">1. Fast Synopsis Pass</span>
                    <p className="text-[#9a9280] text-[11px] italic">Builds high-level graph backbone immediately.</p>
                    <span className="text-[#7ee08a] font-bold block">✓ 100% Complete</span>
                  </div>

                  <div className="bg-[#080800] p-4 rounded-xl border border-[rgba(242,202,80,0.15)] space-y-2">
                    <span className="text-[#f2ca50] font-bold block">2. Deep Extraction Pass</span>
                    <p className="text-[#9a9280] text-[11px] italic">Extracts micro story state via Spark ai_query().</p>
                    <span className="text-[#7ee08a] font-bold block">✓ {activeEpisode.deepExtraction}% Complete</span>
                  </div>
                </div>
              </div>

              {/* Graph Intelligence Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="glass-panel p-4 rounded-xl border border-[rgba(242,202,80,0.15)]">
                  <span className="text-[10px] text-[#9a9280] block">EXTRACTED ENTITIES</span>
                  <span className="text-[#f5f0e8] font-bold text-lg">184 Nodes</span>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-[rgba(242,202,80,0.15)]">
                  <span className="text-[10px] text-[#9a9280] block">GRAPH EDGES</span>
                  <span className="text-[#f2ca50] font-bold text-lg">614 Edges</span>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-[rgba(242,202,80,0.15)]">
                  <span className="text-[10px] text-[#9a9280] block">PLANTED CLUES</span>
                  <span className="text-[#7ee08a] font-bold text-lg">19 Clues</span>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-[rgba(242,202,80,0.15)]">
                  <span className="text-[10px] text-[#9a9280] block">OPEN OBLIGATIONS</span>
                  <span className="text-[#ffb347] font-bold text-lg">5 Pending</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
