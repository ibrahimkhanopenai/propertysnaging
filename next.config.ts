import type { NextConfig } from "next";
import { legacyAssetRedirects } from "./src/lib/legacy-redirects";

/**
 * SEO RULE: trailingSlash MUST stay true — every URL on the old
 * site ends with "/" and Google has indexed them that way.
 * See docs/seo-migration.md before touching redirects.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1600],
  },
  async redirects() {
    return [
      // Old site leftovers → 301 (see docs/seo-migration.md)
      { source: "/sample-page/", destination: "/", permanent: true },
      { source: "/category/:path*", destination: "/blog/", permanent: true },
      { source: "/author/:path*", destination: "/blog/", permanent: true },
      { source: "/elementor-hf/:path*", destination: "/", permanent: true },
      { source: "/feed/", destination: "/blog/", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/post-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/category-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/author-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/elementor-hf-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      // Old image/PDF URLs → /images, /downloads (src/lib/legacy-redirects.ts)
      ...legacyAssetRedirects,
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HTTPS only in production (dev runs on http://localhost)
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
            : []),
        ],
      },
      // 1 day, not immutable: images are replaced by overwriting the same file name
      ...["/images/:path*", "/downloads/:path*"].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      })),
    ];
  },
};

export default nextConfig;
