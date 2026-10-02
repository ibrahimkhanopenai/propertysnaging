#!/usr/bin/env node
/**
 * Exports the CURRENT Yoast SEO title/description/canonical of every WordPress
 * page and post to docs/legacy-seo.json. Use it to keep meta tags identical
 * after migration (compare with src/content/pages.en.ts).
 *   npm run wp:seo-export
 */
import { writeFile } from "node:fs/promises";

const WP = (process.env.WP_SOURCE_URL || "https://propertyinspectors.me").replace(/\/$/, "");

async function all(type) {
  const out = [];
  for (let page = 1; page < 20; page++) {
    const r = await fetch(`${WP}/wp-json/wp/v2/${type}?per_page=100&page=${page}&_fields=link,slug,yoast_head_json`);
    if (!r.ok) break;
    const rows = await r.json();
    if (!rows.length) break;
    out.push(...rows);
    if (rows.length < 100) break;
  }
  return out;
}

const pick = (row) => ({
  path: new URL(row.link).pathname,
  title: row.yoast_head_json?.title ?? null,
  description: row.yoast_head_json?.description ?? null,
  canonical: row.yoast_head_json?.canonical ?? null,
  robots: row.yoast_head_json?.robots ?? null,
  ogImage: row.yoast_head_json?.og_image?.[0]?.url ?? null,
});

const [pages, posts] = await Promise.all([all("pages"), all("posts")]);
const data = { exportedAt: new Date().toISOString(), source: WP, pages: pages.map(pick), posts: posts.map(pick) };
await writeFile("docs/legacy-seo.json", JSON.stringify(data, null, 2));
console.log(`Saved docs/legacy-seo.json (${data.pages.length} pages, ${data.posts.length} posts)`);
