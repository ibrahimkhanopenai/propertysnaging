import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { staticRoutes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { localePath } from "@/i18n/config";
import { organizationSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";

const paths = staticRoutes.map((r) => r.path);

describe("route registry (SEO rule: never change a public URL)", () => {
  it("every path has leading + trailing slash and no locale prefix", () => {
    for (const p of paths) {
      expect(p, p).toMatch(/^\/(.*\/)?$/);
      expect(p, p).not.toMatch(/^\/(en|ar)\//);
    }
  });
  it("paths and keys are unique", () => {
    expect(new Set(paths).size).toBe(paths.length);
    expect(new Set(staticRoutes.map((r) => r.key)).size).toBe(staticRoutes.length);
  });
  it("every route has a page file", () => {
    for (const p of paths) {
      const file = path.join(process.cwd(), "src/app/[locale]", p, "page.tsx");
      expect(fs.existsSync(file), file).toBe(true);
    }
  });
  it("legacy URLs are unchanged (update the snapshot ONLY with a 301 in place)", () => {
    expect(staticRoutes.filter((r) => r.legacy).map((r) => r.path)).toMatchSnapshot();
  });
});

describe("localePath", () => {
  it("English has no prefix, Arabic lives under /ar/", () => {
    expect(localePath("en", "/about-us/")).toBe("/about-us/");
    expect(localePath("ar", "/about-us/")).toBe("/ar/about-us/");
    expect(localePath("ar", "/")).toBe("/ar/");
  });
});

describe("buildMetadata", () => {
  const meta = (locale: "en" | "ar") => buildMetadata({ locale, path: "/about-us/", title: "About", description: "d" });

  it("sets canonical and hreflang alternates", () => {
    const m = meta("ar");
    expect(m.alternates?.canonical).toBe(`${site.url}/ar/about-us/`);
    expect(m.alternates?.languages).toEqual({
      en: `${site.url}/about-us/`,
      ar: `${site.url}/ar/about-us/`,
      "x-default": `${site.url}/about-us/`,
    });
  });
  it("omits alternates for single-language pages and respects a custom canonical", () => {
    const m = buildMetadata({ locale: "en", path: "/x/", title: "t", description: "d", hasAlternates: false, canonical: "https://a.b/" });
    expect(m.alternates).toEqual({ canonical: "https://a.b/" });
  });
  it("is indexable by default", () => expect(meta("en").robots).toMatchObject({ index: true, follow: true }));
});

describe("structured data", () => {
  it("has no review/rating schema while reviews are placeholders", () => {
    expect(site.reviews.isPlaceholder).toBe(true);
    expect(JSON.stringify(organizationSchema())).not.toMatch(/aggregateRating|"Review"/i);
  });
  it("JsonLd escapes < so content cannot close the script tag", () => {
    const el = JsonLd({ data: { name: "</script><script>alert(1)</script>" } });
    expect(el.props.dangerouslySetInnerHTML.__html).not.toContain("</script>");
  });
});
