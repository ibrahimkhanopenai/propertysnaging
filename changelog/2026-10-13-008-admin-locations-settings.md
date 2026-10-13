# 2026-10-13-008 — Admin phase 1: Locations (communities + areas) and Settings

**Agent/Author:** Claude Code
**Task:** Client: manage content from the admin. Phase 1 = (a) each location page gets a "communities / projects" list to the left of "Areas we cover in {city}", with both lists managed in the admin and seeded with UAE projects for now; (b) a Settings screen for contact details, key figures and links. Arabic name fields included.

## What changed
- **DB** (migration `20261013070205_location_items_settings`): `LocationItem` (emirate, kind AREA|COMMUNITY, name, nameAr, developer, published, sortOrder) and `Setting` (key/value).
- **Admin → Locations** (`/admin/locations/`): a tab per emirate, with two columns: *Communities we inspect in {city}* and *Areas we cover in {city}*.
  - Add a row: EN name, AR name, developer (communities only), order, show on site. Each row has its own Save / Delete form.
  - An empty list shows a **Load defaults** button that fills it from `src/content/location-defaults.ts`. This works on production without running the seed.
  - Actions: `saveLocationItemAction`, `deleteLocationItemAction`, `loadLocationDefaultsAction`. Each regenerates that location page (EN + AR).
- **Location pages** (`LocationPage.tsx`, now async):
  - The "local tips" sections sit in a 2-column row on top.
  - Below: **Communities** card (left; building icon, name, developer) + **Areas** card (right; chips + note). The area chips are unchanged.
  - Data comes from `getLocationItems()` (`content-db.ts`): published rows only; the Arabic page uses the Arabic name when set.
  - If an emirate has no area rows, or the DB is down, the areas come from `content/locations.*.ts`. Communities are hidden when there are none.
  - The 7 location routes got `revalidate = 3600` as a safety net.
- **Seed** (`npm run db:seed`): fills only empty lists. Areas = the current content lists (EN + AR). Communities = suggested well-known developments: Dubai 8, Abu Dhabi 4, Sharjah 4, Ajman 2, RAK 3, UAQ 1, Fujairah none. Run locally: 59 areas + 22 communities.
- **Admin → Settings** (`/admin/settings/`, client form with validation):
  - Fields: phone (tel), phone as displayed, WhatsApp number, email, office street/area/city, Google Maps link, opening hours (schema), the 5 key figures, Google reviews link, sample report link (a Google Drive view-only link or a site path).
  - Fields, defaults (from `site.ts`) and validation live in `src/lib/settings-fields.ts`. An empty value, or one equal to the default, stores no row, so the default applies.
  - Saving runs `revalidatePath("/", "layout")`.
- **Site reads settings** through `getSettings()` (`src/lib/settings.ts`: React `cache`, falls back to the defaults if MySQL is down) and `waLink(cfg, text)`. Converted to async server components: TopBar, Header, Footer, FloatingContact, Hero, CtaBand, FinalCta, TrustSection, ReviewsMarquee, SampleReportSection, ContentPage, LocationPage, the locale layout (LeadPopup number + Organization JSON-LD), and the contact, reviews and sample-report pages. `organizationSchema(cfg)` takes the contact details (default `site`).
- Admin sidebar: **Locations** and **Settings** links.
- Dictionaries (EN + AR): `pageUi.communitiesIn` ("Communities we inspect in {city}" / "مجتمعات نفحصها في {city}"), `pageUi.communitiesNote`.
- Tests: `tests/unit/settings-locations.test.ts` (8): defaults/overrides/blank handling, validation per field type (incl. `javascript:` rejected), wa.me link, location rows (published only, Arabic names), fallbacks (no rows / DB down), default lists complete with Arabic names. Results: 95 tests, typecheck and lint pass. All pages return 200 on the dev server, which still has the old Prisma client loaded, so the fallbacks were exercised.
- **End-to-end on the dev server (headless Edge, logged in; test data removed afterwards):**
  - Settings: changed "Properties inspected" → "Saved" → homepage shows the new value; cleared the field → back to the default; an invalid WhatsApp number shows the validation error and saves nothing.
  - Locations: added a community → it appears on the Dubai page; deleted it → gone.
  - Screenshots: Dubai location section in EN + AR (communities left/right mirrored), admin Locations and Settings.
  - Admin fixes from the screenshots: the Order column in Locations narrowed to 5rem (names were cut off); long default values in Settings help text wrap (`break-all`).
- Docs: admin-cms (screens, Locations, Settings), assumptions-and-todo (stats now in Settings).

## Files touched
- prisma/schema.prisma, prisma/migrations/20261013070205_location_items_settings/, prisma/seed.ts
- src/lib/{settings(new),settings-fields(new),content-db,schema}.ts, src/content/location-defaults.ts (new)
- src/app/admin/actions.ts, src/app/admin/(panel)/{layout.tsx,locations/page.tsx(new),settings/page.tsx(new)}, src/components/admin/SettingsForm.tsx (new)
- src/components/pages/{LocationPage,ContentPage}.tsx, src/components/layout/{TopBar,Header,Footer,FloatingContact}.tsx, src/components/home/{Hero,CtaBand,FinalCta,TrustSection,ReviewsMarquee,SampleReportSection}.tsx
- src/app/[locale]/{layout.tsx,contact-us/page.tsx,reviews/page.tsx,sample-report/page.tsx,snagging-services-in-*/page.tsx}
- src/i18n/dictionaries/{en,ar}.ts, tests/unit/settings-locations.test.ts (new), docs/{admin-cms,assumptions-and-todo}.md

## Decisions & why
- **Heading "Communities we inspect in {city}"**, not "our current projects". The seeded names are real developments, but they are not confirmed jobs (client rule: genuine claims only). Once real projects are in the admin, the heading can change in the dictionaries.
- **Key/value settings with code defaults:** no data migration needed, a fresh DB works as before, and "empty = default" lets the client undo a change.
- **Area fallback stays:** with no rows the page looks exactly as before, so deploying before seeding is safe.
- Location URLs, titles and meta are untouched.

## Follow-ups / known issues
- **Restart the dev server** to load the new Prisma client. `prisma generate` could not replace the engine DLL while the server was running (Windows file lock); the JS client and types were generated.
- **Production:** the deploy workflow runs `npm run db:deploy`, which creates the tables. Then either run `npm run db:seed` on the server, or use the **Load defaults** buttons in Admin → Locations.
- The privacy-policy sentence with the email (`content/pages.*.ts`) still uses `site.email`.
- Phase 2 (images, developer logos) and phase 3 (FAQs, findings, page text) are not started. The plan is in `docs/assumptions-and-todo.md` → "Admin roadmap".
