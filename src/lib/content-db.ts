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
