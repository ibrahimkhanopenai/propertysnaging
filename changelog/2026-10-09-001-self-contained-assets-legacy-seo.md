# 2026-10-09-001 — Repo independent of the old site: assets renamed, old SEO restored

**Agent/Author:** Claude Code
**Task:** The old site is shutting down. Take the content and assets we actually use one time, commit them to git (not gitignored), drop every dependency on the old site and every WordPress name from the repo, use Next.js/SEO-standard file names, and bring back the old SEO. Blog posts will be re-added by hand in Admin.

## What changed
- **Assets in git:** the 45 images/PDFs the site uses moved from `public/wp-content/uploads/YYYY/MM/...` (gitignored) to `public/images/<section>/` and `public/downloads/` with lowercase-hyphen names, e.g. `/images/scope/hvac.jpg`, `/downloads/property-inspectors-company-profile.pdf`. The 18 unused files were deleted. Images were not re-compressed (the client will replace them by hand).
- **Favicon:** now `src/app/icon.jpg` + `src/app/apple-icon.jpg` (Next.js file convention). The manual `icons` entry was removed from the locale layout.
- **301s:** `src/lib/legacy-redirects.ts` (65 entries, loaded by `next.config.ts`) sends every old asset URL we use, its full-size original and the old logo to the new file. Unused old asset URLs return 404.
- **Cache:** `/images/*` and `/downloads/*` are cached for 1 day + stale-while-revalidate (not immutable), because files are replaced in place.
- **Old SEO restored:** homepage title/description, plus the Dubai/Abu Dhabi/Sharjah title/description, are now exactly the old values. New `PageContent.metaTitleAbsolute` drops the brand suffix for those three pages.
- **SEO snapshot:** `docs/legacy-seo.json` holds the old title, description, canonical, robots and OG image of all 16 pages and 5 posts, plus the old alt text of the images we use. `docs/seo-migration.md` has a copy-paste table (slug/title/description) for re-adding the 5 blog posts in Admin.
- **Removed:** `scripts/download-wp-assets.mjs`, `scripts/export-wp-seo.mjs`, `scripts/import-wordpress.ts`, npm scripts `assets:download`, `wp:import`, `wp:seo-export`, packages `turndown` and `@types/turndown`, `WP_SOURCE_URL`, and the `public/wp-content/` gitignore line. WordPress names were removed from code comments, the admin UI, tests, docs and the `blog:drafts` note. Old `/wp-content/...` strings remain only as old-URL data in `legacy-redirects.ts`, `legacy-seo.json` and the docs.
- **Tests:** new `tests/unit/assets.test.ts` checks that every `site.ts` asset exists with a lowercase-hyphen name, and that every redirect is a 301 to an existing file with unique sources and covers the PDFs.
- **Local DB (not in git):** the 10 seeded `GalleryImage` rows were updated to the new paths. `prisma/seed.ts` uses the new paths for fresh installs.

## Files touched
- public/images/{about,brand,credentials,developers,gallery,locations,reports,scope}/*, public/downloads/* (new); src/app/icon.jpg, src/app/apple-icon.jpg (new)
- src/lib/legacy-redirects.ts (new), next.config.ts, src/lib/site.ts, src/middleware.ts
- src/app/[locale]/layout.tsx, src/components/pages/pageMetadata.ts, src/content/types.ts, src/content/locations.{en,ar}.ts, src/i18n/dictionaries/en.ts
- src/app/admin/actions.ts, src/app/admin/(panel)/posts/page.tsx, src/components/admin/PostForm.tsx, src/lib/{markdown,routes}.ts, src/i18n/config.ts, src/content/pages.en.ts, src/app/[locale]/[...slug]/page.tsx, prisma/{schema.prisma,seed.ts}
- scripts/{download-wp-assets.mjs,export-wp-seo.mjs,import-wordpress.ts} (deleted), package.json, package-lock.json, .env.example, .gitignore
- tests/unit/assets.test.ts (new), tests/unit/{seo,markdown}.test.ts, tests/unit/__snapshots__/seo.test.ts.snap
- docs/legacy-seo.json (new), docs/{seo-migration,assumptions-and-todo,architecture,deployment-local,qa-checklist,client-requirements}.md, AGENTS.md (rules 6 + 10, commands, folder map), README.md

## Decisions & why
- **Rename + 301 instead of keeping `/wp-content/` paths:** the client wants no WordPress naming. A per-file 301 keeps Google Images rankings and PDF backlinks. This replaces the old AGENTS.md rule #10.
- **Old homepage title brought back** (client decision, 2026-10-09). This reverses the title change in 2026-10-02-002.
- **Only pages with real old SEO** (homepage + 3 locations) got their old meta back. The other 12 old pages had no custom title/description (e.g. "About Us - "), so the new copy stays.
- **Old alt texts not reused:** on the old site they were just file names ("Damac", "Roof_1"), weaker than the current descriptive alt text. They are kept in the snapshot for reference.
- **GTM ID** `GTM-N2BF4B58` is documented in `.env.example` but left empty, so local dev visits are not tracked. Set it in the production `.env`.
- The ` -` at the end of one old blog title (Yoast with an empty site name) was dropped in the copy-paste table.

## Follow-ups / known issues
- **Dubai location photo missing:** `Dubai-Image-for-Blog-Landscape.png` already returned 404 on the old site, so `/snagging-services-in-dubai/` has no hero image until one is added (`site.images.locations.dubai` + `content/locations.*.ts`).
- **About photo** `/images/about/property-handover.jpg` is an Unsplash+ premium image with a visible watermark. Replace it.
- Re-add the 5 blog posts in Admin (table in `docs/seo-migration.md`). The local DB still holds the earlier imported copies; 4 of them point to old featured images that were never downloaded.
- **Existing bug, not changed here:** `LanguageSwitch` renders `/ar/en/...` links on English pages (`usePathname()` returns the internal `/en/...` path during static render). `seo:audit` reports 45 broken links from it. The imported blog posts also have several `<h1>` tags each.
