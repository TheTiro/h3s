"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 400;

export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(pathname === "/contact");

  useEffect(() => {
    const onScroll = () => {
      setVisible(pathname === "/contact" || window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-background shadow-[0_8px_24px_rgba(139,255,42,0.28)] transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
