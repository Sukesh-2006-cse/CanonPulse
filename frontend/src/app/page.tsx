"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DebtHeatmapSection } from "@/components/DebtHeatmapSection";
import { ComparisonSection } from "@/components/ComparisonSection";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { DashboardShowcase } from "@/components/DashboardShowcase";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { ComparisonTableSection } from "@/components/ComparisonTableSection";
import { InteractivePlayground } from "@/components/InteractivePlayground";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FaqSection } from "@/components/FaqSection";
import { AuditModal } from "@/components/AuditModal";
import { Footer } from "@/components/Footer";
import { WriterCursorTrail } from "@/components/WriterCursorTrail";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { ExecutiveSuiteDashboard } from "@/components/ExecutiveSuite/ExecutiveSuiteDashboard";

export default function Home() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [showSuite, setShowSuite] = useState(false);
  const [suiteTab, setSuiteTab] = useState<"overview" | "graphengine" | "ingestion" | "findings" | "surfaces" | "personacollab" | "continuitystudio">("overview");

  // Sync hash routing on mount and hashchange
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#suite" || hash === "#executive-suite" || hash === "#audit") {
        setShowSuite(true);
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (hash === "#continuity-studio" || hash === "#continuitystudio") {
        setSuiteTab("continuitystudio");
        setShowSuite(true);
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleOpenSuite = (tab: "overview" | "graphengine" | "ingestion" | "findings" | "surfaces" | "personacollab" | "continuitystudio" = "overview") => {
    setSuiteTab(tab);
    setShowSuite(true);
    if (typeof window !== "undefined") {
      window.location.hash = "suite";
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleBackToLanding = () => {
    setShowSuite(false);
    if (typeof window !== "undefined") {
      window.location.hash = "";
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  if (showSuite) {
    return (
      <ExecutiveSuiteDashboard
        initialTab={suiteTab}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080800] text-[#f5f0e8] font-sans selection:bg-[#f2ca50] selection:text-[#080800] relative">
      {/* Interactive Floating Narrative Node Constellation Background */}
      <InteractiveBackground />

      {/* Interactive Golden Fountain Pen / Spotlight Cursor Manager */}
      <WriterCursorTrail />

      {/* Sticky Header Navbar */}
      <Navbar onOpenAudit={() => handleOpenSuite("overview")} />

      {/* Main Page Landing Sections */}
      <main className="relative z-10">
        <Hero onOpenAudit={() => handleOpenSuite("overview")} />
        <DebtHeatmapSection />
        <ComparisonSection />
        <ArchitectureDiagram />

        {/* Executive Suite Showcase Section */}
        <section id="executive-suite" className="py-20 border-t border-[rgba(242,202,80,0.1)] bg-[#0d0d08]/80">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-xs font-semibold tracking-[0.2em] text-[#f2ca50] uppercase border border-[rgba(242,202,80,0.3)] bg-[rgba(242,202,80,0.06)] px-4 py-1.5 rounded-full"
            >
              FULL WORKSPACE SUITE
            </span>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-5xl font-semibold italic text-[#f5f0e8]">
              CanonPulse Executive Suite
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-[#9a9280] italic max-w-2xl mx-auto text-base">
              Continuity Assessment Engine, Series Ingestion, Findings &amp; Evidence citations, and 5 active Writer Surfaces.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => handleOpenSuite("overview")}
                className="gold-button px-8 py-3 rounded-lg text-sm font-semibold"
              >
                Launch Executive Suite
              </button>
              <button
                onClick={() => handleOpenSuite("ingestion")}
                className="ghost-button px-8 py-3 rounded-lg text-sm font-semibold"
              >
                Upload Series Bible
              </button>
            </div>
          </div>
        </section>

        <DashboardShowcase />
        <FeaturesGrid />
        <ComparisonTableSection />
        <InteractivePlayground />
        <TestimonialsSection />
        <FaqSection />
      </main>

      {/* Global Audit Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onLaunchSuite={() => handleOpenSuite("overview")}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
