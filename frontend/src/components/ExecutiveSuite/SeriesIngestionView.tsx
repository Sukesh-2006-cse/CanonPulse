"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Play,
  RotateCcw,
  Plus,
  Search,
  X,
  Film,
  FolderPlus,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  Cpu,
  Upload,
} from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  type: "Series" | "Movie" | "Franchise";
  genre: string;
  episodesCount: number;
  wordCount: string;
  status: "Ready" | "Indexing" | "Draft";
  lastIngested: string;
}

interface EpisodeRecord {
  id: string;
  number: number;
  title: string;
  wordCount: number;
  status: "Complete" | "Processing" | "Queued";
  graphStatus: number;
  lastUpdated: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
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
];

const INITIAL_EPISODES: Record<string, EpisodeRecord[]> = {
  "TLMS-001": [
    { id: "ep-218", number: 218, title: "The Photograph", wordCount: 1642, status: "Complete", graphStatus: 100, lastUpdated: "14:42" },
    { id: "ep-219", number: 219, title: "The Confession", wordCount: 1821, status: "Complete", graphStatus: 100, lastUpdated: "14:41" },
    { id: "ep-220", number: 220, title: "The Vault", wordCount: 1503, status: "Complete", graphStatus: 100, lastUpdated: "14:40" },
    { id: "ep-221", number: 221, title: "Shadow Alliance", wordCount: 1740, status: "Complete", graphStatus: 100, lastUpdated: "14:38" },
  ],
  "NSHD-002": [
    { id: "ep-1", number: 1, title: "Neon Shadows Full Feature Script", wordCount: 45000, status: "Complete", graphStatus: 100, lastUpdated: "Yesterday" },
  ],
  "CHRD-003": [
    { id: "ep-101", number: 1, title: "Time Distortion Probe", wordCount: 2100, status: "Complete", graphStatus: 100, lastUpdated: "3 days ago" },
  ],
};

export const SeriesIngestionView: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>("TLMS-001");
  const [episodesMap, setEpisodesMap] = useState<Record<string, EpisodeRecord[]>>(INITIAL_EPISODES);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals visibility state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isUploadEpisodeModalOpen, setIsUploadEpisodeModalOpen] = useState(false);
  const [projectModalTab, setProjectModalTab] = useState<"switch" | "create">("switch");

  // Project Creation Form State
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectType, setNewProjectType] = useState<"Series" | "Movie">("Series");
  const [newProjectGenre, setNewProjectGenre] = useState("Thriller");

  // Individual Episode Upload Form State
  const [newEpisodeNumber, setNewEpisodeNumber] = useState<number>(1);
  const [newEpisodeTitle, setNewEpisodeTitle] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Active Project & Episodes lookup
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activeEpisodes = episodesMap[activeProjectId] || [];

  // Create Project Handler
  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    const newId = `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const newProj: ProjectItem = {
      id: newId,
      title: newProjectTitle,
      type: newProjectType,
      genre: newProjectGenre,
      episodesCount: 0,
      wordCount: "0 Words",
      status: "Ready",
      lastIngested: "Just now",
    };

    setProjects([newProj, ...projects]);
    setActiveProjectId(newId);
    setEpisodesMap((prev) => ({ ...prev, [newId]: [] }));

    setNewProjectTitle("");
    setIsProjectModalOpen(false);
  };

  // Upload Individual Episode Handler
  const handleUploadEpisode = () => {
    if (!newEpisodeTitle.trim()) return;
    const newEp: EpisodeRecord = {
      id: `ep-${Date.now()}`,
      number: newEpisodeNumber || activeEpisodes.length + 1,
      title: newEpisodeTitle,
      wordCount: 1500 + Math.floor(Math.random() * 600),
      status: "Complete",
      graphStatus: 100,
      lastUpdated: "Just now",
    };

    const updatedEps = [newEp, ...activeEpisodes];
    setEpisodesMap((prev) => ({ ...prev, [activeProjectId]: updatedEps }));

    // Update project episode count & word count
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              episodesCount: updatedEps.length,
              wordCount: `~${(updatedEps.length * 1600).toLocaleString()}`,
              lastIngested: "Just now",
            }
          : p
      )
    );

    setNewEpisodeTitle("");
    setUploadedFileName(null);
    setIsUploadEpisodeModalOpen(false);
  };

  const filteredEpisodes = activeEpisodes.filter(
    (ep) => ep.title.toLowerCase().includes(searchQuery.toLowerCase()) || ep.number.toString().includes(searchQuery)
  );

  return (
    <div className="-m-6 bg-[#080800] text-[#f5f0e8] min-h-screen p-6 md:p-8 space-y-6 font-sans border-t border-[rgba(242,202,80,0.12)]">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.15)] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold italic text-[#f5f0e8]">
              Series Ingestion
            </h1>

            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[rgba(126,224,138,0.15)] text-[#7ee08a] border border-[rgba(126,224,138,0.3)] font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#7ee08a]" />
              ✓ Series Memory Ready
            </span>
          </div>

          <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#9a9280] italic mt-0.5">
            Turn your back-catalog of scripts into persistent story memory and graph intelligence.
          </p>
        </div>

        {/* TOP HEADER BUTTON: PROJECTS / CATALOG SWITCHER */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => {
              setProjectModalTab("switch");
              setIsProjectModalOpen(true);
            }}
            className="gold-button px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(242,202,80,0.3)] active:scale-95"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Projects / Catalog ({projects.length})</span>
          </button>
        </div>
      </div>

      {/* ACTIVE PROJECT CARD WITH "+ ADD EPISODES" BUTTON */}
      <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.12)] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(242,202,80,0.1)] border border-[rgba(242,202,80,0.25)] flex items-center justify-center shrink-0">
              <Film className="h-5 w-5 text-[#f2ca50]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#9a9280] uppercase tracking-wider block">CURRENT ACTIVE PROJECT</span>
              <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold italic text-[#f5f0e8]">
                {activeProject.title} <span className="text-xs font-mono text-[#f2ca50] font-normal not-italic">({activeProject.id})</span>
              </h2>
            </div>
          </div>

          {/* BUTTON FOR ADDING EPISODES */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={() => {
                setNewEpisodeNumber(activeEpisodes.length + 1);
                setNewEpisodeTitle("");
                setUploadedFileName(null);
                setIsUploadEpisodeModalOpen(true);
              }}
              className="gold-button px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(242,202,80,0.3)] active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Episodes</span>
            </button>
          </div>
        </div>

        {/* Project Metadata Streamlined Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.12)]">
            <span className="text-[9px] text-[#9a9280] block">TYPE / GENRE</span>
            <span className="text-[#f5f0e8] font-bold">{activeProject.type} • {activeProject.genre}</span>
          </div>
          <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.12)]">
            <span className="text-[9px] text-[#9a9280] block">EPISODES INGESTED</span>
            <span className="text-[#f2ca50] font-bold">{activeProject.episodesCount} Episodes</span>
          </div>
          <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.12)]">
            <span className="text-[9px] text-[#9a9280] block">TOTAL WORD COUNT</span>
            <span className="text-[#f5f0e8] font-bold">{activeProject.wordCount}</span>
          </div>
          <div className="bg-[#080800] p-3 rounded-xl border border-[rgba(242,202,80,0.12)]">
            <span className="text-[9px] text-[#9a9280] block">MEMORY GRAPH STATUS</span>
            <span className="text-[#7ee08a] font-bold">✓ 100% Synced</span>
          </div>
        </div>
      </div>

      {/* EPISODES & SCRIPT MAINTENANCE LIBRARY */}
      <div className="glass-panel p-5 rounded-2xl border border-[rgba(242,202,80,0.2)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,202,80,0.12)] pb-3">
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs text-[#9a9280] uppercase tracking-widest font-semibold">
              INGESTED EPISODES ({activeEpisodes.length})
            </span>
          </div>

          <div className="relative font-mono text-xs">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-[#9a9280]" />
            <input
              type="text"
              placeholder="Search episode or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#f5f0e8] focus:border-[#f2ca50] outline-none"
            />
          </div>
        </div>

        {/* Clean Episodes Table */}
        {filteredEpisodes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[rgba(242,202,80,0.15)] text-[#9a9280] text-left">
                  <th className="py-2.5 px-3">EPISODE #</th>
                  <th className="py-2.5 px-3">SCRIPT TITLE</th>
                  <th className="py-2.5 px-3">WORDS</th>
                  <th className="py-2.5 px-3 text-center">MEMORY GRAPH</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">LAST UPDATED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(242,202,80,0.08)]">
                {filteredEpisodes.map((ep) => (
                  <tr key={ep.id} className="hover:bg-[#141408] transition">
                    <td className="py-3 px-3 font-bold text-[#f2ca50]">Ep {ep.number}</td>
                    <td className="py-3 px-3 font-semibold text-[#f5f0e8]">{ep.title}</td>
                    <td className="py-3 px-3 text-[#9a9280]">{ep.wordCount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[#7ee08a] font-bold">{ep.graphStatus}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2.5 py-0.5 rounded font-bold bg-[rgba(126,224,138,0.15)] text-[#7ee08a] border border-[rgba(126,224,138,0.3)]">
                        {ep.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-[#9a9280]">{ep.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[#080800] p-8 rounded-xl border border-[rgba(242,202,80,0.15)] text-center space-y-3 font-mono text-xs">
            <span className="text-[#9a9280] block">No episodes ingested for this project yet.</span>
            <button
              onClick={() => {
                setNewEpisodeNumber(1);
                setNewEpisodeTitle("");
                setUploadedFileName(null);
                setIsUploadEpisodeModalOpen(true);
              }}
              className="gold-button px-5 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(242,202,80,0.3)]"
            >
              + Add First Episode Script
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          MODAL 1: PROJECT CATALOG & CREATION MODAL
      ───────────────────────────────────────────────────────────────────────── */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080800]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel border border-[rgba(242,202,80,0.3)] p-6 rounded-2xl max-w-xl w-full space-y-6 shadow-2xl bg-[#0d0d08]">
            <div className="flex justify-between items-center border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-[#f2ca50]" />
                <span style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold italic text-[#f5f0e8]">
                  Projects & Catalog Management
                </span>
              </div>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-[#9a9280] hover:text-[#f5f0e8]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-2 font-mono text-xs border-b border-[rgba(242,202,80,0.1)] pb-2">
              <button
                onClick={() => setProjectModalTab("switch")}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  projectModalTab === "switch"
                    ? "bg-[rgba(242,202,80,0.2)] text-[#f2ca50] border border-[rgba(242,202,80,0.3)]"
                    : "text-[#9a9280] hover:text-[#f5f0e8]"
                }`}
              >
                Select Existing Project ({projects.length})
              </button>
              <button
                onClick={() => setProjectModalTab("create")}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  projectModalTab === "create"
                    ? "bg-[rgba(242,202,80,0.2)] text-[#f2ca50] border border-[rgba(242,202,80,0.3)]"
                    : "text-[#9a9280] hover:text-[#f5f0e8]"
                }`}
              >
                + Create New Project
              </button>
            </div>

            {/* TAB 1: SWITCH PROJECT */}
            {projectModalTab === "switch" && (
              <div className="space-y-3 font-mono text-xs">
                <span className="text-[#9a9280] block text-[11px]">Select a project to activate its story memory context:</span>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setActiveProjectId(proj.id);
                        setIsProjectModalOpen(false);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        activeProjectId === proj.id
                          ? "bg-[#141408] border-[#f2ca50]"
                          : "bg-[#080800] border-[rgba(242,202,80,0.15)] hover:border-[rgba(242,202,80,0.3)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Film className="h-4 w-4 text-[#f2ca50]" />
                        <div>
                          <span className="font-bold text-[#f5f0e8] text-sm block">{proj.title}</span>
                          <span className="text-[10px] text-[#9a9280]">{proj.type} • {proj.genre} • {proj.episodesCount} Episodes</span>
                        </div>
                      </div>
                      <span className="text-[#f2ca50] font-bold text-xs">Select →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: CREATE PROJECT */}
            {projectModalTab === "create" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[#9a9280] block text-[10px] uppercase font-bold">Project / Movie Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Cyberpunk 2099"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    className="w-full bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg p-2.5 text-xs text-[#f5f0e8] focus:border-[#f2ca50] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#9a9280] block text-[10px] uppercase font-bold">Format Type</label>
                    <select
                      value={newProjectType}
                      onChange={(e) => setNewProjectType(e.target.value as "Series" | "Movie")}
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
                      value={newProjectGenre}
                      onChange={(e) => setNewProjectGenre(e.target.value)}
                      className="w-full bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg p-2.5 text-xs text-[#f5f0e8] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[rgba(242,202,80,0.15)] flex justify-end gap-3 font-mono text-xs">
              <button onClick={() => setIsProjectModalOpen(false)} className="ghost-button px-4 py-2 rounded-lg text-[#9a9280]">
                Cancel
              </button>
              {projectModalTab === "create" && (
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectTitle.trim()}
                  className="gold-button px-5 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(242,202,80,0.3)] disabled:opacity-50"
                >
                  Create Project
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          MODAL 2: UPLOAD INDIVIDUAL EPISODE SCRIPT MODAL
      ───────────────────────────────────────────────────────────────────────── */}
      {isUploadEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080800]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel border border-[rgba(242,202,80,0.3)] p-6 rounded-2xl max-w-lg w-full space-y-6 shadow-2xl bg-[#0d0d08]">
            <div className="flex justify-between items-center border-b border-[rgba(242,202,80,0.15)] pb-3">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#f2ca50]" />
                <span style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold italic text-[#f5f0e8]">
                  Upload Episode for {activeProject.title}
                </span>
              </div>
              <button onClick={() => setIsUploadEpisodeModalOpen(false)} className="text-[#9a9280] hover:text-[#f5f0e8]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#9a9280] block text-[10px] uppercase font-bold">Episode #</label>
                  <input
                    type="number"
                    value={newEpisodeNumber}
                    onChange={(e) => setNewEpisodeNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg p-2.5 text-xs text-[#f2ca50] font-bold outline-none"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[#9a9280] block text-[10px] uppercase font-bold">Script Title</label>
                  <input
                    type="text"
                    placeholder="e.g. The Forgotten Reveal"
                    value={newEpisodeTitle}
                    onChange={(e) => setNewEpisodeTitle(e.target.value)}
                    className="w-full bg-[#080800] border border-[rgba(242,202,80,0.2)] rounded-lg p-2.5 text-xs text-[#f5f0e8] focus:border-[#f2ca50] outline-none"
                  />
                </div>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setUploadedFileName(e.dataTransfer.files[0].name);
                    if (!newEpisodeTitle) {
                      setNewEpisodeTitle(e.dataTransfer.files[0].name.replace(/\.[^/.]+$/, ""));
                    }
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all space-y-2 ${
                  dragActive ? "border-[#f2ca50] bg-[rgba(242,202,80,0.1)]" : "border-[rgba(242,202,80,0.2)] bg-[#080800]"
                }`}
              >
                <UploadCloud className="h-7 w-7 text-[#f2ca50]" />
                <p className="text-xs font-bold text-[#f5f0e8]">
                  {uploadedFileName ? `File Attached: ${uploadedFileName}` : "Drag & drop script file (.txt, .pdf, .md)"}
                </p>
                <label className="gold-button inline-block px-3.5 py-1.5 rounded-lg cursor-pointer text-xs font-bold">
                  Browse File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFileName(e.target.files[0].name);
                        if (!newEpisodeTitle) {
                          setNewEpisodeTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="pt-2 border-t border-[rgba(242,202,80,0.15)] flex justify-end gap-3 font-mono text-xs">
              <button onClick={() => setIsUploadEpisodeModalOpen(false)} className="ghost-button px-4 py-2 rounded-lg text-[#9a9280]">
                Cancel
              </button>
              <button
                onClick={handleUploadEpisode}
                disabled={!newEpisodeTitle.trim()}
                className="gold-button px-5 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(242,202,80,0.3)] disabled:opacity-50"
              >
                Upload & Ingest Episode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
