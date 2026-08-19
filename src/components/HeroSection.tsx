"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import TextReveal from "./TextReveal";
import HeroStarfield from "./HeroStarfield";

/**
 * HeroSection
 * ───────────
 * Full-viewport hero. Headline uses TextReveal (load trigger);
 * remaining elements fade up in sequence via GSAP timeline.
 */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero='eyebrow']", {
        y: 40,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          "[data-hero='subtitle']",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          1.4 // after headline reveal completes (~0.4 delay + 1.1s duration)
        )
        .from(
          "[data-hero='cta'], [data-hero='scroll-hint']",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* WebGL starfield — subtle shimmering orbs */}
      <HeroStarfield />

      {/* Soft accent glow behind headline */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(0,255,136,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <p
          data-hero="eyebrow"
          className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.35em] text-accent"
        >
          Premium Digital Experience
        </p>

        <TextReveal
          lines={["Crafted in", "Motion"]}
          as="h1"
          trigger="load"
          delay={0.4}
          stagger={0.1}
          headingClassName="text-[clamp(3rem,8vw,7rem)]"
        />

        <p
          data-hero="subtitle"
          className="mt-8 max-w-md text-base leading-relaxed text-foreground/60"
        >
          A cinematic journey through space, motion, and light — built for brands
          that refuse to blend in.
        </p>

        <div className="mt-12 flex flex-col items-center gap-8">
          <a
            data-hero="cta"
            data-cursor="explore"
            href="#explore"
            className="group relative overflow-hidden rounded-full border border-accent/30 px-8 py-3 text-sm font-medium uppercase tracking-widest text-accent transition-colors duration-300 hover:bg-accent hover:text-background"
          >
            Explore the Work
          </a>

          <div
            data-hero="scroll-hint"
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              Scroll
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-accent/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
