import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-4 py-8 text-xs tracking-[0.04em] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © 2026 Designed by{" "}
          <span className="font-semibold text-foreground">
            H<span className="text-accent">3</span> Studios
          </span>
          , developed by{" "}
          <a
            href="https://steam-development.ba/"
            className="font-semibold text-foreground hover:text-accent"
            target="_blank"
            rel="noreferrer"
          >
            S<span className="text-accent">T</span>eam-development
          </a>.
        </p>
        <nav className="flex flex-wrap gap-4" aria-label="Legal">
          <Link href="/privacy-policy" className="uppercase tracking-[0.18em] hover:text-accent">
            Privacy
          </Link>
          <Link href="/cookie-policy" className="uppercase tracking-[0.18em] hover:text-accent">
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}
