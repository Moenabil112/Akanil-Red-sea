import type { MetadataRoute } from "next";

/**
 * Public robots policy (P4-A §2/§23). Internal employee routes are
 * disallowed from crawling; the public sitemap never lists them.
 */
export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ar/internal/", "/fr/internal/", "/en/internal/"],
      },
    ],
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
