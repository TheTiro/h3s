import Link from "next/link";
import { SiteLogo } from "@/components/SiteLogo";

export default function EnterPage() {
  return (
    <main className="site-backdrop flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="sr-only">H3 Studios</h1>
      <SiteLogo size="hero" />
      <Link
        href="/home"
        className="mt-12 text-[1.65rem] font-medium lowercase tracking-[0.34em] text-[#3ad4e8] transition-colors hover:text-[#6ee4f2] sm:mt-14 sm:text-[1.85rem]"
      >
        enter
      </Link>
    </main>
  );
}
