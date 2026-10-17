import { describe, expect, it } from "vitest";
import { cn, normalizePath, parseUaeDateTimeInput, readingMinutes, slugify, toUaeDateTimeInput } from "@/lib/utils";
import { estimatePrice } from "@/lib/estimate";

describe("slugify", () => {
  it("lowercases, strips accents and punctuation", () => {
    expect(slugify("  Villa Snagging — Dubai! ")).toBe("villa-snagging-dubai");
    expect(slugify("Café Déjà Vu")).toBe("cafe-deja-vu");
  });
  it("keeps Arabic letters", () => {
    expect(slugify("فحص العقارات")).toBe("فحص-العقارات");
  });
});

describe("normalizePath", () => {
  it.each([
    ["about-us", "/about-us/"],
    ["/about-us", "/about-us/"],
    ["//a//b/", "/a/b/"],
    ["/", "/"],
  ])("%s → %s", (input, out) => expect(normalizePath(input)).toBe(out));
});

describe("readingMinutes / cn", () => {
  it("is at least 1 minute and ~220 wpm", () => {
    expect(readingMinutes("one")).toBe(1);
    expect(readingMinutes(Array(660).fill("w").join(" "))).toBe(3);
  });
  it("joins truthy classes", () => expect(cn("a", false, null, "b", undefined)).toBe("a b"));
});

describe("admin publish date (UAE time, UTC+4)", () => {
  it("shows a stored date in UAE time", () => {
    expect(toUaeDateTimeInput(new Date("2026-03-13T12:34:00Z"))).toBe("2026-03-13T16:34");
    expect(toUaeDateTimeInput(new Date("2026-03-13T22:00:00Z"))).toBe("2026-03-14T02:00");
    expect(toUaeDateTimeInput(null)).toBe("");
  });
  it("reads the input as UAE time, whatever the server timezone", () => {
    expect(parseUaeDateTimeInput("2026-03-13T16:34")?.toISOString()).toBe("2026-03-13T12:34:00.000Z");
    expect(parseUaeDateTimeInput("2026-03-14T02:00:30")?.toISOString()).toBe("2026-03-13T22:00:30.000Z");
  });
  it("round-trips, so saving a post again never moves its date", () => {
    const d = new Date("2026-03-19T10:30:00Z");
    let v = d;
    for (let i = 0; i < 3; i++) v = parseUaeDateTimeInput(toUaeDateTimeInput(v))!;
    expect(v.toISOString()).toBe(d.toISOString());
  });
  it("rejects anything that is not a datetime-local value", () => {
    for (const bad of ["", "2026-03-13", "13/03/2026 10:30", "2026-03-13T10:30Z", "2026-13-40T10:30"]) expect(parseUaeDateTimeInput(bad)).toBeNull();
  });
});

describe("estimatePrice (built-up area × rate per sq ft)", () => {
  it("multiplies the area by the rate", () => expect(estimatePrice(1250, 0.7)).toBe(875));
  it("rounds to whole AED", () => expect(estimatePrice(1001, 0.7)).toBe(701));
  it("needs at least 100 sq ft", () => {
    expect(estimatePrice(99, 0.7)).toBeNull();
    expect(estimatePrice(100, 0.7)).toBe(70);
  });
  it("returns null without an area", () => expect(estimatePrice(undefined, 0.7)).toBeNull());
  it("returns null without a configured rate", () => expect(estimatePrice(1250, null)).toBeNull());
});
