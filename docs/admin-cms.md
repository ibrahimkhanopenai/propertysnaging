# Admin CMS

URL: `/admin/` (login at `/admin/login/`). Admin is `noindex` and blocked in robots.txt.

## Auth
- Users in `AdminUser` table, bcrypt (cost 12). First user from `npm run db:seed` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- Session: HS256 JWT in httpOnly cookie `pi_admin` (12h), secret `AUTH_SECRET` (≥32 chars).
- Checked twice: `middleware.ts` (edge) and `(panel)/layout.tsx` + every server action (`requireAdmin()`).
- Change password: update `ADMIN_PASSWORD` in `.env` and re-run `npm run db:seed` (upserts the hash).

## Screens
| Screen | Path |
|---|---|
| Dashboard | `/admin/` |
| Posts list / new / edit | `/admin/posts/`, `/admin/posts/new/`, `/admin/posts/{id}/` |
| Leads (quote form) | `/admin/leads/` |
| Redirects | `/admin/redirects/` |
| Reviews (genuine only) | `/admin/reviews/` |
| Gallery (upload, ALT required, feature on homepage) | `/admin/gallery/` |
| Images — replace site photos + ALT (EN/AR): homepage hero, About, location heroes, "Defects we find", sample report, location defect photos | `/admin/images/` |
| Developer logos — homepage logo strip (upload, name EN/AR, order, show/hide) | `/admin/developers/` |
| Locations — per emirate: communities + areas lists on the location pages | `/admin/locations/` |
| Settings — phone, WhatsApp, email, address, key figures, Google review + sample report links | `/admin/settings/` |

## Locations (`LocationItem`)
- Per emirate (location page key: `dubai`, `abudhabi`, `sharjah`, `ajman`, `rak`, `fujairah`, `uaq`) two lists:
  **Communities we inspect in {city}** (`COMMUNITY`: name EN/AR + developer) and **Areas we cover in {city}** (`AREA`: name EN/AR).
  On the page: local tips on top, then communities (left) + areas (right).
- Each row: show/hide, edit, delete. **Order = drag** the ⠿ handle (mouse or touch; or focus it and press ↑/↓); the order saves at once
  (`reorderLocationItemsAction`, sortOrder 1…n). New rows go to the end. Saving regenerates that location page (EN + AR) at once.
- Empty list: areas fall back to `content/locations.*.ts`; communities are hidden. The **Load defaults** buttons (and `npm run db:seed`) fill an
  empty list from `src/content/location-defaults.ts` — they never touch a list that already has rows.
- Arabic name is optional; the Arabic page uses the English name when it is empty.

## Images (`SiteImage`, one row per slot)
- Slots (key, default file from `site.ts`, default ALT from the dictionaries / content files): `src/lib/image-slots.ts`. 24 slots:
  `hero`, `about`, `location.{dubai…uaq}` (7), `scope.{hvac…roof}` (8, used by the homepage services list **and** "Real findings"),
  `report.{1-3}` (sample report collage, /sample-report/ examples; `report.1` is also the /sample-report/ hero and the /reviews/ thumbnail),
  `finding.{1-4}` (location pages, "From our recent reports" — captions stay in the dictionaries).
- Read on the site with `await siteImage(key, locale)` → `{ src, alt }` (`src/lib/site-images.ts`, React `cache`, defaults when MySQL is down).
  The About, Sample report and location pages also use the slot for their `og:image` (`pageMetadata`).
- Uploads go through `/api/admin/upload/` (→ `UPLOAD_DIR`, served by `/uploads/`). Only `/uploads/…` or `/images/…` paths are accepted.
- A field equal to its default stores nothing; a row with no fields is deleted. **Reset to default** deletes the row (the upload stays on disk).
- A new photo needs a new English ALT (the default ALT describes the old photo), so saving is refused until it changes. With no Arabic ALT,
  the Arabic page uses the English ALT for a replaced photo.
- Saving revalidates every page (`revalidatePath("/", "layout")`). The hero stays the only `priority` image on the homepage.
- Still code: logo, OG default image, credentials, gallery defaults. To add a slot: add it to `image-slots.ts` and read it with `siteImage()`.

## Developer logos (`DeveloperLogo`)
- Homepage strip (`DevelopersStrip`): published rows by order; Arabic uses `nameAr` when set (ALT = "{name} logo").
- No rows at all (or DB down) → the default `site.developers` list. **Load the default logos** copies it into the table to edit it.
  Deleting every row brings the defaults back; to hide the strip, untick "Show on site" on every logo.
- Logos sit in a fixed 128×48 box (`object-contain`), so uploads need no width/height. Upload white logos on a transparent PNG (dark band).

## Settings (`Setting`, key/value)
- Fields, defaults and validation: `src/lib/settings-fields.ts`. Read on the site with `await getSettings()` (`src/lib/settings.ts`).
- A key with no row uses its default from `src/lib/site.ts`; saving an empty value (or the default) deletes the row.
- Saving revalidates every page (`revalidatePath("/", "layout")`): header, top bar, footer, floating buttons, contact page, hero,
  final CTA, trust stats, location pages, reviews links, sample report button and the Organization JSON-LD.
- Not in Settings (still code): logo, social links, PDFs other than the sample report, the privacy-policy email sentence
  (`content/pages.*.ts`), price per sq ft (`PRICE_PER_SQFT` env).

## Blog post fields
**Content:** title (H1), slug (auto from title, editable), excerpt, Markdown content with preview, FAQ repeater, featured image (upload) + alt, category, tags, location, related service (end CTA), author, table of contents toggle, language (EN/AR), status (Draft/Published/Scheduled), publish date.

**SEO:** SEO title (30–60 counter), meta description (120–160 counter), live Google preview, focus keyword, secondary keywords, canonical URL, robots index/follow, schema type (BlogPosting/Article/HowTo), breadcrumb title, OG title/description/image. Live SEO checklist (keyword in title/description/slug/intro, H2 present, internal link, alt text, 600+ words).

## Behaviour
- Scheduled posts go live automatically once `publishedAt` passes (pages revalidate hourly).
- Changing the slug of a non-draft post auto-creates a 301 in `Redirect`.
- Slugs that clash with static pages are rejected.
- Saving revalidates the post, blog index, homepage and sitemap.
- Images upload to `UPLOAD_DIR` (default `./storage/uploads`, outside `/public`) and are served by `/uploads/...` — back this folder up.

## Content format
Markdown (`marked`, GFM). `##` = H2, `###` = H3. Admin input is trusted (not sanitised) — only give admin access to trusted staff.

## Post types
- **Blog article** (`POST`): listed in `/blog/`, BlogPosting schema, dates + reading time.
- **Developer page** (`DEVELOPER`): for Emaar, DAMAC, Sobha, Nakheel, Meraas, Danube, Ellington, Azizi, Binghatti, Aldar or a specific development. Same `/{slug}/` URL level, listed in `/snagging-by-developer/`, Service schema, breadcrumb "Snagging by developer". Publish only with genuine, useful content (handover process, common defects seen, how to submit snags) — client rule: no thin keyword pages.

## Blog drafts
`npm run blog:drafts` creates the 10 client topics as DRAFTS with SEO title/description, focus keyword and an H2 outline. Complete each article before publishing. "Property Snagging Checklist Dubai" overlaps the existing imported post — update that post instead.
