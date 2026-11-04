# 2026-11-04-005 — Trim location pages + add description to Admin → Locations items

**Agent/Author:** Claude Code
**Task:** Slim down every location page (Dubai, Abu Dhabi … UAQ) by removing several sections, and add an EN/AR **description** to each community and area in Admin → Locations that shows on the page.

## What changed

### Location pages trimmed (`src/components/pages/LocationPage.tsx`)
- **Removed the "What we usually find in {city}" defects block** and made **"Why snagging matters in {city}" full width** (heading + paragraphs flow in two columns on `md+` so it fills the row). The "From our recent reports" photo strip stays.
- **Removed the local-tips sections** ("Book around your handover date", "Apartments, townhouses and villas", and each other emirate's two tips).
- **Removed "Why choose Property Inspectors"** (`<WhyChoose/>`) and **"How our inspection process works"** (`<Process/>`) from location pages (they stay on the homepage).
- **Removed the "15,000+ Properties inspected" figure** from the Key Figures row — **location pages only** (`stats.filter(s => s.key !== "inspections")`); it is unchanged on the homepage and everywhere else. Grid is now 4-up.
- Removed content is **deleted outright** from the content files (no empty stubs), per request — it cannot reappear.

### Description on location items (Admin + front)
- **`prisma/schema.prisma`** `LocationItem`: new `description` + `descriptionAr` (`VARCHAR(400)`, nullable). Migration `20261104103919_location_item_description` (additive, no data loss).
- **Admin → Locations** (`src/app/admin/(panel)/locations/page.tsx`): a "Description (English)" + "Description (Arabic)" textarea on both the add form and each edit row, for **both** Communities and Areas.
- **`saveLocationItemAction`** (`src/app/admin/actions.ts`): stores both descriptions (trimmed, ≤400) for both kinds.
- **`getLocationItems`** (`src/lib/content-db.ts`): returns the localized description for communities and areas. `areas` changed from `string[]` to `{ name, description }[]`; Arabic picks `descriptionAr`, else falls back to `description`.
- **Front** (`LocationPage.tsx`): the description shows under each community (below the developer) and each area. **Areas are now a card list** (pin icon + name + description) matching Communities, instead of chips, so the descriptions have room.

### Shared `sections` field made optional (locations no longer have sections)
- **`src/content/types.ts`**: removed the now-unused `defects` field; `sections` is now `sections?: PageSection[]`.
- **`src/content/locations.{en,ar}.ts`**: removed `defects` and `sections` from all 7 emirates (both languages). `communities` kept (it is the areas fallback).
- **Page text (service pages keep sections; location pages don't):** `savePageTextAction` only parses/stores sections for `group === "service"`; `PageTextForm` hides the Sections fieldset when `isLocation`; `page-text.ts` + `ContentPage.tsx` guard the now-optional `sections`. This also prevents a regression where saving hook/intro on a location page would have failed on empty sections.

### Tests / docs
- `tests/unit/settings-locations.test.ts`: updated to the new `areas` shape and added description coverage (Arabic picks `descriptionAr`, falls back to `description`).
- `tests/unit/faqs-findings-page-text.test.ts`: the "default sections validate" check now skips pages without sections (location pages).
- `docs/admin-cms.md`: Locations + Page text entries updated (description fields; sections = service pages only; local tips removed).

## Files touched
- src/components/pages/LocationPage.tsx
- src/components/pages/ContentPage.tsx
- src/components/admin/PageTextForm.tsx
- src/content/types.ts
- src/content/locations.en.ts
- src/content/locations.ar.ts
- src/lib/content-db.ts
- src/lib/page-text.ts
- src/app/admin/actions.ts
- src/app/admin/(panel)/locations/page.tsx
- prisma/schema.prisma
- prisma/migrations/20261104103919_location_item_description/migration.sql (new)
- tests/unit/settings-locations.test.ts
- tests/unit/faqs-findings-page-text.test.ts
- docs/admin-cms.md

## Decisions & why
- **Bilingual description (EN + AR)** — consistent with the existing name fields; the Arabic (`/ar/`) pages show the Arabic text, falling back to English when `descriptionAr` is blank. (User choice.)
- **Areas rendered as a list, not chips** — chips have no room for a description; the list mirrors the Communities column so the two sides match. (User choice.)
- **Deleted content from the files, not hidden in the component** — the user asked that removed sections leave no leftover/"trash" and not come back.
- **`sections` scoped to service pages** rather than left editable-but-ignored on location pages — avoids a confusing dead editor *and* a save regression (empty sections would have errored on hook/intro saves).
- **Stat filtered by key** (`inspections`) so the homepage and admin-editable values are untouched; only the location Key Figures drop it.
- **URLs, `<title>`, meta descriptions, H1 unchanged** (AGENTS.md §5 SEO rules) — only on-page body content changed.

## Follow-ups / known issues
- Checks pass: `npm run typecheck`, `npm run lint`, `npm test` (**139/139**). `npm run build` not run this session.
- Existing `LocationItem` rows have `description`/`descriptionAr` = NULL until filled in Admin → Locations; the page simply omits the blurb line until then.
- `npm run db:deploy` (prisma migrate deploy) applies the new migration on the server.
