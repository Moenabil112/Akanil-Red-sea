import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Curated single-breakpoint WebP derivatives ship pre-optimized; the
    // runtime optimizer is disabled for deterministic builds (ADR-006).
    unoptimized: true,
  },
  async redirects() {
    const contentRoutes = [
      "gateway",
      "morocco",
      "sudan",
      "corridor",
      "value-chains",
      "portfolio",
      "forum",
      "trust",
      "about-akanil",
      "reception",
    ];
    // Dedicated platform-profile slugs (P1 §6).
    const platformSlugs = ["valura", "rwafid", "trade-chain-africa", "ibriz-gaas"];
    return [
      {
        source: "/",
        destination: "/ar",
        permanent: false,
      },
      // Non-localized entry points resolve to the Arabic default (Phase 4).
      ...contentRoutes.map((route) => ({
        source: `/${route}`,
        destination: `/ar/${route}`,
        permanent: false,
      })),
      ...platformSlugs.map((slug) => ({
        source: `/portfolio/${slug}`,
        destination: `/ar/portfolio/${slug}`,
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
