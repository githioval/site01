"use client";

import { useEffect, useRef } from "react";

/**
 * BackgroundEffects
 * ─────────────────
 * Fixed atmospheric backdrop — orbs, mouse spotlight, noise texture.
 * Sits behind all content (z-index: -1) while the page scrolls over it.
 */
export default function BackgroundEffects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      container.style.setProperty("--mouse-x", `${e.clientX}px`);
      container.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="background-effects"
      aria-hidden="true"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Base fill */}
      <div className="absolute inset-0 bg-background" />

      {/* Layer 1 — drifting gradient orbs */}
      <div className="bg-orb bg-orb-green animate-drift-1" />
      <div className="bg-orb bg-orb-purple animate-drift-2" />
      <div className="bg-orb bg-orb-blue animate-drift-3" />

      {/* Layer 2 — mouse spotlight */}
      <div className="mouse-spotlight" />

      {/* Layer 3 — SVG noise texture */}
      <svg xmlns="http://www.w3.org/2000/svg" className="bg-noise h-full w-full">
        <filter id="bg-noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#bg-noise-filter)" />
      </svg>
    </div>
  );
}
