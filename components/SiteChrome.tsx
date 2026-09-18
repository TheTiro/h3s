"use client";

import { usePathname } from "next/navigation";
import { BackToTop } from "@/components/BackToTop";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEnter = pathname === "/";

  if (isEnter) {
    return (
      <>
        {children}
        <CookieConsentBanner />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="site-backdrop flex flex-1 flex-col">{children}</main>
      <SiteFooter />
      <BackToTop />
      <CookieConsentBanner />
    </>
  );
}
