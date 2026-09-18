"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

const STORAGE_KEY = "h3_cookie_consent";

type ConsentChoice = "accepted" | "declined";

function readStoredChoice(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "accepted" || raw === "declined") return raw;
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

function writeStoredChoice(choice: ConsentChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* ignore */
  }
}

/**
 * Essential-cookies notice — Accept or Decline.
 * Stores preference in localStorage (not a tracking cookie).
 */
export function CookieConsentBanner() {
  const titleId = useId();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readStoredChoice() == null) setVisible(true);
  }, []);

  const choose = (choice: ConsentChoice) => {
    writeStoredChoice(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[75] border-t border-border bg-surface/95 px-3 py-2.5 shadow-[0_-8px_24px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:px-4"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
    >
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-4">
        <p id={titleId} className="min-w-0 flex-1 text-sm leading-relaxed text-muted">
          We use essential cookies so the site can work, including spam protection on the contact
          form.{" "}
          <Link href="/cookie-policy" className="font-semibold text-accent hover:underline">
            Cookie Policy
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="inline-flex h-9 items-center justify-center border border-border bg-surface px-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="inline-flex h-9 items-center justify-center bg-accent px-3 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
