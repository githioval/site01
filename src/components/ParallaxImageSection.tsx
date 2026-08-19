"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "./TextReveal";
import { PARALLAX_IMAGES } from "@/lib/images";

const PARALLAX_BLOCKS = [
  { id: 1, label: "01 — Identity", objectPosition: "50% 30%" },
  { id: 2, label: "02 — Motion", objectPosition: "70% 50%" },
  { id: 3, label: "03 — Presence", objectPosition: "30% 70%" },
].map((block, i) => ({ ...block, image: PARALLAX_IMAGES[i] }));

const clampSkew = gsap.utils.clamp(-5, 5);

/**
 * ParallaxImageSection
 * ────────────────────
 * "Floating window" cards — each image sits inside a masked viewport.
 * Scroll drives scale, Y-parallax, opacity, and velocity-based skew with inertia.
 */
export default function ParallaxImageSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = sectionRef.current?.querySelectorAll(".parallax-block");

      blocks?.forEach((block) => {
        const windowEl = block.querySelector(".parallax-window");
        const skewTarget = block.querySelector(".parallax-skew-target");
        const image = block.querySelector(".parallax-image");
        if (!windowEl || !skewTarget || !image) return;

        gsap.fromTo(
          image,
          { scale: 1.2, yPercent: -12, opacity: 0 },
          {
            scale: 1,
            yPercent: 12,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: block,
              start: "top 90%",
              end: "bottom 10%",
              scrub: 1.4,
            },
          }
        );

        gsap.fromTo(
          windowEl,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              end: "top 40%",
              scrub: 1.2,
            },
          }
        );

        ScrollTrigger.create({
          trigger: block,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const targetSkew = clampSkew(velocity / 400);

            gsap.to(skewTarget, {
              skewY: targetSkew,
              duration: 0.6,
              ease: "power3.out",
              overwrite: "auto",
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="px-6 py-32 md:px-12 lg:px-24"
    >
      <div className="mx-auto mb-24 flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
        <TextReveal
          lines={["Selected", "Work"]}
          as="h2"
          trigger="scroll"
          stagger={0.1}
          headingClassName="text-[clamp(2.5rem,6vw,5rem)]"
        />
        <TextReveal
          lines={["Every pixel tells a story"]}
          trigger="scroll"
          stagger={0.1}
          headingClassName="text-sm font-normal text-foreground/45 md:text-base md:text-right"
          className="md:pb-2 md:text-right"
        />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-24 md:gap-32">
        {PARALLAX_BLOCKS.map((block, i) => (
          <div
            key={block.id}
            className={`parallax-block ${i % 2 === 1 ? "md:ml-auto md:w-[85%]" : "md:w-[85%]"}`}
          >
            <div
              className="parallax-window relative h-[50vh] overflow-hidden rounded-sm md:h-[60vh]"
              data-cursor="view"
            >
              <div className="parallax-skew-target absolute inset-0">
                <div
                  className="parallax-image absolute inset-0 will-change-transform"
                  style={{ transform: "scale(1.2)", opacity: 0 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.image.src}
                    alt={block.image.alt}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: block.objectPosition }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </div>
              </div>
              <span className="absolute bottom-6 left-6 z-10 font-sans text-xs uppercase tracking-[0.25em] text-foreground/70">
                {block.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
