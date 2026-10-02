#!/usr/bin/env node
/**
 * Downloads every image/PDF from the current WordPress site into /public,
 * keeping the SAME path (e.g. /wp-content/uploads/2025/11/report-1.jpg).
 * Same URLs = image SEO + backlinks to PDFs keep working after migration.
 *
 * Sources: Yoast sitemaps (image:loc), known PDFs, and any "/wp-content/uploads/..."
 * string found in /src. Run BEFORE switching the domain to Next.js.
 *   npm run assets:download
 */
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const WP = (process.env.WP_SOURCE_URL || "https://propertyinspectors.me").replace(/\/$/, "");
const ROOT = process.cwd();
const urls = new Set();

async function text(u) {
  const r = await fetch(u, { headers: { "User-Agent": "PI-migration/1.0" } });
  if (!r.ok) throw new Error(`${r.status} ${u}`);
  return r.text();
}

async function fromSitemaps() {
  const index = await text(`${WP}/sitemap_index.xml`);
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const m of maps) {
    try {
      const xml = await text(m);
      for (const x of xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)) urls.add(x[1]);
    } catch (e) {
      console.warn("skip sitemap", m, e.message);
    }
  }
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(p);
    else if (/\.(tsx?|mjs|md)$/.test(entry.name)) {
      const src = await readFile(p, "utf8");
      for (const m of src.matchAll(/\/wp-content\/uploads\/[^"'`\s)]+/g)) urls.add(`${WP}${m[0]}`);
    }
  }
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log(`Collecting asset URLs from ${WP} …`);
  await fromSitemaps().catch((e) => console.warn("sitemap fetch failed:", e.message));
  await walk(path.join(ROOT, "src"));
  [
    "/wp-content/uploads/2026/02/PROFILE-Property-Inspectors.pdf",
    "/wp-content/uploads/2026/02/Sample-Report-PropertyInspectors.pdf",
    "/wp-content/uploads/2026/02/CHECKLIST-Property-Inspector.pdf",
    "/wp-content/uploads/2026/02/INSPECTION-TOOLS-PropertyInspectors.pdf",
  ].forEach((p) => urls.add(`${WP}${p}`));

  let ok = 0, skipped = 0, failed = 0;
  for (const u of urls) {
    const pathname = decodeURIComponent(new URL(u).pathname);
    if (!pathname.startsWith("/wp-content/")) continue;
    const dest = path.join(ROOT, "public", pathname);
    if (await exists(dest)) { skipped++; continue; }
    try {
      const r = await fetch(u);
      if (!r.ok) throw new Error(String(r.status));
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, Buffer.from(await r.arrayBuffer()));
      ok++;
      console.log("✓", pathname);
    } catch (e) {
      failed++;
      console.warn("✗", pathname, e.message);
    }
  }
  console.log(`\nDone. downloaded=${ok} skipped=${skipped} failed=${failed}`);
}

main();
