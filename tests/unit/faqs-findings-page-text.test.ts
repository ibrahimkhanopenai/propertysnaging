import { beforeEach, describe, expect, it, vi } from "vitest";

const { faqItem, finding, pageText, siteImage: siteImageTable } = vi.hoisted(() => ({
  faqItem: { findMany: vi.fn() },
  finding: { findMany: vi.fn() },
  pageText: { findUnique: vi.fn() },
  siteImage: { findMany: vi.fn() },
}));
vi.mock("@/lib/db", () => ({ prisma: { faqItem, finding, pageText, siteImage: siteImageTable } }));

import { defaultFaqs, faqPages, getFaqs, isFaqPage, resolveFaqs, type FaqRow } from "@/lib/faqs";
import { defaultFindings, getFindings, resolveFindings, type FindingRow } from "@/lib/findings";
import { applyPageText, cleanSections, getPageContentWithText, pageTextFormValues, sameSections } from "@/lib/page-text";
import { editablePages, getEditablePage } from "@/lib/admin-pages";
import { getPageContent } from "@/content/pages";
import { serviceKeys, locationKeys } from "@/lib/routes";
import { site } from "@/lib/site";
import en from "@/i18n/dictionaries/en";
import ar from "@/i18n/dictionaries/ar";

const faq = (r: Partial<FaqRow>): FaqRow => ({ question: "Q", answer: "A", questionAr: null, answerAr: null, published: true, ...r });
const findingRow = (r: Partial<FindingRow>): FindingRow => ({
  category: "Plumbing",
  categoryAr: null,
  defect: "Leak",
  defectAr: null,
  fix: "Fix it",
  fixAr: null,
  photo: "/uploads/2026/10/leak.jpg",
  alt: "Leak under the sink",
  altAr: null,
  published: true,
  ...r,
});

beforeEach(() => {
  vi.clearAllMocks();
  siteImageTable.findMany.mockResolvedValue([]);
});

describe("Admin pages list", () => {
  it("covers every service and location page, with labels and paths", () => {
    expect(editablePages.map((p) => p.key).sort()).toEqual([...serviceKeys, ...locationKeys].sort());
    for (const p of editablePages) {
      expect(p.label.length).toBeGreaterThan(2);
      expect(p.path).toMatch(/^\/.+\/$/);
    }
    expect(getEditablePage("dubai")?.group).toBe("location");
    expect(getEditablePage("about")).toBeUndefined();
  });
});

describe("Admin → FAQs", () => {
  it("lists the homepage + every service/location page; default FAQs pair up EN/AR", () => {
    expect(faqPages[0].key).toBe("home");
    expect(faqPages).toHaveLength(1 + editablePages.length);
    expect(isFaqPage("home")).toBe(true);
    expect(isFaqPage("villaSnagging")).toBe(true);
    expect(isFaqPage("privacy")).toBe(false);
    for (const p of faqPages) {
      const e = defaultFaqs(p.key, "en");
      const a = defaultFaqs(p.key, "ar");
      expect(a).toHaveLength(e.length); // "Load" pairs them by position
      for (const f of e) expect(f.q.length).toBeLessThanOrEqual(500); // FaqItem.question VARCHAR(500)
    }
    expect(defaultFaqs("home", "en")).toBe(en.home.faq.items);
    expect(defaultFaqs("dubai", "ar")).toBe(getPageContent("dubai", "ar").faqs);
  });

  it("no rows → the code defaults; rows → published ones in order", () => {
    const defaults = [{ q: "d", a: "d" }];
    expect(resolveFaqs([], defaults, "en")).toBe(defaults);
    const rows = [faq({ question: "1" }), faq({ question: "hidden", published: false }), faq({ question: "2" })];
    expect(resolveFaqs(rows, defaults, "en").map((f) => f.q)).toEqual(["1", "2"]);
    // All hidden → nothing (not the defaults)
    expect(resolveFaqs([faq({ published: false })], defaults, "en")).toEqual([]);
  });

  it("Arabic page shows only rows with an Arabic question and answer", () => {
    const rows = [faq({ questionAr: "س١", answerAr: "ج١" }), faq({ questionAr: "س٢" }), faq({})];
    expect(resolveFaqs(rows, [], "ar")).toEqual([{ q: "س١", a: "ج١" }]);
    expect(resolveFaqs(rows, [], "en")).toHaveLength(3);
  });

  it("reads rows per page, falls back when a page has none or the DB is down", async () => {
    faqItem.findMany.mockResolvedValue([{ ...faq({ question: "Custom" }), id: 1, page: "home" }]);
    expect(await getFaqs("home", "en")).toEqual([{ q: "Custom", a: "A" }]);
    expect(await getFaqs("dubai", "en")).toEqual(getPageContent("dubai", "en").faqs);
    faqItem.findMany.mockRejectedValue(new Error("db down"));
    expect(await getFaqs("home", "ar")).toEqual(ar.home.faq.items);
  });
});

describe("Admin → Defects we find", () => {
  it("default list: dictionary items with the scope photos, EN/AR paired", async () => {
    expect(ar.home.findings.items).toHaveLength(en.home.findings.items.length);
    for (const [i, it] of en.home.findings.items.entries()) {
      expect(Object.keys(site.images.scope)).toContain(it.photo);
      expect(ar.home.findings.items[i].photo).toBe(it.photo);
    }
    const items = await defaultFindings("en");
    expect(items.map((x) => x.defect)).toEqual(en.home.findings.items.map((x) => x.defect));
    expect(items[0].src).toBe(site.images.scope.paint);
    expect(items[0].marker).toBe(true); // the annotation dot is placed for this photo
    expect(items.filter((x) => x.marker)).toHaveLength(1);
  });

  it("rows: published only; Arabic needs Arabic text; Arabic ALT falls back to English", () => {
    const rows = [
      findingRow({ categoryAr: "سباكة", defectAr: "تسرب", fixAr: "إصلاح" }),
      findingRow({ defect: "Hidden", published: false }),
      findingRow({ defect: "English only" }),
      findingRow({ photo: site.images.scope.paint, categoryAr: "طلاء", defectAr: "رطوبة", fixAr: "معالجة", altAr: "رطوبة على الجدار" }),
    ];
    const enItems = resolveFindings(rows, "en");
    expect(enItems.map((x) => x.defect)).toEqual(["Leak", "English only", "Leak"]);
    expect(enItems.map((x) => x.marker)).toEqual([false, false, true]);
    const arItems = resolveFindings(rows, "ar");
    expect(arItems).toHaveLength(2);
    expect(arItems[0]).toMatchObject({ category: "سباكة", defect: "تسرب", fix: "إصلاح", alt: "Leak under the sink" });
    expect(arItems[1].alt).toBe("رطوبة على الجدار");
  });

  it("uses the table when it has rows, else (or when the DB is down) the defaults", async () => {
    finding.findMany.mockResolvedValue([findingRow({ published: false })]);
    expect(await getFindings("en")).toEqual([]); // every finding hidden → the section is hidden
    finding.findMany.mockResolvedValue([]);
    expect(await getFindings("en")).toHaveLength(en.home.findings.items.length);
    finding.findMany.mockRejectedValue(new Error("db down"));
    expect((await getFindings("ar"))[0].defect).toBe(ar.home.findings.items[0].defect);
  });
});

describe("Admin → Page text", () => {
  it("every default section of the editable pages passes validation unchanged", () => {
    for (const p of editablePages) {
      for (const l of ["en", "ar"] as const) {
        const c = getPageContent(p.key, l);
        const r = cleanSections(c.sections);
        expect("sections" in r, `${p.key}/${l}`).toBe(true);
        if ("sections" in r) expect(sameSections(r.sections, c.sections)).toBe(true);
      }
    }
  });

  it("cleans sections: trims, drops empty lines, keeps a valid anchor id", () => {
    const r = cleanSections([{ id: "hvac", title: "  AC  ", paragraphs: [" One ", "", "  "], bullets: ["a", " "] }, { id: "Bad Id!", title: "B", bullets: ["x"] }]);
    expect(r).toEqual({ sections: [{ id: "hvac", title: "AC", paragraphs: ["One"], bullets: ["a"] }, { title: "B", bullets: ["x"] }] });
  });

  it("rejects invalid sections with a clear message", () => {
    const err = (v: unknown) => ("error" in cleanSections(v) ? (cleanSections(v) as { error: string }).error : "");
    expect(err("x")).toMatch(/invalid/);
    expect(err([])).toMatch(/at least one section/);
    expect(err([{ title: "", paragraphs: ["p"] }])).toMatch(/Section 1: write a heading/);
    expect(err([{ title: "T", paragraphs: [""], bullets: [] }])).toMatch(/add a paragraph or a bullet/);
    expect(err([{ title: "T", paragraphs: ["a"] }, { title: "T", bullets: ["b"] }])).toMatch(/Two sections are called/);
    expect(err([{ title: "T", paragraphs: [1] }])).toMatch(/invalid/);
    expect(err(Array.from({ length: 13 }, (_, i) => ({ title: `T${i}`, paragraphs: ["p"] })))).toMatch(/At most 12/);
  });

  it("applies overrides on top of the content file; null fields and bad JSON use the default", () => {
    const c = getPageContent("dubai", "en");
    expect(applyPageText(c, null)).toBe(c);
    const sections = [{ title: "New tip", paragraphs: ["Text"] }];
    const merged = applyPageText(c, { hook: "New hook", intro: null, sections });
    expect(merged.hook).toBe("New hook");
    expect(merged.intro).toBe(c.intro);
    expect(merged.sections).toEqual(sections);
    expect(merged.h1).toBe(c.h1); // H1 / title / meta never change
    expect(merged.metaTitle).toBe(c.metaTitle);
    expect(applyPageText(c, { hook: null, intro: null, sections: [{ nope: 1 }] }).sections).toBe(c.sections);

    const form = pageTextFormValues(c, { hook: null, intro: "Custom intro", sections: null });
    expect(form).toMatchObject({ hook: c.hook, intro: "Custom intro", changed: { hook: false, intro: true, sections: false } });
  });

  it("reads the override for service/location pages only, defaults when the DB is down", async () => {
    pageText.findUnique.mockResolvedValue({ hook: null, intro: "DB intro", sections: null });
    expect((await getPageContentWithText("villaSnagging", "en")).intro).toBe("DB intro");
    expect(pageText.findUnique).toHaveBeenCalledWith({ where: { page_locale: { page: "villaSnagging", locale: "en" } } });
    pageText.findUnique.mockClear();
    expect(await getPageContentWithText("about", "en")).toBe(getPageContent("about", "en"));
    expect(pageText.findUnique).not.toHaveBeenCalled();
    pageText.findUnique.mockRejectedValue(new Error("db down"));
    expect((await getPageContentWithText("sharjah", "ar")).intro).toBe(getPageContent("sharjah", "ar").intro);
  });
});
