"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface NavbarProps {
  onOpenAudit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAudit }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(242,202,80,0.12)] bg-[#080800]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-[rgba(242,202,80,0.4)] bg-[#141408] text-[#f2ca50] shadow-[0_0_18px_rgba(242,202,80,0.2)] transition-all group-hover:shadow-[0_0_28px_rgba(242,202,80,0.4)]">
            <BookOpen className="h-4 w-4" />
          </div>
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-lg font-semibold tracking-[0.15em] text-[#f5f0e8] italic"
          >
            CanonPulse
          </span>
        </Link>

        {/* Navigation Links */}
        <nav
          style={{ fontFamily: "var(--font-body)" }}
          className="hidden md:flex items-center gap-8 text-sm text-[#9a9280]"
        >
          <a href="#overview" className="transition-colors hover:text-[#f2ca50] hover:italic">
            Overview
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-[#f2ca50] hover:italic">
            How It Works
          </a>
          <a href="#features" className="transition-colors hover:text-[#f2ca50] hover:italic">
            Features
          </a>
          <a href="#architecture" className="transition-colors hover:text-[#f2ca50] hover:italic">
            Architecture
          </a>
          <a href="#playground" className="transition-colors hover:text-[#f2ca50] hover:italic">
            Playground
          </a>
          <a href="#writers-room" className="transition-colors hover:text-[#f2ca50] hover:italic">
            Writers&rsquo; Room
          </a>
        </nav>

        {/* CTA Button */}
        <button
          onClick={onOpenAudit}
          style={{ fontFamily: "var(--font-body)" }}
          className="gold-button flex items-center gap-2 rounded px-5 py-2.5 text-sm font-semibold"
        >
          <span>Start Audit</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
};
