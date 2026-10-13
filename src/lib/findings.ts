import "server-only";
import { prisma } from "@/lib/db";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { siteImage } from "@/lib/site-images";
import type { FindingItem } from "@/components/home/FindingsExplorer";

/**
 * Homepage "Defects we find" (Real findings), Admin → Defects we find. No rows (or DB down) →
 * home.findings from the dictionaries with the Admin → Images "Defects we find" (scope.*) photos.
 */

type ScopeKey = keyof typeof site.images.scope;

/** The annotation dot in FindingsExplorer is placed for this photo (the torch on the wall) */
const markerPhoto = site.images.scope.paint;

export async function defaultFindings(locale: Locale): Promise<FindingItem[]> {
  return Promise.all(
    getDictionary(locale).home.findings.items.map(async (it) => {
      const photo = await siteImage(`scope.${it.photo as ScopeKey}`, locale);
      return { category: it.category, defect: it.defect, fix: it.fix, src: photo.src, alt: photo.alt, marker: photo.src === markerPhoto };
    }),
  );
}

export type FindingRow = {
  category: string;
  categoryAr: string | null;
  defect: string;
  defectAr: string | null;
  fix: string;
  fixAr: string | null;
  photo: string;
  alt: string;
  altAr: string | null;
  published: boolean;
};

/**
 * Pure (exported for tests): published rows in order. The Arabic page only shows rows with Arabic
 * category, defect and recommendation; with no Arabic ALT it uses the English one.
 */
export function resolveFindings(rows: FindingRow[], locale: Locale): FindingItem[] {
  return rows
    .filter((r) => r.published)
    .flatMap((r): FindingItem[] => {
      const marker = r.photo === markerPhoto;
      if (locale !== "ar") return [{ category: r.category, defect: r.defect, fix: r.fix, src: r.photo, alt: r.alt, marker }];
      if (!r.categoryAr || !r.defectAr || !r.fixAr) return [];
      return [{ category: r.categoryAr, defect: r.defectAr, fix: r.fixAr, src: r.photo, alt: r.altAr || r.alt, marker }];
    });
}

export async function getFindings(locale: Locale): Promise<FindingItem[]> {
  try {
    const rows = await prisma.finding.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
    if (rows.length) return resolveFindings(rows, locale);
  } catch {
    // fall through to the defaults
  }
  return defaultFindings(locale);
}
