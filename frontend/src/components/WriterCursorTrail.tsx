"use client";

import React, { useEffect, useState, useRef } from "react";

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export const WriterCursorTrail: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [penPos, setPenPos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isMouseOutside, setIsMouseOutside] = useState(false);
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const animFrameId = useRef<number | null>(null);
  const burstIdCounter = useRef(0);
  const lastPenPos = useRef({ x: -100, y: -100 });

  // Keep track of penPos in ref for burst spawning
  useEffect(() => {
    lastPenPos.current = penPos;
  }, [penPos]);

  const triggerGoldBurst = (originX: number, originY: number) => {
    const newParticles: BurstParticle[] = [];
    const particleCount = 24;

    for (let i = 0; i < particleCount; i++) {
      burstIdCounter.current += 1;
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 3.5 + 1.5;
      newParticles.push({
        id: burstIdCounter.current,
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        opacity: 1,
      });
    }

    setBurstParticles(newParticles);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (isMouseOutside) setIsMouseOutside(false);

      // Check if hovering interactive element (including Navbar links & buttons)
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("a") ||
          target.onclick !== null)
      ) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if cursor actually left document viewport
      if (!e.relatedTarget && (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        setIsMouseOutside(true);
        triggerGoldBurst(lastPenPos.current.x, lastPenPos.current.y);
      }
    };

    const handleMouseEnter = () => {
      setIsMouseOutside(false);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMouseOutside]);

  // Responsive position tracking & burst particle animation
  useEffect(() => {
    const loop = () => {
      setPenPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.45,
        y: prev.y + (pos.y - prev.y) * 0.45,
      }));

      // Update & fade out burst particles
      setBurstParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.03,
          }))
          .filter((p) => p.opacity > 0)
      );

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [pos]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Soft Warm Golden Ambient Spotlight Halo */}
      <div
        className="fixed top-0 left-0 transition-opacity duration-300 pointer-events-none"
        style={{
          transform: `translate3d(${penPos.x - 90}px, ${penPos.y - 90}px, 0)`,
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242, 202, 80, 0.18) 0%, rgba(242, 202, 80, 0.05) 45%, transparent 70%)",
          opacity: isMouseOutside || pos.x < 0 ? 0 : 1,
        }}
      />

      {/* Burst Golden Spark Particles on Hover Away */}
      {burstParticles.map((p) => (
        <div
          key={p.id}
          className="fixed top-0 left-0 rounded-full bg-[#ffd966] shadow-[0_0_12px_rgba(242,202,80,0.9)] pointer-events-none"
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Right-to-Left Slanting Gold Feather Quill (Fades out into burst on hover away) */}
      <div
        className="fixed top-0 left-0 transition-all duration-300 ease-out"
        style={{
          transform: `translate3d(${penPos.x - 2}px, ${penPos.y - 32}px, 0) rotate(${
            isHoveringClickable ? "15deg" : "0deg"
          }) scale(${isMouseOutside ? 1.4 : isClicking ? 0.85 : isHoveringClickable ? 1.1 : 1})`,
          transformOrigin: "2px 32px",
          opacity: isMouseOutside || pos.x < 0 ? 0 : 1,
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 36 36"
          fill="none"
          className="drop-shadow-[0_0_12px_rgba(242,202,80,0.85)]"
        >
          <defs>
            <linearGradient id="featherGoldGradRTL" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff3b8" />
              <stop offset="35%" stopColor="#ffd966" />
              <stop offset="70%" stopColor="#f2ca50" />
              <stop offset="100%" stopColor="#b87f0a" />
            </linearGradient>

            <filter id="featherGlowRTL" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Main Feather Spine extending from tip (2,32) up-right to (32,2) */}
          <path
            d="M 2 32 C 8 26 14 18 20 12 T 32 2"
            stroke="#ffea9f"
            strokeWidth="1.4"
            strokeLinecap="round"
            filter="url(#featherGlowRTL)"
          />

          {/* Top Feather Plume Flange */}
          <path
            d="M 2 32 C 4 26 8 20 14 14 C 20 8 26 4 32 2 C 26 8 22 14 16 20 C 10 26 5 30 2 32 Z"
            fill="url(#featherGoldGradRTL)"
            stroke="#ffea9f"
            strokeWidth="0.5"
          />

          {/* Bottom Feather Plume Flange */}
          <path
            d="M 2 32 C 8 30 14 26 20 20 C 26 14 30 8 32 2 C 24 6 18 12 12 18 C 6 24 3 28 2 32 Z"
            fill="url(#featherGoldGradRTL)"
            opacity="0.88"
          />

          {/* Feather Barb Cuts */}
          <line x1="8" y1="26" x2="12" y2="28" stroke="#8a5800" strokeWidth="0.5" opacity="0.6" />
          <line x1="14" y1="20" x2="18" y2="22" stroke="#8a5800" strokeWidth="0.5" opacity="0.6" />
          <line x1="20" y1="14" x2="24" y2="16" stroke="#8a5800" strokeWidth="0.5" opacity="0.6" />
          <line x1="26" y1="8" x2="30" y2="10" stroke="#8a5800" strokeWidth="0.5" opacity="0.6" />

          {/* Sharp Writing Tip Point */}
          <circle cx="2" cy="32" r="0.9" fill="#ffffff" />
        </svg>

        {/* Ink ripple on mouse click */}
        {isClicking && (
          <div className="absolute bottom-[4px] left-[2px] h-6 w-6 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#f2ca50] bg-[#f2ca50]/40 animate-ping" />
        )}
      </div>
    </div>
  );
};
