import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Locale } from "@/i18n/config";
import { getImageSlot, type ImageSlot, type ImageSlotKey } from "@/lib/image-slots";
import { site } from "@/lib/site";

/**
 * Admin → Images + Admin → Developer logos reads. Same pattern as getSettings(): code defaults
 * (site.ts, dictionaries) overridden by DB rows, with the defaults used when MySQL is unreachable.
 */

export type SiteImageRow = { key: string; url: string | null; alt: string | null; altAr: string | null };
export type ResolvedImage = { src: string; alt: string };

/**
 * Pure (exported for tests). Empty fields use the default. When the photo was replaced but has no
 * Arabic ALT, the Arabic page uses the English ALT: the default Arabic ALT describes the old photo.
 */
export function resolveImage(slot: ImageSlot, row: SiteImageRow | undefined, locale: Locale): ResolvedImage {
  const replaced = !!row?.url && row.url !== slot.src;
  const en = row?.alt || slot.alt("en");
  const ar = row?.altAr || (replaced && row?.alt ? row.alt : slot.alt("ar"));
  return { src: row?.url || slot.src, alt: locale === "ar" ? ar : en };
}

export type SlotFormValues = { url: string; alt: string; altAr: string; changed: boolean };

/**
 * Pure: what the Admin → Images form shows for a slot. A replaced photo with no Arabic ALT shows an
 * empty Arabic field (the Arabic page uses the English ALT), not the default one for the old photo.
 */
export function slotFormValues(slot: ImageSlot, row: Omit<SiteImageRow, "key"> | undefined): SlotFormValues {
  const replaced = !!row?.url && row.url !== slot.src;
  return {
    url: row?.url || slot.src,
    alt: row?.alt || slot.alt("en"),
    altAr: row?.altAr || (replaced ? "" : slot.alt("ar")),
    changed: !!(row?.url || row?.alt || row?.altAr),
  };
}

const getImageRows = cache(async (): Promise<Map<string, SiteImageRow>> => {
  try {
    return new Map((await prisma.siteImage.findMany()).map((r) => [r.key, r]));
  } catch {
    return new Map();
  }
});

/** `await siteImage("hero", locale)` → { src, alt } for next/image */
export async function siteImage(key: ImageSlotKey, locale: Locale): Promise<ResolvedImage> {
  return resolveImage(getImageSlot(key)!, (await getImageRows()).get(key), locale);
}

export type DeveloperLogoItem = { name: string; logo: string };

/** Published logos in order; Arabic uses nameAr when set. No rows at all (or DB down) → site.developers. */
export async function getDeveloperLogos(locale: Locale): Promise<DeveloperLogoItem[]> {
  try {
    const rows = await prisma.developerLogo.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
    if (rows.length) return rows.filter((r) => r.published).map((r) => ({ name: locale === "ar" && r.nameAr ? r.nameAr : r.name, logo: r.logo }));
  } catch {
    // fall through to the defaults
  }
  return site.developers.map((d) => ({ name: d.name, logo: d.logo }));
}
