import Image from "next/image";
import Link from "next/link";

const LOGO = {
  src: "/images/h3-logo.webp",
  width: 341,
  height: 131,
} as const;

export function SiteLogo({
  href = "/home",
  size = "nav",
}: {
  href?: string;
  size?: "nav" | "hero";
}) {
  const imgClass =
    size === "hero"
      ? "h-auto w-[min(88vw,34rem)]"
      : "h-[54px] w-auto sm:h-[60px]";

  return (
    <Link
      href={href}
      className={`inline-flex items-center ${size === "hero" ? "logo-aura" : ""}`}
      aria-label="H3 Studios"
    >
      <Image
        src={LOGO.src}
        alt="H3 Studios"
        width={LOGO.width}
        height={LOGO.height}
        className={imgClass}
        priority
      />
      {size === "hero" ? (
        <span className="logo-aura-shimmer" aria-hidden />
      ) : null}
    </Link>
  );
}
