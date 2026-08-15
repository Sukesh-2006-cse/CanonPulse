"use client";

import React from "react";
import { Quote } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { MotionCard } from "./MotionCard";

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        "In Season 4 of our audio serial, a minor line from Episode 14 suddenly threatened our main finale twist. CanonPulse caught the contradiction 6 months before production.",
      author: "Elena Rostova",
      role: "Showrunner & Head Writer",
      work: "The Monsoon Protocol (220 Eps)",
      goldBorder: "border-[#f2ca50]/40",
      glowColor: "rgba(242, 202, 80, 0.2)",
    },
    {
      quote:
        "Traditional checkers flag every twist as an error. CanonPulse is the first tool that understands intentional setup-to-payoff mechanics across hundreds of episodes.",
      author: "Marcus Vance",
      role: "Narrative Director",
      work: "Aethelgard Audio Studios",
      goldBorder: "border-[#7ee08a]/40",
      glowColor: "rgba(126, 224, 138, 0.2)",
    },
    {
      quote:
        "When handing off writing duties for Season 3 to our localization team, CanonPulse served as our single source of canonical truth. Invaluable tool.",
      author: "Sarah Lin",
      role: "Web Serial Author & Editor",
      work: "Shadows of Valen (180 Eps)",
      goldBorder: "border-[#ffb347]/40",
      glowColor: "rgba(255, 179, 71, 0.2)",
    },
  ];

  return (
    <section className="section-glow relative py-28 border-b border-[rgba(242,202,80,0.1)] bg-[#080800]/40 overflow-hidden">
      <div className="absolute top-1/2 -right-20 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.14)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-14">
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] tracking-[0.28em] text-[#f2ca50] uppercase">
              WRITERS&rsquo; ROOM PERSPECTIVES
            </p>
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f0e8] leading-tight"
            >
              Trusted by creators of
              <br />
              <em className="italic text-[#d4c49a]">long-running worlds.</em>
            </h2>
          </div>
        </ScrollReveal>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={t.author} direction="up" delay={idx * 150 + 100}>
              <MotionCard glowColor={t.glowColor}>
                <div className={`glass-panel p-8 rounded-xl border ${t.goldBorder} flex flex-col justify-between h-full space-y-6`}>
                  <div className="space-y-4">
                    <Quote className="h-6 w-6 text-[#f2ca50] opacity-80" />
                    <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#f5f0e8] leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[rgba(242,202,80,0.1)]">
                    <p style={{ fontFamily: "var(--font-display)" }} className="text-base font-semibold italic text-[#f5f0e8]">
                      {t.author}
                    </p>
                    <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#f2ca50] mt-0.5">
                      {t.role}
                    </p>
                    <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280]">
                      {t.work}
                    </p>
                  </div>
                </div>
              </MotionCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
