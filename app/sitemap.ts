import type { MetadataRoute } from "next";
import { TAXONOMY } from "@/lib/shopTaxonomy";

const SITE = "https://evorahome.online";

// There was no sitemap at all. Only public, canonical, indexable routes belong
// here — the portal and the /v2 /v3 /clientexample duplicates are excluded to
// match robots.ts (listing a URL here that robots disallows is a contradiction
// Search Console flags).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/shop/rooms`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/visit`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/showroom`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/studio`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/catalog`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categories: MetadataRoute.Sitemap = Object.keys(TAXONOMY).map((slug) => ({
    url: `${SITE}/shop/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...core, ...categories];
}
