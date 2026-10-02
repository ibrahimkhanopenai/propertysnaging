import type { NextConfig } from "next";

/**
 * SEO RULE: trailingSlash MUST stay true — every URL on the old WordPress
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
      // WordPress leftovers → 301 (see docs/seo-migration.md)
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
        ],
      },
      {
        source: "/wp-content/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
