"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once at module level so all child components can use ScrollTrigger.
gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScrollProvider
 * ─────────────────────
 * Wraps the app in Lenis smooth scrolling and keeps it in sync with GSAP ScrollTrigger.
 *
 * Sync strategy:
 * 1. Lenis "scroll" event → ScrollTrigger.update() recalculates pin positions.
 * 2. GSAP's ticker drives Lenis's rAF loop so both run on the same clock.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
