import type { Metadata } from "next";
import { getPageContent, type PageKey } from "@/content/pages";
import { isLocale } from "@/i18n/config";
import { routePath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export function pageMetadata(pageKey: PageKey, locale: string): Metadata {
  if (!isLocale(locale)) return {};
  const c = getPageContent(pageKey, locale);
  return buildMetadata({ locale, path: routePath(pageKey), title: c.metaTitle, description: c.metaDescription, image: c.image });
}
