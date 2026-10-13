import type { Metadata } from "next";
import { getPageContent, type PageKey } from "@/content/pages";
import { isLocale } from "@/i18n/config";
import { routePath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { pageImageSlot } from "@/lib/image-slots";
import { siteImage } from "@/lib/site-images";

export async function pageMetadata(pageKey: PageKey, locale: string): Promise<Metadata> {
  if (!isLocale(locale)) return {};
  const c = getPageContent(pageKey, locale);
  // OG image follows the hero photo replaced in Admin → Images
  const slot = pageImageSlot(pageKey);
  const image = slot ? (await siteImage(slot, locale)).src : c.image;
  return buildMetadata({ locale, path: routePath(pageKey), title: c.metaTitle, absoluteTitle: c.metaTitleAbsolute, description: c.metaDescription, image });
}
