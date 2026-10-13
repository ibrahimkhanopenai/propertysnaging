import "server-only";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";

/** Reviews + gallery reads. All wrapped so public pages render even if MySQL is down. */

export async function getReviews(take?: number) {
  try {
    return await prisma.review.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take });
  } catch {
    return [];
  }
}

export type GalleryItem = { id: number | string; url: string; alt: string; caption: string | null; category: string };

export async function getGallery(opts: { featuredOnly?: boolean; take?: number } = {}): Promise<GalleryItem[]> {
  try {
    const rows = await prisma.galleryImage.findMany({
      where: opts.featuredOnly ? { featured: true } : {},
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: opts.take,
    });
    if (rows.length) return rows;
  } catch {
    // fall through to defaults
  }
  return site.defaultGallery.slice(0, opts.take).map((url, i) => ({ id: `d${i}`, url, alt: "Property Inspectors inspection photo", caption: null, category: "inspection" }));
}

export type CommunityItem = { name: string; developer: string | null };

/**
 * Location page lists from Admin → Locations. `emirate` = location page key (dubai, abudhabi, …).
 * Areas: no rows for the emirate (or DB down) → `fallbackAreas` from content/locations.*.ts.
 * Communities: no rows → empty (the block is hidden). Arabic uses nameAr when set, else name.
 */
export async function getLocationItems(
  emirate: string,
  locale: "en" | "ar",
  fallbackAreas: string[] = [],
): Promise<{ areas: string[]; communities: CommunityItem[] }> {
  try {
    const rows = await prisma.locationItem.findMany({ where: { emirate }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
    const label = (r: (typeof rows)[number]) => (locale === "ar" && r.nameAr ? r.nameAr : r.name);
    const areaRows = rows.filter((r) => r.kind === "AREA");
    return {
      areas: areaRows.length ? areaRows.filter((r) => r.published).map(label) : fallbackAreas,
      communities: rows.filter((r) => r.kind === "COMMUNITY" && r.published).map((r) => ({ name: label(r), developer: r.developer })),
    };
  } catch {
    return { areas: fallbackAreas, communities: [] };
  }
}
