"use client";

import React, { useState, useRef } from "react";

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tiltIntensity?: number; // 1.0 = standard, 0.25 = subtle
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = "",
  glowColor = "rgba(242, 202, 80, 0.35)",
  tiltIntensity = 1.0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [cssVars, setCssVars] = useState<React.CSSProperties>({
    "--edge-proximity": "0",
    "--cursor-angle": "45deg",
  } as React.CSSProperties);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate angle from center to cursor
    const angleRad = Math.atan2(y - centerY, x - centerX);
    let angleDeg = (angleRad * (180 / Math.PI) + 90) % 360;
    if (angleDeg < 0) angleDeg += 360;

    // Calculate edge proximity percentage (closer to edge = higher proximity)
    const dx = Math.abs(x - centerX) / centerX;
    const dy = Math.abs(y - centerY) / centerY;
    const edgeDist = Math.max(dx, dy); // 0 at center, 1 at edge
    const proximity = Math.min(100, Math.max(0, Math.round(edgeDist * 100)));

    // Calculate tilt angle dampened by tiltIntensity
    const maxDegree = 6 * tiltIntensity;
    const rotateX = ((y - centerY) / centerY) * -maxDegree;
    const rotateY = ((x - centerX) / centerX) * maxDegree;
    const scaleAmount = 1 + 0.015 * tiltIntensity;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleAmount}, ${scaleAmount}, 1)`);

    // Glare position in percentages
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.15 * tiltIntensity });

    setCssVars({
      "--edge-proximity": `${proximity}`,
      "--cursor-angle": `${angleDeg.toFixed(1)}deg`,
    } as React.CSSProperties);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    setCssVars({
      "--edge-proximity": "0",
      "--cursor-angle": "45deg",
    } as React.CSSProperties);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`border-glow-card transition-transform duration-200 cubic-bezier(0.16, 1, 0.3, 1) ${className}`}
      style={{
        transform,
        transformStyle: "preserve-3d",
        ...cssVars,
      }}
    >
      {/* Outer edge light layer for mouse-following border glow */}
      <div className="edge-light" />

      {/* Dynamic Mouse Glare Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle 260px at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 80%)`,
        }}
      />

      <div className="border-glow-inner flex-1 flex flex-col relative z-10">
        {children}
      </div>
    </div>
  );
};
