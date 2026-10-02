# 2026-10-02-002 — Client website report applied to the Next.js build

**Agent/Author:** Claude (claude.ai)
**Task:** Implement the client's website report (written for the old WordPress site) in the new Next.js project.

## What changed
- Homepage rebuilt in the client's 12-section order with the new H1, supporting statement, 3 CTAs and visible phone; trust section right after hero.
- 10-second callback pop-up (Name/Phone/Submit, small X); floating Call + WhatsApp on all pages.
- 14 new service pages + 4 new emirate pages, all with unique EN/AR copy, "What's included", FAQs, related-services and other-emirates internal links.
- New pages: `/reviews/` (reference design), `/faqs/`, `/contact-us/`, `/gallery/`, `/snagging-by-developer/`; `/sample-report/` and `/about-us/` reworked; `/scope-of-work/` = 8-category "What we inspect".
- Navigation changed to the client list (Services mega-menu, Locations dropdown).
- Purple accent tokens (pictures + forms only).
- Quote form: "Location / community" field, "Get my quote", purple styling, lead source.
- Conversion tracking: `generate_lead`, `click_call`, `click_whatsapp` (dataLayer + gtag).
- DB: `PostType` (POST/DEVELOPER), `Review`, `GalleryImage`, `Lead.location`/`source`, nullable `propertyType`. Admin: Reviews, Gallery (upload, ALT required), post type selector, lead source/location columns. Gallery seeded with real site photos.
- Scripts: `blog:drafts` (10 client topics as drafts), `seo:audit` (pre-launch crawl).
- Docs: `client-requirements.md`, `tracking.md`, `qa-checklist.md`; updated AGENTS.md, design-system, seo-migration, admin-cms, forms, assumptions.

## Files touched
src/lib/{routes,site,track,content-db,posts,schema}.ts, src/content/*, src/i18n/dictionaries/*, src/components/{home,layout,forms,pages,admin,analytics,ui}/*, src/app/[locale]/* (19 new page folders), src/app/admin/*, src/app/api/leads, prisma/{schema.prisma,seed.ts}, scripts/*, docs/*, AGENTS.md, package.json

## Decisions & why
- Homepage `<title>` changed (was the WordPress title) because the client explicitly repositions the homepage on "property snagging & inspection Dubai & UAE".
- "Property Snagging Dubai" (listed twice in the report) = existing `/snagging-services-in-dubai/` to keep its rankings and avoid duplicate pages. New emirates follow the same URL pattern.
- Developer pages are CMS-driven and unpublished by default — no fabricated developer facts, no thin pages.
- Blog topics created as drafts, not published thin content.
- Pop-up is once-per-session and a bottom sheet on mobile to limit SEO risk from intrusive interstitials.
- Old components removed: Personas, TrustStrip, Stats, Scope, HowItWorks, Locations, ReportAndQuote, Reviews, LatestPosts, StickyContact.

## Follow-ups / known issues
- Run `npm run db:migrate` (schema changed) then `npm run db:seed`.
- Domain question (.ae vs .me) — see docs/client-requirements.md.
- DUMMY stats / Google link / reviews must be replaced with genuine data before launch.
- Still not built/tested in this environment: run `npm install && npm run typecheck && npm run build`.
