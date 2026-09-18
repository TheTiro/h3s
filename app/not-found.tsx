import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted">
        The page you requested does not exist or may have moved.
      </p>
      <Link
        href="/home"
        className="mt-8 inline-flex min-h-11 items-center bg-accent px-5 text-xs font-semibold uppercase tracking-[0.2em] text-background"
      >
        Back to Home
      </Link>
    </div>
  );
}
