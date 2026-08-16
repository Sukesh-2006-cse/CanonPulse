"use client";

import React, { useState, useEffect } from "react";
import {
  Folder,
  Film,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  UploadCloud,
  Database,
  Sparkles,
  ChevronRight,
  Filter,
  Grid,
  List,
} from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  type: "Series" | "Movie" | "Franchise";
  genre: string;
  episodesCount: number;
  wordCount: string;
  status: "Ready" | "Indexing" | "Draft";
  lastIngested: string;
}

export interface EpisodeRecord {
  id: string;
  number: number;
  title: string;
  wordCount: number;
  status: "Complete" | "Processing" | "Queued";
  graphStatus: number;
  lastUpdated: string;
  fastPass: boolean;
  deepExtraction: number;
}

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "TLMS-001",
    title: "The Last Monsoon",
    type: "Series",
    genre: "Serialized Thriller",
    episodesCount: 300,
    wordCount: "~500,000",
    status: "Ready",
    lastIngested: "Today, 14:32",
  },
  {
    id: "NSHD-002",
    title: "Neon Shadows",
    type: "Movie",
    genre: "Cyberpunk Mystery",
    episodesCount: 1,
    wordCount: "~45,000",
    status: "Ready",
    lastIngested: "Yesterday",
  },
  {
    id: "CHRD-003",
    title: "Chrono Detective",
    type: "Series",
    genre: "Sci-Fi / Time Travel",
    episodesCount: 24,
    wordCount: "~120,000",
    status: "Draft",
    lastIngested: "3 days ago",
  },
  {
    id: "CYBP-004",
    title: "Cyberpunk 2099",
    type: "Franchise",
    genre: "Dystopian Sci-Fi",
    episodesCount: 52,
    wordCount: "~340,000",
    status: "Ready",
    lastIngested: "5 days ago",
  },
];

export const INITIAL_EPISODES: Record<string, EpisodeRecord[]> = {
  "TLMS-001": [
    { id: "ep-218", number: 218, title: "The Photograph", wordCount: 1642, status: "Complete", graphStatus: 100, lastUpdated: "14:42", fastPass: true, deepExtraction: 100 },
    { id: "ep-219", number: 219, title: "The Confession", wordCount: 1821, status: "Complete", graphStatus: 100, lastUpdated: "14:41", fastPass: true, deepExtraction: 100 },
    { id: "ep-220", number: 220, title: "The Vault", wordCount: 1503, status: "Complete", graphStatus: 100, lastUpdated: "14:40", fastPass: true, deepExtraction: 100 },
    { id: "ep-221", number: 221, title: "Shadow Alliance", wordCount: 1740, status: "Complete", graphStatus: 100, lastUpdated: "14:38", fastPass: true, deepExtraction: 100 },
  ],
  "NSHD-002": [
    { id: "ep-1", number: 1, title: "Neon Shadows Full Feature Script", wordCount: 45000, status: "Complete", graphStatus: 100, lastUpdated: "Yesterday", fastPass: true, deepExtraction: 100 },
  ],
  "CHRD-003": [
    { id: "ep-101", number: 1, title: "Time Distortion Probe", wordCount: 2100, status: "Complete", graphStatus: 100, lastUpdated: "3 days ago", fastPass: true, deepExtraction: 100 },
  ],
  "CYBP-004": [
    { id: "ep-301", number: 1, title: "Neon City Awakening", wordCount: 3400, status: "Complete", graphStatus: 100, lastUpdated: "5 days ago", fastPass: true, deepExtraction: 100 },
  ],
};

interface OverviewViewProps {
  projects?: ProjectItem[];
  activeProjectId?: string;
  onSelectProject?: (projId: string) => void;
  onSelectEpisode?: (epId: string) => void;
  onCreateProject?: (title: string, type: "Series" | "Movie", genre: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  projects = INITIAL_PROJECTS,
  activeProjectId = "TLMS-001",
  onSelectProject,
  onSelectEpisode,
  onCreateProject,
}) => {
  const [viewMode, setViewMode] = useState<"catalog" | "episodes">("catalog");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"Series" | "Movie">("Series");
  const [newGenre, setNewGenre] = useState("Thriller");

  // Keep selectedProject in sync when activeProjectId changes
  useEffect(() => {
    const matched = projects.find((p) => p.id === activeProjectId);
    if (matched && viewMode === "episodes") {
      setSelectedProject(matched);
    }
  }, [activeProjectId, projects, viewMode]);

  // Filter projects by search
  const filteredProjects = projects.filter(
    (p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active project episodes lookup
  const currentProject = selectedProject || projects.find((p) => p.id === activeProjectId) || projects[0];
  const currentEpisodes = INITIAL_EPISODES[currentProject.id] || [
    { id: `ep-${currentProject.id}-1`, number: 1, title: `${currentProject.title} Episode 1`, wordCount: 2400, status: "Complete", graphStatus: 100, lastUpdated: "Today", fastPass: true, deepExtraction: 100 }
  ];

  const handleProjectClick = (proj: ProjectItem) => {
    setSelectedProject(proj);
    setViewMode("episodes");
    if (onSelectProject) {
      onSelectProject(proj.id);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (onCreateProject) {
      onCreateProject(newTitle, newType, newGenre);
    }
    setNewTitle("");
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.15)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold italic text-[#f5f0e8]">
              {viewMode === "episodes" && selectedProject ? selectedProject.title : "Project Catalog & Series Memory"}
            </h1>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[rgba(126,224,138,0.15)] text-[#7ee08a] border border-[rgba(126,224,138,0.3)] font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#7ee08a]" />
              {projects.length} Active Projects
            </span>
          </div>

          <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#9a9280] italic mt-0.5">
            {viewMode === "episodes" && selectedProject
              ? `Ingested scripts and dual-layer graph data for ${selectedProject.title}`
              : "Google Drive-style project workspace for long-running fiction series and screenplays."}
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {viewMode === "episodes" && (
            <button
              onClick={() => {
                setViewMode("catalog");
                setSelectedProject(null);
              }}
              className="ghost-button px-4 py-2.5 rounded-xl flex items-center gap-2 text-[#f2ca50]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>← Back to Catalog</span>
            </button>
          )}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="gold-button px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(242,202,80,0.3)] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ Create Project</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: GOOGLE DRIVE STYLE PROJECT GRID */}
      {viewMode === "catalog" ? (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-[rgba(242,202,80,0.15)]">
            <div className="relative flex-1 font-mono text-xs">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-[#9a9280]" />
              <input
                type="text"
                placeholder="Search projects by title, genre, format..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg pl-9 pr-3 py-2 text-xs text-[#f5f0e8] focus:border-[#f2ca50] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-[#9a9280]">
              <span className="text-[10px] uppercase font-bold">GRID VIEW</span>
              <div className="p-1.5 bg-[#080800] rounded-lg border border-[rgba(242,202,80,0.2)] text-[#f2ca50]">
                <Grid className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Google Drive Style Folder Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* Create Project Prompt Card */}
            <div
              onClick={() => setIsCreateModalOpen(true)}
              className="border-2 border-dashed border-[rgba(242,202,80,0.3)] hover:border-[#f2ca50] bg-[#080800]/50 hover:bg-[#141408] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all hover:scale-[1.02] min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[rgba(242,202,80,0.1)] border border-[rgba(242,202,80,0.3)] flex items-center justify-center text-[#f2ca50]">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)" }} className="text-base font-bold text-[#f5f0e8]">
                  + Create New Project
                </h3>
                <p className="text-xs text-[#9a9280] font-mono mt-1">Start new series or screenplay</p>
              </div>
            </div>

            {/* Existing Project Folder Cards */}
            {filteredProjects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => handleProjectClick(proj)}
                  className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between space-y-4 shadow-lg group relative overflow-hidden ${isActive
                    ? "border-[#f2ca50] bg-[#141408] ring-1 ring-[#f2ca50]/50"
                    : "border-[rgba(242,202,80,0.2)] hover:border-[#f2ca50] bg-[#0d0d08] hover:bg-[#141408]"
                    }`}
                >
                  {/* Folder Header */}
                  <div className="flex items-start justify-between border-b border-[rgba(242,202,80,0.1)] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[rgba(242,202,80,0.1)] border border-[rgba(242,202,80,0.25)] flex items-center justify-center group-hover:border-[#f2ca50] transition">
                        <Folder className="h-5 w-5 text-[#f2ca50]" />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold italic text-[#f5f0e8] group-hover:text-[#f2ca50] transition">
                          {proj.title}
                        </h3>
                        <span className="text-[10px] font-mono text-[#9a9280]">{proj.id}</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-[rgba(242,202,80,0.12)] text-[#f2ca50] border border-[rgba(242,202,80,0.25)]">
                      {proj.type}
                    </span>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-[#9a9280]">
                      <span>Genre:</span>
                      <span className="text-[#f5f0e8] font-semibold">{proj.genre}</span>
                    </div>
                    <div className="flex justify-between text-[#9a9280]">
                      <span>Episodes:</span>
                      <span className="text-[#f2ca50] font-bold">{proj.episodesCount} Episodes</span>
                    </div>
                    <div className="flex justify-between text-[#9a9280]">
                      <span>Word Count:</span>
                      <span className="text-[#f5f0e8]">{proj.wordCount}</span>
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="pt-2 border-t border-[rgba(242,202,80,0.1)] flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[#7ee08a] font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      ✓ 100% Synced
                    </span>
                    <span className="text-[#f2ca50] font-bold flex items-center gap-1 group-hover:underline">
                      Open Project →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: EPISODE LISTING FOR SELECTED PROJECT */
        <div className="space-y-6">
          {/* Active Project Details Card */}
          <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.25)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.12)] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(242,202,80,0.1)] border border-[rgba(242,202,80,0.25)] flex items-center justify-center shrink-0">
                  <Film className="h-5 w-5 text-[#f2ca50]" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#9a9280] uppercase tracking-wider block">SELECTED PROJECT</span>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold italic text-[#f5f0e8]">
                    {currentProject.title} <span className="text-xs font-mono text-[#f2ca50] font-normal not-italic">({currentProject.id})</span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <button
                  onClick={() => {
                    setViewMode("catalog");
                    setSelectedProject(null);
                  }}
                  className="ghost-button px-3.5 py-1.5 rounded-lg text-[#9a9280] hover:text-[#f5f0e8]"
                >
                  ← Back to Project Catalog
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.12)]">
                <span className="text-[9px] text-[#9a9280] block">TYPE / GENRE</span>
                <span className="text-[#f5f0e8] font-bold">{currentProject.type} • {currentProject.genre}</span>
              </div>
              <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.12)]">
                <span className="text-[9px] text-[#9a9280] block">TOTAL EPISODES</span>
                <span className="text-[#f2ca50] font-bold">{currentProject.episodesCount} Episodes</span>
              </div>
              <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.12)]">
                <span className="text-[9px] text-[#9a9280] block">ESTIMATED WORDS</span>
                <span className="text-[#f5f0e8] font-bold">{currentProject.wordCount}</span>
              </div>
              <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.12)]">
                <span className="text-[9px] text-[#9a9280] block">MEMORY GRAPH STATUS</span>
                <span className="text-[#7ee08a] font-bold">✓ 100% Synced</span>
              </div>
            </div>
          </div>

          {/* Episode List Table */}
          <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.12)] pb-3">
              <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280] uppercase tracking-widest font-semibold">
                INGESTED EPISODES ({currentEpisodes.length})
              </span>

              <div className="relative font-mono text-xs">
                <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-[#9a9280]" />
                <input
                  type="text"
                  placeholder="Search episode or title..."
                  className="bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#f5f0e8] focus:border-[#f2ca50] outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(242,202,80,0.15)] text-[#9a9280] text-left">
                    <th className="py-2.5 px-3">EPISODE #</th>
                    <th className="py-2.5 px-3">SCRIPT TITLE</th>
                    <th className="py-2.5 px-3">WORDS</th>
                    <th className="py-2.5 px-3 text-center">FAST PASS</th>
                    <th className="py-2.5 px-3 text-center">DEEP EXTRACTION</th>
                    <th className="py-2.5 px-3 text-center">MEMORY GRAPH</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(242,202,80,0.08)]">
                  {currentEpisodes.map((ep) => (
                    <tr key={ep.id} className="hover:bg-[#141408] transition">
                      <td className="py-3 px-3 font-bold text-[#f2ca50]">Ep {ep.number}</td>
                      <td className="py-3 px-3 font-semibold text-[#f5f0e8]">{ep.title}</td>
                      <td className="py-3 px-3 text-[#9a9280]">{ep.wordCount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center text-[#7ee08a] font-bold">✓</td>
                      <td className="py-3 px-3 text-center text-[#7ee08a] font-bold">✓ {ep.deepExtraction}%</td>
                      <td className="py-3 px-3 text-center text-[#7ee08a] font-bold">{ep.graphStatus}%</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] px-2.5 py-0.5 rounded font-bold bg-[rgba(126,224,138,0.15)] text-[#7ee08a] border border-[rgba(126,224,138,0.3)]">
                          {ep.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (onSelectEpisode) onSelectEpisode(ep.id);
                          }}
                          className="text-[#f2ca50] font-bold hover:underline"
                        >
                          Select →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080800]/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="glass-panel border border-[rgba(242,202,80,0.3)] p-6 rounded-2xl max-w-md w-full space-y-5 shadow-2xl bg-[#0d0d08]"
          >
            <div className="flex justify-between items-center border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#f2ca50]" />
                <span style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold italic text-[#f5f0e8]">
                  Create New Project
                </span>
              </div>
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="text-[#9a9280] hover:text-[#f5f0e8]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[#9a9280] block text-[10px] uppercase font-bold">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cyberpunk 2099"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg p-2.5 text-xs text-[#f5f0e8] focus:border-[#f2ca50] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9a9280] block text-[10px] uppercase font-bold">Format Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "Series" | "Movie")}
                    className="w-full bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg p-2.5 text-xs text-[#f5f0e8] outline-none"
                  >
                    <option value="Series">TV / Audio Series</option>
                    <option value="Movie">Feature Movie</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#9a9280] block text-[10px] uppercase font-bold">Genre</label>
                  <input
                    type="text"
                    placeholder="e.g. Sci-Fi / Mystery"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg p-2.5 text-xs text-[#f5f0e8] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[rgba(242,202,80,0.15)] flex justify-end gap-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="ghost-button px-4 py-2 rounded-lg text-[#9a9280]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gold-button px-5 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(242,202,80,0.3)]"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
