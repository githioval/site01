"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_IMAGES } from "@/lib/images";

const GALLERY_CARDS = [
  { id: 1, title: "Lumière", subtitle: "Brand Film", objectPosition: "50% 20%" },
  { id: 2, title: "Aether", subtitle: "Digital Experience", objectPosition: "80% 50%" },
  { id: 3, title: "Solstice", subtitle: "Campaign Launch", objectPosition: "50% 80%" },
  { id: 4, title: "Nocturne", subtitle: "Interactive Install", objectPosition: "20% 50%" },
  { id: 5, title: "Prism", subtitle: "Visual Identity", objectPosition: "60% 40%" },
  { id: 6, title: "Vertex", subtitle: "Product Launch", objectPosition: "40% 60%" },
].map((card, i) => ({ ...card, image: GALLERY_IMAGES[i] }));

const TOTAL = GALLERY_CARDS.length;
const clampSkew = gsap.utils.clamp(-5, 5);

/**
 * HorizontalScrollSection
 * ─────────────────────
 * Pinned horizontal gallery. Skew/scale apply to the visual layer only
 * so card text stays anchored and never clips out of frame.
 */
export default function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !track || !progress) return;

    const cards = gsap.utils.toArray<HTMLElement>(".gallery-card");
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    const updateCardTransforms = () => {
      const viewportCenter = window.innerWidth / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const offset = (cardCenter - viewportCenter) / (window.innerWidth * 0.5);
        const absOffset = Math.min(Math.abs(offset), 1);

        const skewX = clampSkew(offset * 5);
        const scale = gsap.utils.interpolate(1, 0.95, absOffset);
        const opacity = gsap.utils.interpolate(1, 0.5, absOffset);

        // Opacity on shell; skew/scale on visual layer only — text stays put
        gsap.set(card, { opacity });
        const visual = card.querySelector(".gallery-card-visual");
        if (visual) {
          gsap.set(visual, {
            skewX,
            scale,
            transformOrigin: "center center",
          });
        }

        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < closestDistance) {
          closestDistance = dist;
          closestIndex = index;
        }
      });

      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex + 1);
    };

    const onResize = () => ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set(progress, {
              scaleX: self.progress,
              transformOrigin: "left center",
            });
            updateCardTransforms();

            if (scrollEndTimer) clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
              const centerIndex = activeIndexRef.current;
              const velocity = self.getVelocity();
              const overshoot = gsap.utils.clamp(velocity / 800, -0.04, 0.04);

              cards.forEach((card, i) => {
                const visual = card.querySelector(".gallery-card-visual");
                if (!visual) return;

                gsap.to(visual, {
                  skewX: 0,
                  duration: 0.85,
                  ease: "elastic.out(1, 0.55)",
                  overwrite: "auto",
                });

                if (i === centerIndex) {
                  gsap.fromTo(
                    visual,
                    { scale: 1 + Math.abs(overshoot) },
                    {
                      scale: 1,
                      duration: 0.9,
                      ease: "elastic.out(1, 0.5)",
                      overwrite: "auto",
                    }
                  );
                }
              });
            }, 150);
          },
        },
      });

      updateCardTransforms();
    }, sectionRef);

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="gallery-section relative overflow-hidden"
      data-cursor="drag"
    >
      <div className="absolute left-0 right-0 top-0 z-20 h-px bg-foreground/10">
        <div
          ref={progressRef}
          className="h-full w-full origin-left scale-x-0 bg-accent"
          style={{ boxShadow: "0 0 12px rgba(0,255,136,0.6)" }}
        />
      </div>

      <div className="absolute right-6 top-8 z-20 font-sans text-xs tracking-[0.2em] text-foreground/40 md:right-12 lg:right-24">
        <span className="text-accent">{String(activeIndex).padStart(2, "0")}</span>
        {" / "}
        {String(TOTAL).padStart(2, "0")}
      </div>

      <div className="px-6 pb-8 pt-32 md:px-12 lg:px-24">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-accent">
          Gallery
        </p>
        <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-tight">
          Scroll to explore
        </h2>
      </div>

      {/* Viewport clip — keeps cards contained, no bleed */}
      <div className="relative overflow-hidden pb-20 pt-4">
        <div
          ref={trackRef}
          className="flex items-center gap-5 px-6 will-change-transform md:gap-6 md:px-12 lg:px-24"
        >
          {GALLERY_CARDS.map((card) => (
            <article
              key={card.id}
              data-cursor="view"
              className="gallery-card group relative h-[38vh] max-h-[360px] min-h-[220px] w-[72vw] flex-shrink-0 overflow-hidden rounded-sm md:h-[42vh] md:max-h-[400px] md:w-[40vw] lg:w-[34vw]"
              style={{ opacity: 0.5 }}
            >
              {/* Visual layer — receives skew/scale transforms */}
              <div
                className="gallery-card-visual absolute inset-0 will-change-transform"
                style={{ transform: "scale(0.95)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image.src}
                  alt={card.image.alt}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: card.objectPosition }}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-background/30" />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              </div>

              {/* Text layer — fixed in card frame, never skewed */}
              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.3em] text-accent/70 md:text-xs">
                  {card.subtitle}
                </p>
                <h3 className="font-heading text-2xl tracking-tight md:text-3xl">
                  {card.title}
                </h3>
              </div>

              <div className="absolute bottom-0 left-0 z-10 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
