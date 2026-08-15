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

export default function Home() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080800] text-[#f5f0e8] font-sans selection:bg-[#f2ca50] selection:text-[#080800] relative">
      {/* Interactive Floating Narrative Node Constellation Background */}
      <InteractiveBackground />

      {/* Interactive Golden Fountain Pen / Spotlight Cursor Manager */}
      <WriterCursorTrail />

      {/* Sticky Header Navbar */}
      <Navbar onOpenAudit={() => setIsAuditModalOpen(true)} />

      {/* Main Page Landing Sections */}
      <main className="relative z-10">
        <Hero onOpenAudit={() => setIsAuditModalOpen(true)} />
        <DebtHeatmapSection />
        <ComparisonSection />
        <ArchitectureDiagram />
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
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
