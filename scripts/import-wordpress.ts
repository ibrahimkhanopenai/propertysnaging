/**
 * Imports ALL WordPress blog posts into MySQL with the same slug (= same URL),
 * Yoast SEO title/description, featured image + alt, categories and dates.
 * HTML is converted to Markdown. Safe to re-run (upserts by slug).
 *   npm run wp:import
 * Images keep their /wp-content/uploads/... path → run `npm run assets:download` too.
 */
import { PrismaClient } from "@prisma/client";
import TurndownService from "turndown";

const WP = (process.env.WP_SOURCE_URL || "https://propertyinspectors.me").replace(/\/$/, "");
const prisma = new PrismaClient();
const td = new TurndownService({ headingStyle: "atx", bulletListMarker: "-", codeBlockStyle: "fenced" });
// Drop Elementor wrappers / scripts / styles
td.remove(["script", "style", "noscript", "iframe"]);

type WpPost = {
  slug: string;
  date_gmt: string;
  modified_gmt: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  yoast_head_json?: { title?: string; description?: string; og_title?: string; og_description?: string; robots?: { index?: string; follow?: string } };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string; alt_text?: string }>;
    "wp:term"?: Array<Array<{ taxonomy: string; name: string; slug: string }>>;
    author?: Array<{ name?: string }>;
  };
};

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&#8217;|&#039;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;|&#8230;/g, "…")
    .replace(/\s+/g, " ")
    .trim();

const toPath = (u?: string) => {
  if (!u) return null;
  try {
    const url = new URL(u);
    return url.hostname.endsWith("propertyinspectors.me") ? url.pathname : u;
  } catch {
    return u;
  }
};

async function fetchAll(): Promise<WpPost[]> {
  const out: WpPost[] = [];
  for (let page = 1; page < 50; page++) {
    const r = await fetch(`${WP}/wp-json/wp/v2/posts?per_page=50&page=${page}&_embed=1`);
    if (!r.ok) break;
    const rows = (await r.json()) as WpPost[];
    out.push(...rows);
    if (rows.length < 50) break;
  }
  return out;
}

async function main() {
  const posts = await fetchAll();
  console.log(`Found ${posts.length} WordPress posts`);
  for (const p of posts) {
    const html = p.content.rendered.replace(new RegExp(`https?://(www\\.)?propertyinspectors\\.me`, "g"), "");
    const content = td.turndown(html).replace(/\n{3,}/g, "\n\n").trim();
    const media = p._embedded?.["wp:featuredmedia"]?.[0];
    const terms = (p._embedded?.["wp:term"] ?? []).flat();
    const cat = terms.find((t) => t.taxonomy === "category" && t.slug !== "uncategorized");
    let categoryId: number | null = null;
    if (cat) {
      const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: { name: decode(cat.name), slug: cat.slug } });
      categoryId = c.id;
    }
    const y = p.yoast_head_json ?? {};
    const data = {
      title: decode(p.title.rendered),
      content,
      excerpt: decode(p.excerpt.rendered).slice(0, 300) || null,
      featuredImage: toPath(media?.source_url),
      featuredImageAlt: media?.alt_text || null,
      status: "PUBLISHED" as const,
      publishedAt: new Date(`${p.date_gmt}Z`),
      authorName: p._embedded?.author?.[0]?.name ?? null,
      categoryId,
      tags: terms.filter((t) => t.taxonomy === "post_tag").map((t) => decode(t.name)).join(", ") || null,
      metaTitle: y.title ? decode(y.title) : null,
      metaDescription: y.description ? decode(y.description) : null,
      ogTitle: y.og_title ? decode(y.og_title) : null,
      ogDescription: y.og_description ? decode(y.og_description) : null,
      robotsIndex: y.robots?.index !== "noindex",
      robotsFollow: y.robots?.follow !== "nofollow",
      schemaType: "BlogPosting",
    };
    await prisma.post.upsert({
      where: { locale_slug: { locale: "en", slug: p.slug } },
      update: data,
      create: { ...data, slug: p.slug, locale: "en" },
    });
    console.log("✓", `/${p.slug}/`);
  }
  console.log("Import complete. Review each post in /admin/posts/ (Elementor HTML may need small clean-ups).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
