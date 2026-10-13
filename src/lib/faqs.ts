import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPageContent } from "@/content/pages";
import { editablePages, type EditablePage } from "@/lib/admin-pages";

/**
 * Admin → FAQs reads. Same pattern as getSettings(): FAQs from the dictionaries (homepage) and
 * content/{services,locations}.*.ts are the defaults; once a page has FaqItem rows, those replace them.
 * MySQL down → defaults.
 */

export type Faq = { q: string; a: string };
export type FaqPageKey = "home" | EditablePage["key"];

export const faqPages: Array<{ key: FaqPageKey; group: "home" | "service" | "location"; label: string; path: string }> = [
  { key: "home", group: "home", label: "Homepage", path: "/" },
  ...editablePages,
];

export const isFaqPage = (key: string): key is FaqPageKey => faqPages.some((p) => p.key === key);

/** The FAQs in code (shown while the page has no rows) */
export function defaultFaqs(page: FaqPageKey, locale: Locale): Faq[] {
  return page === "home" ? getDictionary(locale).home.faq.items : (getPageContent(page, locale).faqs ?? []);
}

export type FaqRow = { question: string; answer: string; questionAr: string | null; answerAr: string | null; published: boolean };

/**
 * Pure (exported for tests). No rows → defaults. Rows → the published ones in order; the Arabic page
 * only shows rows with an Arabic question and answer (an English answer on an Arabic page reads as broken).
 */
export function resolveFaqs(rows: FaqRow[], defaults: Faq[], locale: Locale): Faq[] {
  if (!rows.length) return defaults;
  return rows
    .filter((r) => r.published)
    .flatMap((r) => (locale === "ar" ? (r.questionAr && r.answerAr ? [{ q: r.questionAr, a: r.answerAr }] : []) : [{ q: r.question, a: r.answer }]));
}

// One query per render: /faqs/ shows the homepage set + every service page
const getFaqRows = cache(async (): Promise<Map<string, FaqRow[]>> => {
  try {
    const rows = await prisma.faqItem.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
    const byPage = new Map<string, FaqRow[]>();
    for (const r of rows) byPage.set(r.page, [...(byPage.get(r.page) ?? []), r]);
    return byPage;
  } catch {
    return new Map();
  }
});

/** `await getFaqs("home", locale)` → the FAQs to render (and to put in the FAQPage JSON-LD) */
export async function getFaqs(page: FaqPageKey, locale: Locale): Promise<Faq[]> {
  return resolveFaqs((await getFaqRows()).get(page) ?? [], defaultFaqs(page, locale), locale);
}
