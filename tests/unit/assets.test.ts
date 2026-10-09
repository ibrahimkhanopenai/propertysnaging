import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { legacyAssetRedirects } from "@/lib/legacy-redirects";
import { site } from "@/lib/site";

/** Public URL → file on disk (favicon comes from the src/app/icon.jpg convention) */
const fileFor = (url: string) =>
  url === "/icon.jpg" ? path.join(process.cwd(), "src/app/icon.jpg") : path.join(process.cwd(), "public", url);

/** Every string in site.ts that points at /images/ or /downloads/ */
const sitePaths = (value: unknown): string[] =>
  typeof value === "string"
    ? /^\/(images|downloads)\//.test(value) ? [value] : []
    : value && typeof value === "object"
      ? Object.values(value).flatMap(sitePaths)
      : [];

describe("site assets", () => {
  it("every image/PDF path in site.ts exists in /public", () => {
    const paths = sitePaths(site);
    expect(paths.length).toBeGreaterThan(40);
    for (const p of paths) expect(fs.existsSync(fileFor(p)), p).toBe(true);
  });
  it("file names are lowercase-hyphen (SEO naming rule)", () => {
    for (const p of sitePaths(site)) expect(p, p).toMatch(/^\/[a-z0-9/-]+\.(jpg|png|webp|avif|svg|pdf)$/);
  });
});

describe("legacy asset redirects (old URLs are indexed — never drop one)", () => {
  it("are 301s to files that exist", () => {
    for (const r of legacyAssetRedirects) {
      expect(r.statusCode).toBe(301);
      expect(fs.existsSync(fileFor(r.destination)), `${r.source} → ${r.destination}`).toBe(true);
    }
  });
  it("sources are unique", () => {
    const sources = legacyAssetRedirects.map((r) => r.source);
    expect(new Set(sources).size).toBe(sources.length);
  });
  it("cover the downloadable PDFs", () => {
    const targets = new Set(legacyAssetRedirects.map((r) => r.destination));
    for (const pdf of Object.values(site.pdfs)) expect(targets.has(pdf), pdf).toBe(true);
  });
});
