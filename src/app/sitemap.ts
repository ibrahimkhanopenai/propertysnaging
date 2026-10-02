import type { MetadataRoute } from "next";
import { localePath } from "@/i18n/config";
import { getAllPublishedForSitemap } from "@/lib/posts";
import { staticRoutes } from "@/lib/routes";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const abs = (p: string) => `${site.url}${p}`;

  const pages: MetadataRoute.Sitemap = staticRoutes.flatMap((r) =>
    (["en", "ar"] as const).map((locale) => ({
      url: abs(localePath(locale, r.path)),
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: locale === "en" ? r.priority : Math.max(0.1, r.priority - 0.2),
      alternates: { languages: { en: abs(localePath("en", r.path)), ar: abs(localePath("ar", r.path)) } },
    })),
  );

  const posts = (await getAllPublishedForSitemap()).map((p) => ({
    url: abs(localePath(p.locale, `/${p.slug}/`)),
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...posts];
}
