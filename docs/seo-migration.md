# SEO migration (WordPress → Next.js)

## Golden rule
Every URL that exists on WordPress must return **200 with the same path** or a **301** to its new home. Nothing may 404.

## URL map (from Yoast sitemaps, Oct 2026)
| WordPress URL | Next.js | Status |
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
| `/property-snagging-electrical-plumbing-mep-guide/` | blog post (DB) | 200 after `wp:import` |
| `/civil-structural-property-snagging-guide/` | blog post | 200 after `wp:import` |
| `/property-snagging-interior-finishes-fitout-guide/` | blog post | 200 after `wp:import` |
| `/property-snagging-inspection-dubai-abudhabi-sharjah/` | blog post | 200 after `wp:import` |
| `/property-snagging-checklist-before-handover-dubai/` | blog post | 200 after `wp:import` |
| `/sample-page/` | → `/` | 301 |
| `/category/*`, `/author/*`, `/feed/` | → `/blog/` | 301 |
| `/elementor-hf/*` | → `/` | 301 |
| `/sitemap_index.xml`, `/page-sitemap.xml`, `/post-sitemap.xml`, … | → `/sitemap.xml` | 301 |
| `/wp-content/uploads/**` | `public/wp-content/uploads/**` | 200 after `assets:download` |

New (not on WordPress), added for the client report:
- Services: `/property-inspection-dubai/`, `/villa-snagging-dubai/`, `/apartment-snagging-dubai/`, `/townhouse-snagging-dubai/`, `/handover-inspection-dubai/`, `/pre-handover-inspection/`, `/dlp-inspection/`, `/11-month-inspection/`, `/property-re-inspection/`, `/pre-purchase-property-inspection/`, `/secondary-property-inspection/`, `/thermal-imaging-inspection/`, `/moisture-detection-inspection/`, `/hvac-mep-inspection/`
- Locations: `/snagging-services-in-ajman/`, `/snagging-services-in-ras-al-khaimah/`, `/snagging-services-in-fujairah/`, `/snagging-services-in-umm-al-quwain/` (same pattern as the 3 legacy location URLs)
- Info: `/reviews/`, `/faqs/`, `/contact-us/`, `/gallery/`, `/snagging-by-developer/`, `/privacy-policy/`, `/terms-and-conditions/`
- Developer pages: `/{slug}/` from Admin (type "Developer page")
- All of the above under `/ar/...`

"Property Snagging Dubai" (client §3 and §4) is served by the legacy `/snagging-services-in-dubai/` — do not create a second Dubai page.

## Metadata parity
1. Run `npm run wp:seo-export` → `docs/legacy-seo.json`.
2. Compare each page's `title`/`description` with `src/content/pages.en.ts`. If a legacy title ranks well, copy it exactly.
3. Homepage title/description are already identical (`src/i18n/dictionaries/en.ts → meta`).
4. Blog posts get Yoast title/description automatically through `wp:import`.

## Launch checklist
- [ ] `assets:download` done, PDFs open at the old URLs
- [ ] `wp:import` done, all 5 posts reachable at the same URLs
- [ ] Meta parity checked against `docs/legacy-seo.json`
- [ ] Crawl the old sitemap URLs against the new server (Screaming Frog list mode) → no 404s
- [ ] Google Search Console verification tag present (it is in `site.googleVerification`)
- [ ] GTM/GA IDs set in `.env`
- [ ] Submit `https://propertyinspectors.me/sitemap.xml` in Search Console
- [ ] Monitor Search Console Coverage + rankings for 4–6 weeks; log findings in `changelog/`
