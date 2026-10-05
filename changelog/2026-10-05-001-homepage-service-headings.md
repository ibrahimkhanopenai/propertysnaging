# 2026-10-05-001 — Homepage services section: client's 8 headings

**Agent/Author:** Claude Code
**Task:** Replace the 8 rows in the homepage "Our property inspection services" section with the client's list, in their order, EN + AR. No new pages.

## What changed
- Rows are now: Pre-handover snagging, Handover de-snagging, Resale / secondary properties, Rental properties, Commercial unit snagging (warehouse, building, office, shops), Renovated unit inspection, Roof waterproofing, Leakage inspections.
- Titles and one-line texts now come from the dictionary (`home.services.items`), not from the service pages' `navLabel`/`summary`. Short texts written by us (EN), translated to AR.
- Links: rows with a matching existing page link to it (pre-handover → `/pre-handover-inspection/`, de-snagging → `/handover-inspection-dubai/`, resale → `/secondary-property-inspection/`, leakage → `/moisture-detection-inspection/`). Rental, Commercial, Renovated and Roof waterproofing link to `#` (client: no pages yet, no redirect).
- Same 8 photos kept, re-paired to the closest topic (roof photo → Roof waterproofing, plumbing → Leakage, etc.). Marker icons updated.

## Files touched
- src/components/home/ServicesGrid.tsx
- src/i18n/dictionaries/{en,ar}.ts (`home.services.items`)

## Decisions & why
- No URLs added or changed. `#` links are a temporary client choice while the focus is the homepage.

## Follow-ups / known issues
- Build pages for Rental, Commercial, Renovated, Roof waterproofing (recipe in AGENTS.md §7), then set `page` in `featured` and drop the `#` links. `seo:audit` may flag the `#` links until then.
- Client may want their own wording for the row texts and a dedicated de-snagging page (currently `/handover-inspection-dubai/`; `/property-re-inspection/` is the alternative).
- Real photos for the new topics (warehouse, roof, rental) would fit better than the re-used ones.
