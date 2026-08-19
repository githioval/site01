"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface TextRevealProps {
  /** Each string becomes one masked reveal row */
  lines: string[];
  className?: string;
  /** Typography wrapper tag */
  as?: "h1" | "h2" | "h3" | "p";
  /** Extra classes on the heading tag (size, alignment, etc.) */
  headingClassName?: string;
  /** "scroll" = ScrollTrigger on enter; "load" = plays immediately on mount */
  trigger?: "scroll" | "load";
  /** Delay before animation starts (useful for hero sequencing) */
  delay?: number;
  /** Seconds between each line — defaults to 0.1 */
  stagger?: number;
}

/**
 * TextReveal
 * ──────────
 * Cinematic line-by-line text reveal.
 *
 * Technique:
 * 1. Each line wrapper gets a clip-path mask (inset from top) — the "invisible line"
 *    at the bottom edge of the mask is where text emerges from.
 * 2. The inner span slides up from y:100% → y:0% simultaneously.
 * 3. clip-path + translate combine for a premium curtain-lift feel.
 */
export default function TextReveal({
  lines,
  className = "",
  as: Tag = "h2",
  headingClassName = "",
  trigger = "scroll",
  delay = 0,
  stagger = 0.1,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const masks = containerRef.current?.querySelectorAll(".reveal-line-mask");
    const inners = containerRef.current?.querySelectorAll(".reveal-line-inner");

    if (!masks?.length || !inners?.length) return;

    const ctx = gsap.context(() => {
      const tweenConfig = {
        duration: 1.1,
        ease: "power4.out" as const,
        stagger,
        delay,
      };

      // Clip-path expands from a horizontal seam (top inset 100% → 0%)
      gsap.fromTo(
        masks,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          ...tweenConfig,
          ...(trigger === "scroll" && {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }),
        }
      );

      // Inner text rises from below the mask edge
      gsap.fromTo(
        inners,
        { y: "100%" },
        {
          y: "0%",
          ...tweenConfig,
          ...(trigger === "scroll" && {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }),
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [lines, trigger, delay, stagger]);

  return (
    <div ref={containerRef} className={className}>
      <Tag
        className={`font-heading leading-[1.1] tracking-tight ${headingClassName}`}
      >
        {lines.map((line, i) => (
          <span key={i} className="reveal-line block pb-1">
            {/* clip-path mask — text reveals from behind the bottom edge */}
            <span className="reveal-line-mask block overflow-hidden">
              <span className="reveal-line-inner block will-change-transform">
                {line}
              </span>
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
