# 2026-10-02-001 — Initial Next.js build (WordPress migration)

**Agent/Author:** Claude (claude.ai)
**Task:** Rebuild propertyinspectors.me in Next.js with all legacy URLs, SEO parity, blog CMS with SEO fields, EN/AR, MySQL.

## What changed
- New Next.js 15 + TypeScript + Tailwind v4 project, MySQL via Prisma.
- Homepage built from the client-approved black & white design (sections in `docs/design-system.md`).
- All 15 legacy WordPress pages recreated at identical URLs (+ privacy, terms) using `ContentPage`.
- Blog: index + root-level post URLs, Markdown, TOC, FAQ schema, related-service CTA, DB redirects.
- Custom admin: login, dashboard, posts editor with full SEO panel & checklist, image upload, leads, redirects.
- Quote form: live price (PRICE_PER_BEDROOM), opens WhatsApp + saves lead + background SMTP email.
- Arabic version under `/ar/` (RTL, hreflang, Arabic font).
- SEO: metadata helper (canonical/hreflang/OG), JSON-LD (ProfessionalService, WebSite, Service, FAQPage, BreadcrumbList, BlogPosting), sitemap.xml, robots.txt, WordPress 301s.
- Migration scripts: assets download (same paths), WordPress post import, Yoast SEO export.
- Docs: AGENTS.md, CLAUDE.md, docs/*, changelog.

## Files touched
Entire repo (initial commit).

## Decisions & why
- **No Payload CMS:** client requires MySQL; Payload supports only MongoDB/Postgres/SQLite.
- **Markdown editor** instead of WYSIWYG: zero extra client JS, clean HTML output, easy WordPress import via turndown.
- **EN without prefix** via middleware rewrite to keep every WordPress URL unchanged.
- **Logo as text+icon** to avoid an image request; swap for official SVG.
- **No review schema** while reviews are placeholders (Google policy).

## Follow-ups / known issues
- Code was written without running `npm install`/`next build` (no network in the build environment). First run: `npm install && npm run typecheck && npm run build`, fix anything reported, log it here as 002.
- Replace DUMMY data (`docs/assumptions-and-todo.md`).
- Native Arabic review.
