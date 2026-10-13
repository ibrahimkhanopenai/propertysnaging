# 2026-10-13-009 — Admin phase 2: Images and Developer logos

**Agent/Author:** Claude Code
**Task:** Start phase 2 of the admin roadmap (`docs/assumptions-and-todo.md`): Admin → Images (replace site photos + ALT EN/AR) and Admin → Developer logos (homepage logo strip).

## What changed
- **DB** (migration `20261013081159_admin_images_developers`):
  - `SiteImage`: key, url, alt, altAr. One row per changed slot; an empty field means the default.
  - `DeveloperLogo`: name, nameAr, logo, published, sortOrder.
- **Image slots** (`src/lib/image-slots.ts`): 24 replaceable photos. Each slot has a default file (from `site.ts`) and a default ALT (from the dictionaries or content files).
  - Homepage: hero, About.
  - The 7 location heroes.
  - 8 "Defects we find" photos (`scope.*`): homepage services list + "Real findings".
  - Sample report pages 1–3.
  - The 4 "From our recent reports" photos on location pages.
- **Site reads** (`src/lib/site-images.ts`): `siteImage(key, locale)` returns `{ src, alt }` (React `cache`, one query per render, defaults if MySQL is down). `getDeveloperLogos(locale)` returns the published logos, or `site.developers` when the table is empty or MySQL is down.
  - Switched to the slots: Hero, AboutSection, ServicesGrid, Findings, SampleReportSection, LocationPage (hero + defect photos), ContentPage (About / Sample report hero), the /sample-report/ examples, the /reviews/ thumbnail.
  - `pageMetadata` is now async, so the `og:image` of About, Sample report and the location pages follows a replaced hero.
  - The hero is still the only `priority` image on the homepage.
- **Admin → Images** (`/admin/images/`): photos grouped by section. Each card has a preview, Upload/Replace (existing `/api/admin/upload/`), English ALT (required), Arabic ALT, Save, and a "Changed/Default" badge with **Reset to default**.
  - A replaced photo cannot be saved with the old default ALT; a red hint and a server error explain why.
  - With no Arabic ALT, the Arabic page uses the English ALT (the default Arabic ALT describes the old photo).
  - Fields are controlled (`ImageSlotForm`), so a validation error keeps the upload and typed text.
- **Admin → Developer logos** (`/admin/developers/`): add a logo (upload, required), name EN/AR, order, show on site. Each row can be edited, hidden or deleted. An empty table shows **Load the default logos**, which copies the 9 current logos into the table.
- **DevelopersStrip**: logos sit in a fixed 128×48 `fill` + `object-contain` box (same limits as before), so uploads need no width/height. `site.developers` dropped its width/height. The strip is hidden when every logo is hidden. The section has `id="developers"` for the admin "View the homepage" link.
- `ImageUpload` (admin, client): a reusable picker. Uncontrolled inside server-action forms (follows the form reset after save) or controlled.
- Actions (`actions.ts`): `saveSiteImageAction` (save + `intent=reset`), `saveDeveloperAction`, `deleteDeveloperAction`, `loadDefaultDevelopersAction`. All start with `requireAdmin()`.
  - Image paths must be `/uploads/…` or `/images/…` (`isImagePath`, which rejects `..`, external URLs and SVG).
  - Image saves revalidate every page; logo saves revalidate the homepage (EN + AR).
- Admin sidebar: **Images**, **Developer logos**.
- **Tests:** `tests/unit/images-developers.test.ts` (12).
  - Every `site.images` photo has a slot with EN + AR ALT.
  - Page → slot mapping and path validation.
  - ALT/photo resolution: default, replaced, ALT-only, Arabic fallback.
  - Form values; DB reads and the DB-down fallback.
  - Logos: published only, Arabic names, all hidden → empty, no rows → defaults.
  - Results: 107 tests, typecheck and lint pass.
- **End-to-end on the dev server** (headless Edge, logged in; 18/18 checks; test rows and uploads removed afterwards).
  - Upload a new About photo. Saving with the old ALT is refused and the upload is kept.
  - Save with a new ALT. The homepage (EN + AR), the /about-us/ hero and `og:image` all update, and `/_next/image` serves the upload.
  - Change only the Sharjah hero ALT: the photo stays the same.
  - Reset both: the defaults are back.
  - Logos: load the defaults (9), hide Atlantis, add a test logo at order 0. The homepage hides Atlantis, shows the new logo first, and the Arabic page uses the Arabic name. The add form clears after adding.
  - Screenshots checked: Admin Images, Admin Developer logos, homepage strip.
  - With nothing saved, the public pages output the same files and ALT text as before.
- Docs: `admin-cms.md` (Images, Developer logos), `assumptions-and-todo.md` (phase 2 ticked, photo tasks point to Admin → Images), AGENTS.md §5.10 (slot photos are read with `siteImage()`).

## Files touched
- prisma/schema.prisma, prisma/migrations/20261013081159_admin_images_developers/
- src/lib/{image-slots(new),site-images(new),site}.ts
- src/app/admin/actions.ts, src/app/admin/(panel)/{layout.tsx,images/page.tsx(new),developers/page.tsx(new)}
- src/components/admin/{ImageUpload,ImageSlotForm}.tsx (new)
- src/components/home/{Hero,AboutSection,ServicesGrid,Findings,SampleReportSection,DevelopersStrip}.tsx
- src/components/pages/{LocationPage,ContentPage}.tsx, src/components/pages/pageMetadata.ts
- src/app/[locale]/{page.tsx,sample-report/page.tsx,reviews/page.tsx}
- tests/unit/images-developers.test.ts (new), AGENTS.md, docs/{admin-cms,assumptions-and-todo}.md

## Decisions & why
- **Fixed slots, not a free media library:** the client replaces specific photos. Layout, aspect ratios and the `priority` hero stay in code.
- **Defaults stay in code:** a fresh or unreachable DB renders exactly as before, so deploying before anyone uses the screens is safe. Reset brings back the original.
- **English ALT required for a new photo:** client rule (descriptive ALT on every image). An English ALT on the Arabic page is better than an Arabic one describing a different photo.
- **`scope.*` is one slot per photo**, used by both the services list and "Real findings" (they already shared the files). Splitting them can come with phase 3 ("Defects we find" items with their own photos).
- **Developer logos without dimensions:** a fixed contain box avoids an image-size parser or client-side measuring.
- **Deleting every logo brings the defaults back** (same as the Phase 1 area lists). Hiding is done with "Show on site"; the admin says so.
- No seed step for logos: the empty-table fallback already shows the defaults, and the Load button works on production.

## Follow-ups / known issues
- **Dev server:** restarted during this task (with the user's OK) to load the new Prisma client. It now runs as a background task of this session; restart it from your own terminal if you prefer.
- **Production:** the deploy workflow's `npm run db:deploy` creates the two tables. Nothing else is needed.
- Replaced uploads stay in `UPLOAD_DIR` after a reset or replace (no automatic delete, same as the Gallery).
- Captions of the "From our recent reports" photos and the "Real findings" texts are still in the dictionaries (phase 3).
- The developer strip wording question ("logos imply inspections, not a partnership") is still open in `assumptions-and-todo.md`.
