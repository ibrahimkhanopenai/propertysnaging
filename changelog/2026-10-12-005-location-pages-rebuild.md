# 2026-10-12-005 — Location pages rebuilt (content from truecheckinspection.com, written per city)

**Agent/Author:** Claude Code
**Task:** Client feedback: location pages lack information, hooks, images and structure. Rebuild all 7 location pages with the same CTAs as the homepage. Keep the URLs and SEO of truecheckinspection.com (the WordPress site), and base the content on it, written so it reads as human, not AI. Client answers: any stats are fine for now; current images are fine for now; fix superlatives as on the homepage; areas as plain text.

## What changed
- **Checked against truecheckinspection.com:** it has 3 location pages (Dubai, Abu Dhabi, Sharjah). Their URLs, `<title>` and meta descriptions are identical to ours (already in `docs/legacy-seo.json`), so nothing changed there. The 4 other emirates exist only on this site.
- **New `components/pages/LocationPage.tsx`**, used by the 7 location routes instead of `ContentPage`:
  1. Hero: H1 (unchanged), city hook line, intro, 3 proofs, copper "Get my free quote" (→ `#quote` on the same page), "Chat on WhatsApp" with a city pre-fill, "Or call an engineer", real photo, and a "From AED 0.70 per sq ft" badge (from `PRICE_PER_SQFT`; hidden if unset).
  2. Key figures (`site.stats`, same as homepage).
  3. "Why snagging matters in {city}" + "What we find" (4 defect groups, red markers) + 4 report photos with captions.
  4. Local tips + "Areas we cover in {city}" (+ "whole emirate" note).
  5. Homepage sections reused: Why choose us, Process, Sample report ("Book your inspection" now goes to the page's own `#quote`), city FAQ, related services + other emirates, quote form with price.
- **Content (`content/locations.{en,ar}.ts`):** new `hook`, `imageAlt`, `why` and `defects` for every city. More areas (truecheck's lists merged in, e.g. Palm Jumeirah, JVT, Al Khalidiyah, Al Nahda). 1–2 more FAQs per city. A few local sections rewritten where they repeated the new defects block. The WordPress pages were one template with the city name swapped. Here the same ideas (heat/humidity, AC, fast-built handovers; MEP, HVAC, finishes and climate defects; how we help; areas) are written separately for each city (towers vs villas, coastal salt air in RAK, rain in Fujairah, resale in Sharjah/UAQ, budget buyers in Ajman). WordPress superlatives ("UAE's leading", "fastest turnaround") are left out; the proofs and stats carry that.
- **Images (`site.images.locations`):** RAK now uses its existing photo. Dubai, Ajman, Fujairah and UAQ reuse real inspection photos (tiles + moisture meter, kitchen sink test, socket test, thermal camera). New `site.images.findingPhotos` (4 report photos); captions/ALT in `dict.pageUi.findingPhotos`. Descriptive ALT on each hero; it does not claim the photo was taken in that city.
- `content/types.ts`: optional `hook`, `imageAlt`, `why`, `defects` on `PageContent`.
- `components/pages/RelatedLinks.tsx`: the related/other-emirates block, moved out of `ContentPage` so both page types share it.
- Dictionaries: `pageUi.areasIn`, `areasNote`, `priceFrom`, `priceNote`, `waMessage`, `findingPhotosTitle`, `findingPhotos` (EN + AR).
- Docs: client-requirements (§4), assumptions-and-todo (location photos).

## Files touched
- src/components/pages/{LocationPage(new),RelatedLinks(new),ContentPage}.tsx, src/components/home/SampleReportSection.tsx
- src/app/[locale]/snagging-services-in-{dubai,abudhabi,sharjah,ajman,ras-al-khaimah,fujairah,umm-al-quwain}/page.tsx
- src/content/{types,locations.en,locations.ar}.ts, src/lib/site.ts, src/i18n/dictionaries/{en,ar}.ts
- docs/{client-requirements,assumptions-and-todo}.md

## Decisions & why
- **Not copied word for word:** the 3 WordPress pages are near-duplicates. That breaks the client rule "every location page has unique copy" and is weak for Google. Copying them 7 times would make it worse.
- **`sale.jpg` (stock "house + coins") not used:** AGENTS.md says the imagery must be about inspections, not property sales.
- **Main menu kept** on location pages: they are organic SEO pages, not ad landing pages.
- **No new URLs** for areas (client confirmed plain text).
- Checked on the dev server: all 7 EN pages (+ AR samples) return 200, have exactly one `<h1>`, the same `<title>` and canonical as before, and Service + FAQPage + BreadcrumbList schema. One `id="quote"` per page. Screenshots: Dubai 1440, RAK 390 (no horizontal scroll), Sharjah AR 1440. typecheck, lint and 87 tests pass.

## Follow-ups / known issues
- The full `npm run seo:audit` crawl did not finish on the dev server (each page compiles for ~50 s on this machine). All 83 internal links found on the 7 location pages (EN + AR) were checked separately and return 200. Run the full audit against a production build before launch.
- Arabic copy is a first draft; needs a native review.
- Replace the reused photos with real photos from each emirate when the client sends them (overwrite or change the paths in `site.images.locations`).
- Stats are still the `site.stats` values (3 marked DUMMY). The WordPress pages claim 60,000+ inspections / 12,000+ hours / 12 h reports; confirm the real numbers.
