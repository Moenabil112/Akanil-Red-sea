import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { pageRoutes } from "@/lib/routes";
import { platformIds } from "@/lib/ecosystem";
import { valueChainIds } from "@/lib/value-chains";
import { forumSubroutes } from "@/lib/forum";

/**
 * Sitemap for the trilingual routes, including the four dedicated
 * platform profiles (P1 §15) and the six value-chain profiles (P2). The
 * production domain is never guessed:
 * when NEXT_PUBLIC_SITE_URL is unset, root-relative paths are emitted.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const url = (path: string) => `${base}${path}`;

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    entries.push({ url: url(`/${locale}`), changeFrequency: "monthly", priority: 1 });
    for (const route of pageRoutes) {
      entries.push({
        url: url(`/${locale}/${route}`),
        changeFrequency: "monthly",
        priority: route === "portfolio" ? 0.9 : 0.7,
      });
    }
    for (const platform of platformIds) {
      entries.push({
        url: url(`/${locale}/portfolio/${platform}`),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    for (const chain of valueChainIds) {
      entries.push({
        url: url(`/${locale}/value-chains/${chain}`),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    for (const sub of forumSubroutes) {
      entries.push({
        url: url(`/${locale}/forum/${sub}`),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }
  return entries;
}
