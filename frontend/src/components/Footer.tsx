"use client";

import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-[rgba(242,202,80,0.12)] bg-[#080800] py-14 overflow-hidden">
      {/* Subtle golden glow in corner */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(242,202,80,0.14)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Horizontal Gold Divider */}
        <div className="divider-gold mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-[rgba(242,202,80,0.4)] bg-[#141408] text-[#f2ca50]">
                <BookOpen className="h-4 w-4" />
              </div>
              <span style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold italic text-[#f5f0e8]">
                CanonPulse
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-body)" }} className="text-sm text-[#9a9280] italic leading-relaxed max-w-xs">
              Every clue, vow, wound, threat, and romance arc is a promise made to a reader.
              CanonPulse protects the ones you already shipped.
            </p>
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] text-[#9a9280]/60 tracking-wider">
              © 2026 CANONPULSE. All rights reserved.
            </p>
          </div>

          {/* Nav: Product */}
          <div className="space-y-4">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] font-bold tracking-[0.22em] text-[#f2ca50] uppercase">
              PRODUCT
            </p>
            <ul style={{ fontFamily: "var(--font-body)" }} className="space-y-2.5 text-sm text-[#9a9280] italic">
              {["Overview", "Dual-Layer Architecture", "Interactive Playground", "Features"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#f2ca50] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav: Resources */}
          <div className="space-y-4">
            <p style={{ fontFamily: "var(--font-mono)" }} className="text-[10px] font-bold tracking-[0.22em] text-[#f2ca50] uppercase">
              RESOURCES
            </p>
            <ul style={{ fontFamily: "var(--font-body)" }} className="space-y-2.5 text-sm text-[#9a9280] italic">
              {["Writers' Room", "Documentation", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#f2ca50] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="divider-gold mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center">
          <p style={{ fontFamily: "var(--font-body)" }} className="text-xs text-[#9a9280] italic">
            Standalone, platform-independent narrative continuity system for serialized fiction.
          </p>
          <p style={{ fontFamily: "var(--font-display)" }} className="text-sm text-[#d4c49a] italic font-medium">
            Protect the story. Own the canon.
          </p>
        </div>
      </div>
    </footer>
  );
};
