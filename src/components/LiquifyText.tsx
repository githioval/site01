"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";

interface LiquifyTextProps {
  lines: string[];
  className?: string;
  headingClassName?: string;
}

/**
 * LiquifyText
 * ───────────
 * Heading with SVG displacement liquify on hover.
 * feTurbulence + feDisplacementMap warp the glyphs like liquid.
 */
export default function LiquifyText({
  lines,
  className = "",
  headingClassName = "",
}: LiquifyTextProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `liquify-${uid}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !turbRef.current || !dispRef.current) return;

    const turb = turbRef.current;
    const disp = dispRef.current;

    const onEnter = () => {
      gsap.to(turb, {
        attr: { baseFrequency: 0.035 },
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(disp, {
        attr: { scale: 28 },
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(turb, {
        attr: { baseFrequency: 0.008 },
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.to(disp, {
        attr: { scale: 0 },
        duration: 0.8,
        ease: "power3.out",
      });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={`cursor-default ${className}`}>
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.008"
              numOctaves="3"
              seed="8"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <h2
        className={`font-heading leading-[1.1] tracking-tight transition-colors duration-300 hover:text-accent ${headingClassName}`}
        style={{ filter: `url(#${filterId})` }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}
