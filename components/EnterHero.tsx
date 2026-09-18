"use client";

import Link from "next/link";
import { useRef } from "react";
import { EnterParticles } from "@/components/EnterParticles";
import { SiteLogo } from "@/components/SiteLogo";

export function EnterHero() {
  const logoRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLAnchorElement>(null);

  return (
    <main className="site-backdrop relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <EnterParticles logoRef={logoRef} enterRef={enterRef} />
      <h1 className="sr-only">H3 Studios</h1>
      <div className="relative z-20 flex flex-col items-center isolate [transform:translateZ(0)]">
        <div ref={logoRef}>
          <SiteLogo size="hero" />
        </div>
        <Link
          ref={enterRef}
          href="/home"
          className="mt-20 text-[2.475rem] font-medium lowercase tracking-[0.34em] text-[#3ad4e8] transition-colors hover:text-[#6ee4f2] sm:mt-24 sm:text-[2.775rem]"
        >
          enter
        </Link>
      </div>
    </main>
  );
}
