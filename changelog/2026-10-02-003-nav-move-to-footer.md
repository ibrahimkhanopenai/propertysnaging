# 2026-10-02-003 — Move Reviews, Sample Report, FAQs from header to footer

**Agent/Author:** Claude Code
**Task:** Remove Reviews, Sample Report and FAQ from the header menu and keep them in the footer.

## What changed
- Removed Sample Report, Reviews and FAQs from the header nav (desktop + mobile menu both use `getNav()`).
- Footer already linked all three (Company: Reviews, FAQs; Resources: Sample Report), so no footer change was needed.
- Updated client-requirements map item 13.

## Files touched
- src/components/layout/nav.ts
- docs/client-requirements.md

## Decisions & why
- URLs unchanged; pages remain linked from the footer, homepage sections and sitemap, so no SEO/internal-link loss.

## Follow-ups / known issues
- None.
