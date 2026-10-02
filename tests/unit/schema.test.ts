import { describe, expect, it } from "vitest";
import { articleSchema, breadcrumbSchema, faqSchema, serviceSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

describe("JSON-LD builders", () => {
  it("breadcrumbs are 1-indexed with absolute URLs", () => {
    const s = breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Villa", url: "/villa-snagging-dubai/" }]);
    expect(s.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Villa", item: `${site.url}/villa-snagging-dubai/` },
    ]);
  });

  it("FAQ maps questions to accepted answers", () => {
    expect(faqSchema([{ q: "How long?", a: "2 hours" }]).mainEntity).toEqual([
      { "@type": "Question", name: "How long?", acceptedAnswer: { "@type": "Answer", text: "2 hours" } },
    ]);
  });

  it("service uses one city when given, else every served area", () => {
    expect(serviceSchema({ name: "n", description: "d", url: "/x/", area: "Dubai" }).areaServed).toEqual({ "@type": "City", name: "Dubai" });
    expect(serviceSchema({ name: "n", description: "d", url: "/x/" }).areaServed).toHaveLength(site.areaServed.length);
  });

  it("article defaults to BlogPosting by the organisation and omits a missing image", () => {
    const a = articleSchema({ type: "", title: "t", description: "d", url: "/post/", inLanguage: "en" });
    expect(a["@type"]).toBe("BlogPosting");
    expect(a.author).toEqual({ "@type": "Organization", name: site.name });
    expect(a.image).toBeUndefined();
    expect(articleSchema({ type: "Article", title: "t", description: "d", url: "/p/", image: "/a.jpg", inLanguage: "ar" }).image).toEqual([`${site.url}/a.jpg`]);
  });

  it("website schema points at the site URL", () => {
    expect(JSON.stringify(websiteSchema())).toContain(site.url);
  });
});
