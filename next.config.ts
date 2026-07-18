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
    return [
      {
        source: "/",
        destination: "/ar",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
