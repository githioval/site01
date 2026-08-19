"use client";

import LiquifyText from "./LiquifyText";

/**
 * ClosingSection
 * ──────────────
 * Final CTA block with liquify-on-hover headline.
 */
export default function ClosingSection() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-32 text-center">
      <LiquifyText
        lines={["Ready to create", "something extraordinary?"]}
        headingClassName="text-[clamp(2rem,5vw,4rem)]"
        className="mx-auto max-w-3xl text-foreground"
      />

      <p className="mx-auto mt-8 max-w-md font-sans text-base leading-relaxed text-foreground/50">
        Let&apos;s build an experience your audience won&apos;t forget.
      </p>

      <a
        data-cursor="explore"
        href="mailto:hello@studio.com"
        className="mt-12 inline-flex items-center gap-3 border border-accent/30 px-10 py-4 font-sans text-sm uppercase tracking-widest text-accent transition-colors duration-300 hover:bg-accent hover:text-background"
      >
        Get in Touch
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
