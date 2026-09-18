function normalizeSiteOrigin(raw: string): string {
  return raw.replace(/\/+$/, "");
}

function resolvePublicSiteOrigin(): string {
  const fallback = "https://h3studios.ba";
  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!envOrigin) return fallback;
  const normalized = normalizeSiteOrigin(envOrigin);
  try {
    const u = new URL(normalized);
    if (u.protocol !== "http:" && u.protocol !== "https:") return fallback;
    return normalizeSiteOrigin(u.origin);
  } catch {
    return fallback;
  }
}

export const SITE_NAME = "H3 Studios";
export const SITE_TAGLINE = "Precision in motion";
export const SITE_DEFAULT_TITLE = "H3 Studios";
export const SITE_DESCRIPTION =
  "High-end 3D animation and technical visualisation — where engineering meets visual excellence.";

export const PUBLIC_SITE_ORIGIN = resolvePublicSiteOrigin();
export const SITE_WEBSITE_URL = "https://h3studios.ba";

export const SITE_EMAIL = "info@h3studios.ba";
export const SITE_INSTAGRAM_URL = "https://www.instagram.com/h3_studios__super_design";
export const SITE_FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61581840010453";
export const SITE_PHONE_DISPLAY = "";
export const SITE_PHONE_TEL = "";
export const SITE_ADDRESS = "";

export const CONTACT_MESSAGE_MIN_LENGTH = Number(
  process.env.CONTACT_MESSAGE_MIN_LENGTH ?? "20"
);
export const CONTACT_MESSAGE_MAX_LENGTH = Number(
  process.env.CONTACT_MESSAGE_MAX_LENGTH ?? "256"
);

export type NavItem = {
  href: string;
  label: string;
};

/** Navbar from the original PSD export. */
export const MAIN_NAV: readonly NavItem[] = [
  { href: "/home", label: "Home" },
  { href: "/visualisations", label: "Visualisations" },
  { href: "/activities", label: "Activities" },
  { href: "/contact", label: "Contact Us" },
];
