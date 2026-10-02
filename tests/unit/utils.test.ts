import { describe, expect, it } from "vitest";
import { cn, normalizePath, readingMinutes, slugify } from "@/lib/utils";
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

describe("estimatePrice", () => {
  it("counts studio as 1 bedroom", () => expect(estimatePrice("apartment", 0, 10)).toBe(10));
  it("multiplies bedrooms", () => expect(estimatePrice("villa", 4, 10)).toBe(40));
  it("returns null for commercial", () => expect(estimatePrice("commercial", 3, 10)).toBeNull());
  it("floors fractional bedrooms", () => expect(estimatePrice("apartment", 2.7, 10)).toBe(20));
});
