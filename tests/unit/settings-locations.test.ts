import { beforeEach, describe, expect, it, vi } from "vitest";

const { setting, locationItem } = vi.hoisted(() => ({ setting: { findMany: vi.fn() }, locationItem: { findMany: vi.fn() } }));
vi.mock("@/lib/db", () => ({ prisma: { setting, locationItem } }));

import { getLocationItems } from "@/lib/content-db";
import { mergeSettings, waLink } from "@/lib/settings";
import { settingFields, validateSetting } from "@/lib/settings-fields";
import { defaultAreas, suggestedCommunities } from "@/content/location-defaults";
import { locationsEn, type LocationKey } from "@/content/locations.en";
import { site } from "@/lib/site";

const field = (key: string) => settingFields.find((f) => f.key === key)!;

describe("Admin → Settings", () => {
  it("falls back to the site.ts defaults when nothing is saved", () => {
    const s = mergeSettings([]);
    expect(s.phone).toBe(site.phone);
    expect(s.whatsapp).toBe(site.whatsapp);
    expect(s.address.country).toBe("AE");
    expect(s.stats.map((x) => x.value)).toEqual(site.stats.map((x) => x.value));
    expect(s.sampleReportUrl).toBe(site.pdfs.sampleReport);
  });
  it("saved values override defaults; blank values are ignored", () => {
    const s = mergeSettings([
      { key: "phoneDisplay", value: "+971 50 000 0000" },
      { key: "stat.inspections", value: "20,000+" },
      { key: "email", value: "   " },
    ]);
    expect(s.phoneDisplay).toBe("+971 50 000 0000");
    expect(s.stats.find((x) => x.key === "inspections")?.value).toBe("20,000+");
    expect(s.email).toBe(site.email);
  });
  it("validates each field type", () => {
    expect(validateSetting(field("phone"), "+971581551637")).toBeNull();
    expect(validateSetting(field("phone"), "058 155 1637")).toMatch(/digits only/);
    expect(validateSetting(field("whatsapp"), "971581551637")).toBeNull();
    expect(validateSetting(field("whatsapp"), "+971581551637")).not.toBeNull();
    expect(validateSetting(field("email"), "info@example.com")).toBeNull();
    expect(validateSetting(field("email"), "info@")).not.toBeNull();
    expect(validateSetting(field("sampleReportUrl"), "https://drive.google.com/file/d/abc/view")).toBeNull();
    expect(validateSetting(field("sampleReportUrl"), "/downloads/report.pdf")).toBeNull();
    expect(validateSetting(field("sampleReportUrl"), "javascript:alert(1)")).not.toBeNull();
    expect(validateSetting(field("stat.inspections"), "<b>1</b>")).not.toBeNull();
  });
  it("builds WhatsApp links from the configured number", () => {
    expect(waLink({ whatsapp: "971500000000" }, "Hi there")).toBe("https://wa.me/971500000000?text=Hi%20there");
  });
});

describe("Admin → Locations", () => {
  beforeEach(() => vi.resetAllMocks());

  it("uses saved rows: published only, Arabic name when set", async () => {
    locationItem.findMany.mockResolvedValue([
      { kind: "AREA", name: "Business Bay", nameAr: "الخليج التجاري", developer: null, published: true },
      { kind: "AREA", name: "Hidden", nameAr: null, developer: null, published: false },
      { kind: "COMMUNITY", name: "Dubai Hills Estate", nameAr: null, developer: "Emaar", published: true },
    ]);
    const ar = await getLocationItems("dubai", "ar", ["Fallback"]);
    expect(ar.areas).toEqual(["الخليج التجاري"]);
    expect(ar.communities).toEqual([{ name: "Dubai Hills Estate", developer: "Emaar" }]);
  });
  it("falls back to the content areas when the emirate has no rows", async () => {
    locationItem.findMany.mockResolvedValue([]);
    expect(await getLocationItems("dubai", "en", ["A", "B"])).toEqual({ areas: ["A", "B"], communities: [] });
  });
  it("falls back to the content areas when the DB is down", async () => {
    locationItem.findMany.mockRejectedValue(new Error("ECONNREFUSED"));
    expect(await getLocationItems("dubai", "en", ["A"])).toEqual({ areas: ["A"], communities: [] });
  });
  it("default lists cover every location page, with Arabic names", () => {
    for (const key of Object.keys(locationsEn) as LocationKey[]) {
      const areas = defaultAreas(key);
      expect(areas.length, key).toBeGreaterThan(0);
      for (const a of areas) expect(a.nameAr, `${key}: ${a.name}`).toBeTruthy();
      for (const c of suggestedCommunities[key]) expect(c.nameAr && c.developer, `${key}: ${c.name}`).toBeTruthy();
    }
  });
});
