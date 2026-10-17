# Assumptions & TODO before launch

## DUMMY data (replace — all in `src/lib/site.ts` unless noted)
| Item | Current value | Where |
|---|---|---|
| Email | info@propertyinspectors.me | `site.email`, `.env LEAD_NOTIFY_TO` |
| Opening hours | Mo-Sa 08:00-20:00 | `site.hours` |
| DED licence no. | DED-000000 | `site.dedLicense` |
| Social links | guessed URLs | `site.social` |
| Stats | 15,000+ inspections (client figure, 2026-10-13), 10+ years, 300+ points | Editable in **Admin → Settings** (defaults: `site.stats`; years/points still `genuine:false`) — client requires GENUINE numbers. ⚠️ Live site (mypropertysnagging.com) states **60,000+ inspections / 12,000+ hrs** — big discrepancy, confirm real figures (not changed/fabricated) |
| Google rating | 4.9 placeholder | `site.reviews.rating` — now **hidden on the homepage** while `isPlaceholder` is true |
| Google review link | Maps search URL | `site.googleReviewUrl` — use the real profile / review link |
| Reviews | Homepage: live Google reviews (SociableKit widget, free plan) | `site.googleReviewsWidget`; `/reviews/` still lists Admin → Reviews entries |
| Homepage "Real findings" | defect/recommendation copy cleaned from the live site | `home.findings` in `en.ts`/`ar.ts` — confirm wording |
| Price | AED 0.70 per sq ft of built-up area (client, 2026-10-12) | `.env PRICE_PER_SQFT` — same rate for commercial (confirmed 2026-10-12) |
| GTM / GA / Clarity IDs | empty locally | production `.env`: `NEXT_PUBLIC_GTM_ID=GTM-N2BF4B58` and `NEXT_PUBLIC_CLARITY_ID=v5f8ri65o1` — same as the WordPress site truecheckinspection.com (confirmed final 2026-10-12; `GTM-MCTLKNHC` is not used). Leave `NEXT_PUBLIC_GA_ID` empty if GA4 is set up inside GTM (else double counting). The live site currently loads NO GTM (env not set on the server) |
| Arabic copy | first draft | `ar.ts`, `pages.ar.ts` — native review needed |

## Assumptions made
- Hosting is a self-managed Node server ("local") — no Vercel-specific features used.
- MySQL is required, so Payload CMS was not used (it has no MySQL adapter); admin is custom.
- Download pages (`/sample-report/` etc.) link straight to the existing PDFs.
- `/download-brochure/` uses the company profile PDF (no separate brochure PDF found).
- Images reuse the old site's photos, renamed into `public/images/<section>/` (paths in `site.images`, old URLs 301 via `src/lib/legacy-redirects.ts`); hero = client-supplied `/images/hero-city-in-hand.png` (served as-is, `unoptimized`). The client will replace images by hand (same file name).
- Logo = client-supplied transparent PNG (2026-10-09, cropped from `Black-Logo-Transperant.png`): `/images/logo.png`, white version `/images/logo-white.png` for the footer (same alpha, white fill). Favicon `src/app/icon.jpg` / `apple-icon.jpg` from the client's icon file. Swap for an SVG if one becomes available.

## Admin roadmap (client: "manage content and images from the admin", agreed 2026-10-13)
Pattern to follow: DB table + admin screen + server reads with a code fallback, so pages render without the DB (see Phase 1: `getSettings()`, `getLocationItems()`, `changelog/2026-10-13-008-admin-locations-settings.md`).
- [x] **Phase 1:** Admin → Locations (communities + areas per emirate) and Admin → Settings (contact, key figures, Google review + sample report links)
- [x] **Phase 2: Images.** Admin → Images: photo + ALT (EN/AR) for 24 slots (hero, About, location heroes, "Defects we find", sample report, location defect photos), falling back to the `/images/` files (`changelog/2026-10-13-009-admin-images-developer-logos.md`)
- [x] **Phase 2: Developer logos.** Admin → Developer logos (upload, name EN/AR, order, show/hide) for the homepage strip, falling back to `site.developers`
- [x] **Phase 3:** Admin → FAQs (homepage + each service/location page; also feeds /faqs/), Admin → Defects we find (photo, category, defect, recommendation; EN/AR) and Admin → Page text (service/location hook, intro, sections), all as overrides with the dictionaries / content files as fallback (`changelog/2026-10-13-013-admin-faqs-findings-page-text.md`)
- Not done yet (if the client asks): location "Why snagging matters" + defect groups, the "From our recent reports" captions, info pages (About, Scope of work…), homepage section copy.
- Not for the admin: page URLs, homepage + Dubai/Abu Dhabi/Sharjah `<title>`/meta (SEO rule §5.6), homepage section order (client requirement), colours/design.

## Open tasks
- [ ] **Confirm domain**: report says propertyinspectors.ae, live site is .me (see `docs/client-requirements.md`)
- [ ] Confirm sample report images have all client personal data removed
- [ ] Write the 10 blog drafts (`npm run blog:drafts`) and genuine developer pages
- [ ] Replace all DUMMY values above
- [ ] Native Arabic review
- [x] Re-add the 5 old blog posts in Admin with the same slug/meta (table in `docs/seo-migration.md`) — all 5 live (2026-10-17), no featured images (the originals were deleted from the old server)
- [x] Checklist post (Admin post 1): "Related service" was `C:/Program Files/Git/handover-inspection-dubai/` (CTA 404) — set to `/handover-inspection-dubai/` (2026-10-17)
- [ ] Blog featured/OG images are placeholders picked from the site's own photos (2026-10-17): replace them per post in Admin → Posts (change "OG image" too, or clear it so it follows the featured image)
- [x] Post 5 (`/property-snagging-inspection-dubai-abudhabi-sharjah/`) OG image was a sample photo (star trails) — now `/images/hero-city-in-hand.png` (client's choice, 2026-10-17)
- [ ] Location photos: Dubai, Ajman, Fujairah and UAQ reuse inspection photos from the scope/gallery sets (2026-10-12) — replace with photos taken in each emirate when the client sends them (Admin → Images → Location page heroes, or `site.images.locations`). The WordPress pages used a stock "house + coins" image (`sale.jpg`), not used here (not an inspection photo)
- [ ] About photo (`/images/about/property-handover.jpg`) is an Unsplash+ premium image with a visible watermark — replace with a licensed/real photo
- [ ] Homepage Sample report collage (`/images/reports/sample-report-page-{1,2,3}.jpg`) is stock photography (hi-vis vest, hard hat), not our jobs — client asked for original photos (2026-10-09)

### Asked the client, waiting for a reply (2026-10-09)
- [ ] **Photos:** original inspection photos to replace the Sample report collage and the About photo (the two items above). Replace by overwriting the same file names, or in Admin → Images.
- [ ] **Blue t-shirt photos:** 4 gallery photos show an inspector in a navy t-shirt, not the white branded polo (`gallery/external-works-inspection.jpg`, `mirror-fixture-check.jpg`, `shower-glass-inspection.jpg`, `wall-surface-check.jpg`). Remove them, or keep them?
- [ ] **Reviews in the header:** the client's mockup has it; their message didn't. Currently footer only (`components/layout/nav.ts`).
- [ ] **Phone number:** the mockup shows +971 55 608 3671; the site uses +971 58 155 1637 (`site.ts`). Which is correct?
- [ ] **Hero H1:** "Property Inspection Services in UAE" (mockup) or "Property Snagging & Inspection Services in the UAE" (message, live now)?
- [x] Real Google reviews — homepage uses the SociableKit widget (2026-10-13)
- [ ] Optional: Arabic translations of the 5 old blog posts
- [ ] Confirm the developer logo strip wording ("We snag homes by the UAE's leading developers") — logos imply inspections in those projects, not a partnership
- [ ] Re-export the "Dubai Properties" logo (current PNG only contains the red tick, so it is hidden)
- [ ] Homepage hero/About copy uses the old site's claims ("one of the best and most trusted", "10,000 hours" per engineer) — client OK'd for now (2026-10-02); revisit before launch
- [ ] **Brand/contact decision**: the redesign brief calls the business "My Property Snagging" (mypropertysnagging.com, +971 55 412 1205) but the local project is "Property Inspectors" (propertyinspectors.me, +971 58 155 1637). Local identity kept (header/footer/`site.ts` untouched). Confirm whether to switch brand/phone — see `changelog/2026-10-03-010-homepage-premium-redesign.md`
- [ ] Confirm the real inspection stats vs the live site's 60,000+/12,000+ (Stats row above)
- [ ] Confirm the 3 default testimonials + the "Real findings" defect/recommendation wording carried from the live site
