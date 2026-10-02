import type { Metadata } from "next";
import { site } from "@/lib/site";
import { localePath, ogLocale, type Locale } from "@/i18n/config";

type BuildMeta = {
  locale: Locale;
  /** Path WITHOUT locale prefix, e.g. "/about-us/" */
  path: string;
  title: string;
  description: string;
  image?: string | null;
  /** Set false when the page has no Arabic/English twin (e.g. single-language blog post) */
  hasAlternates?: boolean;
  canonical?: string | null;
  robots?: { index: boolean; follow: boolean };
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  /** Title already contains brand → skip template */
  absoluteTitle?: boolean;
};

export const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);

export function buildMetadata(o: BuildMeta): Metadata {
  const url = absoluteUrl(localePath(o.locale, o.path));
  const image = absoluteUrl(o.image || site.images.og);
  const og = {
    url,
    siteName: site.name,
    title: o.ogTitle || o.title,
    description: o.ogDescription || o.description,
    locale: ogLocale[o.locale],
    images: [{ url: image }],
  };
  return {
    title: o.absoluteTitle ? { absolute: o.title } : o.title,
    description: o.description,
    alternates: {
      canonical: o.canonical || url,
      ...(o.hasAlternates === false
        ? {}
        : {
            languages: {
              en: absoluteUrl(localePath("en", o.path)),
              ar: absoluteUrl(localePath("ar", o.path)),
              "x-default": absoluteUrl(localePath("en", o.path)),
            },
          }),
    },
    robots: o.robots
      ? { index: o.robots.index, follow: o.robots.follow, "max-image-preview": "large" }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph:
      o.type === "article"
        ? { ...og, type: "article", publishedTime: o.publishedTime, modifiedTime: o.modifiedTime }
        : { ...og, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: o.ogTitle || o.title,
      description: o.ogDescription || o.description,
      images: [image],
    },
  };
}
