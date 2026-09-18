"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEnter = pathname === "/";

  if (isEnter) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="site-backdrop flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </>
  );
}
