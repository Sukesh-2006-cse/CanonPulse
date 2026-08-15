"use client";

import React from "react";
import { GitBranch, FileText, Users, BarChart3 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: GitBranch,
      title: "Dual-Layer Graph",
      tagline: "G_perceived × G_true",
      description: "Maps audience presentation order against true story-time to distinguish genuine plot holes from setup payoffs.",
      borderColor: "border-[rgba(242,202,80,0.4)]",
      hoverBorder: "hover:border-[#f2ca50]",
      iconColor: "#f2ca50",
      accentGlow: "rgba(242,202,80,0.1)",
      delay: 150,
    },
    {
      icon: FileText,
      title: "Evidence Drawer",
      tagline: "Citation-first verdicts",
      description: "Every verdict is backed by source text citations so writers can argue with specific graph assertions.",
      borderColor: "border-[rgba(126,224,138,0.3)]",
      hoverBorder: "hover:border-[#7ee08a]",
      iconColor: "#7ee08a",
      accentGlow: "rgba(126,224,138,0.08)",
      delay: 250,
    },
    {
      icon: Users,
      title: "Audience Cohorts",
      tagline: "Structural reader simulation",
      description: "Simulate how different reader profiles experience narrative pacing, mystery tolerance, and emotional payoff timing.",
      borderColor: "border-[rgba(255,179,71,0.3)]",
      hoverBorder: "hover:border-[#ffb347]",
      iconColor: "#ffb347",
      accentGlow: "rgba(255,179,71,0.08)",
      delay: 350,
    },
    {
      icon: BarChart3,
      title: "Debt Heatmap",
      tagline: "Promise-age visualisation",
      description: "Quantify and monitor accumulated narrative debt across hundreds of episodes to prevent audience churn before it happens.",
      borderColor: "border-[rgba(255,92,77,0.3)]",
      hoverBorder: "hover:border-[#ff5c4d]",
      iconColor: "#ff5c4d",
      accentGlow: "rgba(255,92,77,0.08)",
      delay: 450,
    },
  ];

  return (
    <section id="features" className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.1)] bg-[#080800]/40 overflow-hidden">
      <div className="absolute top-10 left-10 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.1)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-14">
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-[0.28em] text-[#f2ca50] uppercase">CAPABILITIES</p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Built for the
              <br />
              <em className="italic text-[#d4c49a]">long form.</em>
            </h2>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-base text-[#9a9280] italic">
              Four core capabilities designed specifically for audio fiction, web serials, and multi-season franchises.
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <ScrollReveal key={feat.title} direction="up" delay={feat.delay}>
                <div
                  className={`glass-panel p-8 rounded-xl border transition-all duration-300 hover:scale-[1.015] ${feat.borderColor} ${feat.hoverBorder}`}
                  style={{ boxShadow: `inset 0 0 40px ${feat.accentGlow}` }}
                >
                  <div className="flex items-start gap-5 mb-5">
                    <div
                      className="p-3 rounded-lg bg-[#080800] border flex-shrink-0"
                      style={{ borderColor: feat.iconColor + "40" }}
                    >
                      <Icon className="h-6 w-6" style={{ color: feat.iconColor }} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }} className="text-xl font-semibold italic">
                        {feat.title}
                      </h3>
                      <p style={{ fontFamily: "var(--font-mono)", color: feat.iconColor }} className="text-[11px] tracking-wider mt-0.5 uppercase opacity-80">
                        {feat.tagline}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#9a9280] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
