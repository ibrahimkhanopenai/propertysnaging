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
