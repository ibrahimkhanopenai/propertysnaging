import { beforeEach, describe, expect, it, vi } from "vitest";

const { siteImage: siteImageTable, developerLogo } = vi.hoisted(() => ({ siteImage: { findMany: vi.fn() }, developerLogo: { findMany: vi.fn() } }));
vi.mock("@/lib/db", () => ({ prisma: { siteImage: siteImageTable, developerLogo } }));

import { getImageSlot, imageGroups, imageSlots, isImagePath, pageImageSlot } from "@/lib/image-slots";
import { getDeveloperLogos, resolveImage, siteImage, slotFormValues } from "@/lib/site-images";
import { site } from "@/lib/site";
import en from "@/i18n/dictionaries/en";
import ar from "@/i18n/dictionaries/ar";

const hero = getImageSlot("hero")!;
const row = (r: Partial<{ url: string; alt: string; altAr: string }>) => ({ key: "hero", url: null, alt: null, altAr: null, ...r });

describe("Admin → Images: slots", () => {
  it("covers every replaceable photo in site.ts, each with a default ALT in both languages", () => {
    const srcs = imageSlots.map((s) => s.src);
    for (const src of [site.images.hero, site.images.about, ...Object.values(site.images.locations), ...Object.values(site.images.scope), ...site.images.report, ...site.images.findingPhotos]) {
      expect(srcs).toContain(src);
    }
    expect(imageSlots).toHaveLength(2 + 7 + 8 + 3 + 4);
    expect(new Set(imageSlots.map((s) => s.key)).size).toBe(imageSlots.length);
    for (const s of imageSlots) {
      expect(s.alt("en").length).toBeGreaterThan(5);
      expect(s.alt("ar").length).toBeGreaterThan(5);
      expect(s.key.length).toBeLessThanOrEqual(64); // SiteImage.key VARCHAR(64)
      expect(imageGroups.map((g) => g.key)).toContain(s.group);
    }
    expect(hero.alt("en")).toBe(en.home.hero.imageAlt);
    expect(hero.alt("ar")).toBe(ar.home.hero.imageAlt);
  });
  it("maps page heroes to slots", () => {
    expect(pageImageSlot("about")).toBe("about");
    expect(pageImageSlot("sampleReport")).toBe("report.1");
    expect(pageImageSlot("dubai")).toBe("location.dubai");
    expect(pageImageSlot("preHandover")).toBeNull();
  });
  it("accepts only our own image paths", () => {
    expect(isImagePath("/uploads/2026/10/new-hero-a1b2c3.jpg")).toBe(true);
    expect(isImagePath("/images/scope/roof.png")).toBe(true);
    expect(isImagePath("https://example.com/a.jpg")).toBe(false);
    expect(isImagePath("/uploads/../.env")).toBe(false);
    expect(isImagePath("/uploads/a/../../b.jpg")).toBe(false);
    expect(isImagePath("javascript:alert(1)")).toBe(false);
    expect(isImagePath("/uploads/file.svg")).toBe(false);
  });
});

describe("Admin → Images: resolving", () => {
  it("uses the defaults with no row", () => {
    expect(resolveImage(hero, undefined, "en")).toEqual({ src: site.images.hero, alt: en.home.hero.imageAlt });
    expect(resolveImage(hero, undefined, "ar").alt).toBe(ar.home.hero.imageAlt);
  });
  it("replaced photo: saved ALTs, and the English ALT on the Arabic page when no Arabic ALT is saved", () => {
    const r = row({ url: "/uploads/2026/10/x.jpg", alt: "New photo" });
    expect(resolveImage(hero, r, "en")).toEqual({ src: "/uploads/2026/10/x.jpg", alt: "New photo" });
    expect(resolveImage(hero, r, "ar").alt).toBe("New photo");
    expect(resolveImage(hero, { ...r, altAr: "صورة" }, "ar").alt).toBe("صورة");
  });
  it("ALT-only change keeps the default photo and the default Arabic ALT", () => {
    const r = row({ alt: "Better ALT" });
    expect(resolveImage(hero, r, "en")).toEqual({ src: site.images.hero, alt: "Better ALT" });
    expect(resolveImage(hero, r, "ar").alt).toBe(ar.home.hero.imageAlt);
  });
  it("form values: default, changed, and an empty Arabic field for a replaced photo", () => {
    expect(slotFormValues(hero, undefined)).toEqual({ url: site.images.hero, alt: en.home.hero.imageAlt, altAr: ar.home.hero.imageAlt, changed: false });
    expect(slotFormValues(hero, { url: "/uploads/x.jpg", alt: "New", altAr: null })).toEqual({ url: "/uploads/x.jpg", alt: "New", altAr: "", changed: true });
  });
});

describe("Admin → Images + Developer logos: DB reads", () => {
  beforeEach(() => vi.resetAllMocks());

  it("siteImage reads the saved row", async () => {
    siteImageTable.findMany.mockResolvedValue([{ ...row({ url: "/uploads/about.jpg", alt: "Engineer at a handover" }), key: "about" }]);
    expect(await siteImage("about", "en")).toEqual({ src: "/uploads/about.jpg", alt: "Engineer at a handover" });
  });
  it("siteImage falls back to the default when MySQL is down", async () => {
    siteImageTable.findMany.mockRejectedValue(new Error("down"));
    expect((await siteImage("location.sharjah", "en")).src).toBe(site.images.locations.sharjah);
  });
  it("developer logos: published rows in order, Arabic name when set", async () => {
    developerLogo.findMany.mockResolvedValue([
      { name: "Emaar", nameAr: "إعمار", logo: "/uploads/emaar.png", published: true },
      { name: "Hidden", nameAr: null, logo: "/uploads/h.png", published: false },
      { name: "DAMAC", nameAr: null, logo: "/uploads/damac.png", published: true },
    ]);
    expect(await getDeveloperLogos("en")).toEqual([{ name: "Emaar", logo: "/uploads/emaar.png" }, { name: "DAMAC", logo: "/uploads/damac.png" }]);
    expect((await getDeveloperLogos("ar"))[0].name).toBe("إعمار");
  });
  it("developer logos: all hidden → empty (the strip is hidden)", async () => {
    developerLogo.findMany.mockResolvedValue([{ name: "Hidden", nameAr: null, logo: "/uploads/h.png", published: false }]);
    expect(await getDeveloperLogos("en")).toEqual([]);
  });
  it("developer logos: no rows or DB down → site.developers", async () => {
    developerLogo.findMany.mockResolvedValue([]);
    expect((await getDeveloperLogos("en")).map((d) => d.name)).toEqual(site.developers.map((d) => d.name));
    developerLogo.findMany.mockRejectedValue(new Error("down"));
    expect(await getDeveloperLogos("en")).toHaveLength(site.developers.length);
  });
});
