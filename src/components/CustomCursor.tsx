"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type CursorMode = "default" | "view" | "explore" | "drag";

const LABELS: Record<Exclude<CursorMode, "default" | "drag">, string> = {
  view: "VIEW",
  explore: "EXPLORE",
};

/**
 * CustomCursor
 * ────────────
 * Fluid, magnetic cursor with trailing ring.
 * - Inner dot follows quickly (quickTo 0.15s)
 * - Outer ring lags behind (quickTo 0.55s)
 * - Hover states driven by data-cursor attributes on elements
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<CursorMode>("default");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("cursor-none");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const arrows = arrowsRef.current;
    if (!dot || !ring || !label || !arrows) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const setMode = (mode: CursorMode) => {
      if (modeRef.current === mode) return;
      modeRef.current = mode;

      const isInteractive = mode !== "default";
      const isDrag = mode === "drag";

      gsap.to(ring, {
        scale: isInteractive ? 2.2 : 1,
        duration: 0.45,
        ease: "power3.out",
      });

      gsap.to(dot, {
        scale: isInteractive ? 0 : 1,
        duration: 0.3,
        ease: "power3.out",
      });

      ring.style.mixBlendMode = isInteractive ? "difference" : "normal";

      if (isDrag) {
        label.textContent = "DRAG";
        label.style.opacity = "1";
        arrows.style.opacity = "1";
      } else if (mode === "view" || mode === "explore") {
        label.textContent = LABELS[mode];
        label.style.opacity = "1";
        arrows.style.opacity = "0";
      } else {
        label.textContent = "";
        label.style.opacity = "0";
        arrows.style.opacity = "0";
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const cursorEl = target?.closest("[data-cursor]") as HTMLElement | null;
      const cursorValue = cursorEl?.dataset.cursor;

      if (cursorValue === "drag") setMode("drag");
      else if (cursorValue === "view") setMode("view");
      else if (cursorValue === "explore") setMode("explore");
      else if (target?.closest("a, button")) setMode("explore");
      else setMode("default");
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    const onMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.body.classList.remove("cursor-none");
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      aria-hidden="true"
    >
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent"
        style={{
          boxShadow:
            "0 0 8px rgba(0,255,136,0.8), 0 0 20px rgba(0,255,136,0.3)",
        }}
      />

      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-accent/60"
        style={{
          boxShadow:
            "0 0 16px rgba(0,255,136,0.25), 0 0 40px rgba(0,255,136,0.1)",
        }}
      >
        <div
          ref={arrowsRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 opacity-0"
        >
          <span className="text-[9px] text-white">←</span>
          <span className="text-[9px] text-white">→</span>
        </div>
        <span
          ref={labelRef}
          className="relative z-10 font-sans text-[8px] font-medium uppercase tracking-widest text-white opacity-0"
        />
      </div>
    </div>
  );
}
