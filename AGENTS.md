# AGENTS.md — Property Inspectors (propertyinspectors.me)

> **Never run `git add` or `git commit`, even if requested.** Staging and committing are user-only actions. Leave changes unstaged and uncommitted, ready for the user's review.

**Read this file first.** It is the single source of truth for any AI agent or developer working on this repo.
Tool-specific files (e.g. `CLAUDE.md`) only point here.

## 1. What this project is
Marketing website + blog CMS for **Property Inspectors**, a UAE property **snagging** company (inspects new/resale
properties for defects before handover). It is NOT a real-estate agency site — copy and imagery must stay about
inspections, defects, handovers and reports.

Rebuilt from an old CMS site that is being shut down — nothing is fetched from it; its SEO snapshot is `docs/legacy-seo.json`.
**Existing URLs rank on Google and must never change.**

**Client requirements:** `docs/client-requirements.md` maps every item of the client's website report to the code. Read it before changing any page, the homepage order, colours, forms or navigation.

## 2. Stack
| Area | Choice |
|---|---|
| Framework | Next.js 15 App Router, React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 (tokens in `src/app/globals.css` `@theme`) |
| Database | MySQL 8 via Prisma 6 (`prisma/schema.prisma`) |
| Admin/CMS | Custom, in `src/app/admin` (JWT cookie auth via `jose`, bcrypt passwords) |
| Email | SMTP via Nodemailer (`src/lib/mail.ts`), sent in the background with `after()` |
| i18n | English (no prefix) + Arabic (`/ar/`, RTL) — `src/i18n` |
| Hosting | Self-hosted Node (`npm run build && npm start`) — see `docs/deployment-local.md` |

## 3. Commands
```bash
npm install
npm run db:migrate      # create/update MySQL tables (dev)
npm run db:seed         # first admin user + categories (reads ADMIN_EMAIL/ADMIN_PASSWORD)
npm run blog:drafts     # create the 10 client blog topics as DRAFT outlines
npm run seo:audit -- http://localhost:3000   # pre-launch QA crawl (H1, titles, canonicals, broken links)
npm run dev | build | start | lint | typecheck
```

## 4. Folder map
```
src/
  middleware.ts            admin auth + i18n rewrite (EN → /en internally, /en/* → 301)
  app/
    [locale]/              PUBLIC SITE (root layout per locale: html lang/dir, fonts, header/footer)
      page.tsx             Homepage (primary focus)
      <slug>/page.tsx      One folder per legacy page (thin: calls ContentPage)
      blog/page.tsx        Blog index
      [...slug]/page.tsx   Blog post at ROOT (/{slug}/) → else DB redirect → else 404
    admin/                 CMS (own root layout, noindex)
      actions.ts           ALL server actions (auth, posts, redirects, leads)
    api/leads/             Quote form endpoint (MySQL + background email)
    api/admin/upload/      Admin image upload → UPLOAD_DIR
    uploads/[...path]/     Serves uploaded images
    sitemap.ts, robots.ts
  components/{layout,ui,seo,home,forms,pages,blog,admin}
  content/services.*.ts   15 service pages (each written uniquely)
  content/locations.*.ts  7 emirate pages (location-specific)
  content/pages.*.ts      about, scope, partners, downloads, legal
  i18n/dictionaries/en.ts|ar.ts     UI + homepage copy (ar must match en shape)
  lib/                     site config, seo, schema (JSON-LD), routes registry, legacy-redirects, db, auth, mail, posts, markdown
public/images/<section>/   site images (brand, developers, gallery, scope, locations…) · public/downloads/ = PDFs
docs/                      Detailed docs (see §9)
changelog/                 One file per completed task (see §8)
```

## 5. NON-NEGOTIABLE SEO rules
1. **Never change or remove a public URL.** All legacy paths live in `src/lib/routes.ts`. Need a new URL? Add it; if an old one must go, add a 301 (in `next.config.ts` for static, Admin → Redirects for content).
2. `trailingSlash: true` stays. Every internal link ends with `/`.
3. Blog posts are served at the **root** (`/{slug}/`), not `/blog/{slug}/` — this matches the old site.
4. English URLs have **no** locale prefix. Arabic = `/ar/...`. Never expose `/en/...`.
5. Every page sets metadata through `buildMetadata()` (`src/lib/seo.ts`) → canonical + hreflang + OG.
6. Homepage and Dubai/Abu Dhabi/Sharjah `<title>`/description stay identical to the old site (`en.ts → meta`, `locations.en.ts`) unless an SEO review says otherwise.
7. Structured data only through `src/lib/schema.ts`. **No Review/AggregateRating schema** while `site.reviews.isPlaceholder` is true.
8. One `<h1>` per page. Section headings are `<h2>`.
9. Images: `next/image` with real `alt`, `sizes`; only the hero is `priority`.
10. Images live in `public/images/<section>/`, PDFs in `public/downloads/` (lowercase-hyphen names, paths only in `site.ts`). Old asset URLs are indexed and linked: every one we use 301s via `src/lib/legacy-redirects.ts` — never delete an entry; update it if a file is renamed. Replace an image by overwriting the same file name.

## 6. Coding conventions
- Server Components by default; `"use client"` only for interactivity (QuoteForm, MobileMenu, LanguageSwitch, admin forms).
- No new UI/icon libraries — use `components/ui` (`Icon` has inline SVGs). Keep JS small for speed.
- All copy in `content/` or `i18n/dictionaries/` — no hard-coded strings in components (admin excepted, English only).
- Business data (phone, address, PDFs, images, stats) only in `src/lib/site.ts`.
- DB reads for public pages go through `src/lib/posts.ts` (wrapped in try/catch so pages render without DB).
- Admin mutations = server actions in `src/app/admin/actions.ts`, each starting with `requireAdmin()`.
- Use logical CSS (`ms-`, `pe-`, `start-`, `text-start`) so Arabic RTL works. Flip arrows with `rtl:rotate-180`.
- Design tokens: `ink #0A0A0A`, `paper #FFF`, `mist #F5F5F4`, `line #E4E4E7`, `muted #52525B`, `wa #15803D` (WhatsApp only), `snag #B91C1C` (errors/defects only), `brand #6D28D9` (**purple: pictures + forms ONLY**). White ≈70%, grey ≈18%, black ≈12%. See `docs/design-system.md`.
- Content rules from the client: genuine stats/reviews/photos only; every service & location page has unique copy (no keyword-swapped clones); descriptive ALT text without keyword stuffing; no thin developer pages.
- Every new tel:/WhatsApp link is tracked automatically (`TrackClicks`); forms must call `track("generate_lead", …)` on success.

## 7. Adding things (recipes)
- **New service / location page:** add route to `src/lib/routes.ts` (group `service`/`location`) → unique copy in `content/services.*.ts` or `content/locations.*.ts` (both languages) → create `src/app/[locale]/<path>/page.tsx` (copy any service page). It appears in sitemap automatically; add it to `nav.ts` groups / `locationOrder` and to other pages' `related` lists.
- **Other static page:** same, with copy in `content/pages.*.ts`.
- **New homepage section:** component in `components/home/`, copy in both dictionaries, add to `app/[locale]/page.tsx`.
- **New DB field:** edit `prisma/schema.prisma` → `npm run db:migrate` → update `actions.ts` + `PostForm.tsx`.
- **Blog post:** use `/admin/posts/new/` (not code).

## 8. CHANGELOG RULE (mandatory)
After finishing ANY task, create `changelog/YYYY-MM-DD-NNN-short-title.md` using `changelog/_TEMPLATE.md`:
what changed, files touched, decisions, follow-ups. Read the latest 3 changelog files before starting work.

## 9. Docs index
| File | Read when |
|---|---|
| `docs/architecture.md` | Understanding routing, rendering, i18n, data flow |
| `docs/seo-migration.md` | Touching URLs, redirects, metadata, sitemap, launch |
| `docs/design-system.md` | Any UI work |
| `docs/admin-cms.md` | Blog/admin/auth/DB work |
| `docs/forms-and-leads.md` | Quote form, WhatsApp, SMTP |
| `docs/i18n.md` | Arabic / translations |
| `docs/deployment-local.md` | Install, build, run, MySQL setup |
| `docs/assumptions-and-todo.md` | DUMMY data to replace + open tasks before launch |
| `docs/client-requirements.md` | Client report → implementation map (rules to keep) |
| `docs/tracking.md` | GA4/GTM, conversion events |
| `docs/qa-checklist.md` | Pre-launch QA (client §17) |
