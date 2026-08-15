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
  glowColor = "rgba(242, 202, 80, 0.25)",
  tiltIntensity = 1.0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate tilt angle dampened by tiltIntensity
    const maxDegree = 7 * tiltIntensity;
    const rotateX = ((y - centerY) / centerY) * -maxDegree;
    const rotateY = ((x - centerX) / centerX) * maxDegree;
    const scaleAmount = 1 + 0.015 * tiltIntensity;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleAmount}, ${scaleAmount}, 1)`);

    // Glare position in percentages
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.12 * tiltIntensity });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-transform duration-200 cubic-bezier(0.16, 1, 0.3, 1) ${className}`}
      style={{
        transform,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic Mouse Glare Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle 250px at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};
