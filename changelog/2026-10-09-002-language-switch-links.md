# 2026-10-09-002 — Language switch: no more /ar/en/ links

**Agent/Author:** Claude Code
**Task:** Fix the language switch, which linked English pages to `/ar/en/...` (404). Found by `seo:audit` in 2026-10-09-001.

## What changed
- New `switchLocalePath()` in `src/i18n/config.ts`. It strips any `/en` or `/ar` prefix before building the other-language URL. English pages are rewritten to `/en/...` internally, and `usePathname()` returned that path during the static render, which produced `/ar/en/about-us/`.
- `LanguageSwitch.tsx` now uses that function.
- Blog/developer posts that exist in only one language: `/ar/{slug}/` (or `/{slug}/`) now 307-redirects to that language's listing (`/ar/blog/`, or `/ar/snagging-by-developer/` for developer pages) instead of returning 404. Real unknown paths still return 404.
- Tests for `switchLocalePath` (internal `/en` path, Arabic → English, slugs that merely start with "en"/"ar").

## Files touched
- src/i18n/config.ts, src/components/layout/LanguageSwitch.tsx, src/app/[locale]/[...slug]/page.tsx, tests/unit/seo.test.ts

## Decisions & why
- The fix is in a pure function, so it is unit-tested and works the same on the server and the client (no hydration mismatch).
- The fallback redirect is temporary (307), not 301: the Arabic version may be written later, and these URLs are not in the sitemap or in hreflang (posts use `hasAlternates: false`).

## Follow-ups / known issues
- `seo:audit` went from 49 problems to 4. All 4 come from the content of the old imported posts in the local DB (several `<h1>` tags, two links without a trailing slash). They disappear when the posts are re-added in Admin (Markdown `##` headings, links ending in `/`).
