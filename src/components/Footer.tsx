/**
 * Footer
 * ──────
 * Simple site footer — logo + copyright.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground/10 px-6 py-10 md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <a
          href="/"
          className="font-logo text-lg font-semibold text-foreground transition-colors hover:text-accent"
        >
          Nara
        </a>
        <p className="font-sans text-xs text-foreground/40">
          © {year} Nara. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
