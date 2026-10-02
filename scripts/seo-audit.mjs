#!/usr/bin/env node
/**
 * Pre-launch SEO / QA audit (client checklist §17). Crawls every URL in sitemap.xml of a RUNNING site
 * and reports: status codes, H1 count, title/description presence + duplicates, canonical,
 * images without alt, and broken internal links.
 *   npm run build && npm start   (in another terminal)
 *   npm run seo:audit -- http://localhost:3000
 */
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const problems = [];
const titles = new Map();
const descs = new Map();
const linkTargets = new Set();

const get = async (u) => {
  const r = await fetch(u, { redirect: "manual" });
  return { status: r.status, text: r.status === 200 ? await r.text() : "", location: r.headers.get("location") };
};
const one = (re, s) => (s.match(re) || [])[1]?.trim();

const sm = await get(`${base}/sitemap.xml`);
if (sm.status !== 200) {
  console.error(`sitemap.xml returned ${sm.status}`);
  process.exit(1);
}
const urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base));
console.log(`Auditing ${urls.length} URLs from sitemap…`);

for (const url of urls) {
  const { status, text } = await get(url);
  const path = url.replace(base, "");
  if (status !== 200) { problems.push(`${path} → HTTP ${status}`); continue; }
  const h1 = (text.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) problems.push(`${path} → ${h1} <h1> tags`);
  const title = one(/<title>([^<]*)<\/title>/, text);
  const desc = one(/<meta name="description" content="([^"]*)"/, text);
  const canonical = one(/<link rel="canonical" href="([^"]*)"/, text);
  if (!title) problems.push(`${path} → missing <title>`);
  if (!desc) problems.push(`${path} → missing meta description`);
  if (!canonical) problems.push(`${path} → missing canonical`);
  if (title) titles.set(title, [...(titles.get(title) || []), path]);
  if (desc) descs.set(desc, [...(descs.get(desc) || []), path]);
  const noAlt = (text.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (noAlt) problems.push(`${path} → ${noAlt} <img> without alt`);
  for (const m of text.matchAll(/href="(\/[^"#?]*)/g)) linkTargets.add(m[1]);
}

for (const [t, ps] of titles) if (ps.length > 1) problems.push(`Duplicate title "${t}" on ${ps.join(", ")}`);
for (const [, ps] of descs) if (ps.length > 1) problems.push(`Duplicate description on ${ps.join(", ")}`);

console.log(`Checking ${linkTargets.size} internal link targets…`);
for (const p of linkTargets) {
  if (p.startsWith("/_next") || p.startsWith("/admin")) continue;
  const { status, location } = await get(`${base}${p}`);
  if (status >= 400) problems.push(`Broken internal link → ${p} (HTTP ${status})`);
  else if (status >= 300 && status < 400 && !/\/$/.test(p)) problems.push(`Internal link without trailing slash → ${p} (redirects to ${location})`);
}

for (const p of ["/robots.txt", "/sitemap.xml"]) {
  const { status } = await get(`${base}${p}`);
  if (status !== 200) problems.push(`${p} → HTTP ${status}`);
}

console.log(problems.length ? `\n${problems.length} problem(s):\n- ${problems.join("\n- ")}` : "\nNo problems found ✔");
process.exit(problems.length ? 1 : 0);
