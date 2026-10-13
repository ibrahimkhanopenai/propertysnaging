import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Locale } from "@/i18n/config";
import { getPageContent, type PageContent, type PageKey } from "@/content/pages";
import type { PageSection } from "@/content/types";
import { getEditablePage } from "@/lib/admin-pages";

/**
 * Admin → Page text: hook (location pages), intro and sections of the service + location pages.
 * The text in content/{services,locations}.*.ts is the default; a PageText field that is not null replaces it.
 * URLs, <title>, meta description and H1 always come from the content files (SEO rules, AGENTS.md §5).
 */

export const pageTextLimits = { hook: 300, intro: 2000, sections: 12, title: 200, paragraphs: 10, paragraph: 3000, bullets: 30, bullet: 500 };

export type PageTextRow = { hook: string | null; intro: string | null; sections: unknown };

/** Same field order everywhere, empty lists dropped — so "equal to the default" can be checked with JSON. */
const normalize = (s: PageSection): PageSection => ({
  ...(s.id ? { id: s.id } : {}),
  title: s.title,
  ...(s.paragraphs?.length ? { paragraphs: s.paragraphs } : {}),
  ...(s.bullets?.length ? { bullets: s.bullets } : {}),
});

export const sameSections = (a: PageSection[], b: PageSection[]) => JSON.stringify(a.map(normalize)) === JSON.stringify(b.map(normalize));

const lines = (v: unknown, max: number): string[] | null => {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v) || !v.every((x) => typeof x === "string")) return null;
  return (v as string[]).map((x) => x.trim()).filter(Boolean).map((x) => x.slice(0, max));
};

/**
 * Pure (tests + the save action): cleans the sections sent by the admin form. Trims text, drops empty
 * lines, keeps an existing anchor `id`. Every section needs a title and at least one paragraph or bullet.
 */
export function cleanSections(input: unknown): { sections: PageSection[] } | { error: string } {
  const L = pageTextLimits;
  if (!Array.isArray(input)) return { error: "Section data is invalid." };
  if (!input.length) return { error: "Keep at least one section, or use “Reset to default”." };
  if (input.length > L.sections) return { error: `At most ${L.sections} sections.` };
  const out: PageSection[] = [];
  for (const [i, raw] of input.entries()) {
    if (!raw || typeof raw !== "object") return { error: "Section data is invalid." };
    const r = raw as Record<string, unknown>;
    const title = typeof r.title === "string" ? r.title.trim() : "";
    const paragraphs = lines(r.paragraphs, L.paragraph);
    const bullets = lines(r.bullets, L.bullet);
    if (!paragraphs || !bullets) return { error: "Section data is invalid." };
    if (!title) return { error: `Section ${i + 1}: write a heading.` };
    if (title.length > L.title) return { error: `Section ${i + 1}: the heading is too long (max ${L.title} characters).` };
    if (!paragraphs.length && !bullets.length) return { error: `Section ${i + 1} (“${title}”): add a paragraph or a bullet point.` };
    if (paragraphs.length > L.paragraphs) return { error: `Section ${i + 1}: at most ${L.paragraphs} paragraphs.` };
    if (bullets.length > L.bullets) return { error: `Section ${i + 1}: at most ${L.bullets} bullet points.` };
    if (out.some((s) => s.title === title)) return { error: `Two sections are called “${title}”. Give each section its own heading.` };
    const id = typeof r.id === "string" && /^[a-z0-9-]{1,40}$/.test(r.id) ? r.id : undefined;
    out.push(normalize({ id, title, paragraphs, bullets }));
  }
  return { sections: out };
}

/** Stored JSON → sections, or null (use the default) when it is missing or not valid */
function storedSections(v: unknown): PageSection[] | null {
  if (v === null || v === undefined) return null;
  const r = cleanSections(v);
  return "sections" in r ? r.sections : null;
}

/** Pure (exported for tests): content-file text with the admin overrides applied */
export function applyPageText(c: PageContent, row: PageTextRow | null | undefined): PageContent {
  if (!row) return c;
  return { ...c, hook: row.hook ?? c.hook, intro: row.intro ?? c.intro, sections: storedSections(row.sections) ?? c.sections };
}

export type PageTextFormValues = { hook: string; intro: string; sections: PageSection[]; changed: { hook: boolean; intro: boolean; sections: boolean } };

/** Pure: what Admin → Page text shows (the text the page uses now) + which fields are overridden */
export function pageTextFormValues(c: PageContent, row: PageTextRow | null | undefined): PageTextFormValues {
  const merged = applyPageText(c, row);
  return {
    hook: merged.hook ?? "",
    intro: merged.intro,
    sections: merged.sections.map(normalize),
    changed: { hook: row?.hook != null, intro: row?.intro != null, sections: storedSections(row?.sections) !== null },
  };
}

const getRow = cache(async (page: string, locale: Locale): Promise<PageTextRow | null> => {
  try {
    return await prisma.pageText.findUnique({ where: { page_locale: { page, locale } } });
  } catch {
    return null;
  }
});

/** Page copy for ContentPage / LocationPage: the content file + Admin → Page text overrides (service + location pages only). */
export async function getPageContentWithText(pageKey: PageKey, locale: Locale): Promise<PageContent> {
  const c = getPageContent(pageKey, locale);
  if (!getEditablePage(pageKey)) return c;
  return applyPageText(c, await getRow(pageKey, locale));
}
