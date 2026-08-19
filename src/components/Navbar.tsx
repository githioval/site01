/**
 * Navbar
 * ──────
 * Placeholder fixed nav — logo left, hamburger right.
 */
export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 lg:px-24">
      <a
        href="/"
        className="font-logo text-lg font-semibold text-foreground transition-colors hover:text-accent"
      >
        Nara
      </a>

      <button
        type="button"
        aria-label="Open menu"
        className="group flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-full border border-foreground/10 transition-colors hover:border-accent/40"
      >
        <span className="block h-px w-5 bg-foreground transition-colors group-hover:bg-accent" />
        <span className="block h-px w-5 bg-foreground transition-colors group-hover:bg-accent" />
      </button>
    </header>
  );
}
