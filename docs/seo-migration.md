# SEO migration (old site → Next.js)

The old site is being shut down. Everything we need from it is already in this repo — nothing is fetched from it any more.
One-time snapshot of its SEO (Yoast titles, descriptions, robots, OG images, image alt texts): `docs/legacy-seo.json` (reference only).

## Golden rule
Every URL that exists on the old site must return **200 with the same path** or a **301** to its new home. Nothing may 404.

## URL map (from the old Yoast sitemaps, Oct 2026)
| Old URL | Next.js | Status |
|---|---|---|
| `/` | `app/[locale]/page.tsx` | 200 |
| `/about-us/` | `about-us/` | 200 |
| `/snagging-services/` | `snagging-services/` | 200 |
| `/scope-of-work/` | `scope-of-work/` | 200 |
| `/snagging-services-in-dubai/` | same | 200 |
| `/snagging-services-in-abudhabi/` | same | 200 |
| `/snagging-services-in-sharjah/` | same | 200 |
| `/real-estate-agents/` | same | 200 |
| `/developers/` | same | 200 |
| `/blog/` | `blog/` | 200 |
| `/company-profile/`, `/sample-report/`, `/check-list/`, `/inspection-tools/`, `/download-brochure/` | same (download pages) | 200 |
| `/property-snagging-electrical-plumbing-mep-guide/` | blog post (DB) | 200 once re-added in Admin (see below) |
| `/civil-structural-property-snagging-guide/` | blog post | 200 once re-added in Admin |
| `/property-snagging-interior-finishes-fitout-guide/` | blog post | 200 once re-added in Admin |
| `/property-snagging-inspection-dubai-abudhabi-sharjah/` | blog post | 200 once re-added in Admin |
| `/property-snagging-checklist-before-handover-dubai/` | blog post | 200 once re-added in Admin |
| `/sample-page/` | → `/` | 301 |
| `/category/*`, `/author/*`, `/feed/` | → `/blog/` | 301 |
| `/elementor-hf/*` | → `/` | 301 |
| `/sitemap_index.xml`, `/page-sitemap.xml`, `/post-sitemap.xml`, … | → `/sitemap.xml` | 301 |
| `/wp-content/uploads/…` (images + PDFs the site uses) | → `/images/…`, `/downloads/…`, `/icon.jpg` | 301 — list in `src/lib/legacy-redirects.ts` |

Old asset URLs that are NOT in `legacy-redirects.ts` (files the new site doesn't use) return 404 — intended.

New (not on the old site), added for the client report:
- Services: `/property-inspection-dubai/`, `/villa-snagging-dubai/`, `/apartment-snagging-dubai/`, `/townhouse-snagging-dubai/`, `/handover-inspection-dubai/`, `/pre-handover-inspection/`, `/dlp-inspection/`, `/11-month-inspection/`, `/property-re-inspection/`, `/pre-purchase-property-inspection/`, `/secondary-property-inspection/`, `/thermal-imaging-inspection/`, `/moisture-detection-inspection/`, `/hvac-mep-inspection/`
- Locations: `/snagging-services-in-ajman/`, `/snagging-services-in-ras-al-khaimah/`, `/snagging-services-in-fujairah/`, `/snagging-services-in-umm-al-quwain/` (same pattern as the 3 legacy location URLs)
- Info: `/reviews/`, `/faqs/`, `/contact-us/`, `/gallery/`, `/snagging-by-developer/`, `/privacy-policy/`, `/terms-and-conditions/`
- Developer pages: `/{slug}/` from Admin (type "Developer page")
- All of the above under `/ar/...`

"Property Snagging Dubai" (client §3 and §4) is served by the legacy `/snagging-services-in-dubai/` — do not create a second Dubai page.

## Images and PDFs
- Files: `public/images/<section>/` and `public/downloads/`, lowercase-hyphen names, no dates or size suffixes. Paths are set only in `src/lib/site.ts`.
- **Replacing an image:** overwrite the file with the SAME name → no code or redirect change. Changing the name or extension? Update `src/lib/site.ts` AND the target in `src/lib/legacy-redirects.ts`.
- Never delete an entry from `legacy-redirects.ts` (those old URLs are indexed and linked).
- Favicon = `src/app/icon.jpg` + `src/app/apple-icon.jpg` (Next.js file convention).

## Metadata parity (old titles kept where the old site had real Yoast SEO)
| Page | Source of the title/description |
|---|---|
| Homepage | old site, exact (`src/i18n/dictionaries/en.ts → meta`) |
| Dubai / Abu Dhabi / Sharjah | old site, exact (`src/content/locations.en.ts`, `metaTitleAbsolute: true` = no brand suffix) |
| Other legacy pages | new copy — the old site had no custom Yoast title/description for them |

## Blog posts (re-add in Admin with the SAME slug and meta)
Blog posts are added by hand in `/admin/posts/new/`. Use exactly these values to keep the rankings:

| Slug | Meta title | Meta description |
|---|---|---|
| `property-snagging-checklist-before-handover-dubai` | Property Snagging Checklist Before Taking Property Handover | Need for Property Snagging and inspection in Dubai, Abu Dhabi, Sharjah and from Experts, using advance tools in the UAE. |
| `property-snagging-interior-finishes-fitout-guide` | Property Snagging Guide: Interior Finishes & Fit-Out Inspection | Guide to interior finishes and fit-out property snagging inspections. Learn how experts identify paint defects, tile issues, and installation problems before property handover. |
| `property-snagging-electrical-plumbing-mep-guide` | Guide for Property Snagging: Electrical and Plumbing (MEP) | Guide to electrical and plumbing (MEP) property snagging inspections. Learn how professionals detect wiring faults, plumbing leaks, and drainage issues before property handover. |
| `property-snagging-inspection-dubai-abudhabi-sharjah` | Need for Property Snagging & Inspection in Dubai (UAE) | Protect Your Investment with UAE’s Best Snagging Company. Property Snagging Dubai, Property Inspection Abu Dhabi, Experts in the UAE. |
| `civil-structural-property-snagging-guide` | Property Snagging Guide: Civil & Structural Inspection of Property | Property snagging guide covering civil and structural inspections. Discover how professionals detect construction defects and structural issues before property handover. |

Original publish dates are in `docs/legacy-seo.json → posts[].publishedAt`.

## Launch checklist
- [ ] Old image/PDF URLs 301 to the new files (spot-check a few from `src/lib/legacy-redirects.ts`)
- [ ] All 5 blog posts re-added in Admin and reachable at the same URLs
- [ ] Meta parity checked against `docs/legacy-seo.json`
- [ ] Crawl the old sitemap URLs against the new server (Screaming Frog list mode) → no 404s
- [ ] Google Search Console verification tag present (it is in `site.googleVerification`)
- [ ] `NEXT_PUBLIC_GTM_ID=GTM-N2BF4B58` set in the production `.env`
- [ ] Submit `https://propertyinspectors.me/sitemap.xml` in Search Console
- [ ] Monitor Search Console Coverage + rankings for 4–6 weeks; log findings in `changelog/`
