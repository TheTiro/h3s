import type { MetadataRoute } from "next";
import { PUBLIC_SITE_ORIGIN } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/home",
    "/visualisations",
    "/activities",
    "/contact",
    "/privacy-policy",
  ];
  const now = new Date();

  return staticRoutes.map((path) => ({
    url: `${PUBLIC_SITE_ORIGIN}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" || path === "/home" ? 1 : 0.7,
  }));
}
