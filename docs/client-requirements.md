# Client requirements (website report) → implementation map

Source: `Propertyinspectors_ae_website_report.docx` (client, Oct 2026). Written for the old site; applied to the Next.js build.
**Any agent changing a page must keep these rules.** Status: ✅ done · 🟡 done, needs client data · ⏳ open

| § | Requirement | Status | Where |
|---|---|---|---|
| 1 | H1 "Property Snagging & Inspection Services in the UAE" (shortened + smaller font on client request, 2026-10-09) | ✅ | `i18n/dictionaries/en.ts → home.hero.title` |
| 1 | Supporting statement (before handover / DLP / before purchase) | ✅ | `home.hero.intro` |
| 1 | CTAs "Get a Quote", "Book an Inspection", "WhatsApp Us" + visible phone. CRO audit (2026-10-12): one copper primary "Get my free quote", green "Chat on WhatsApp" with a pre-filled message, phone as "Or call an engineer" text link; hook line under the H1 (H1 unchanged); 3 proofs (DED, InterNACHI, 6–24h) | ✅ | `components/home/Hero.tsx`, phone also in header |
| 1 | Trust section directly after hero — genuine stats/credentials only | 🟡 | `TrustSection.tsx`; DUMMY stats flagged in `site.stats` (`genuine:false`) |
| 1 | Pop-up after ~10 s: Name, No. of bedrooms, BUA sq ft, Submit opens WhatsApp, small X (changed from Name + Phone on client request, 2026-10-09) | ✅ | `components/forms/LeadPopup.tsx` (once per session, bottom sheet on mobile) |
| 1 | Call + WhatsApp buttons on all pages | ✅ | `components/layout/FloatingContact.tsx` |
| 2 | Homepage section order (12 sections) | ✅ | `app/[locale]/page.tsx` (order documented in the file) |
| 2 | Old-site sections kept on client request (2026-10-02): booking bar, About us, Certified by InterNACHI, developer logos — slotted in without reordering the 12 | ✅ | `components/home/{BookingBar,AboutSection,CertifiedSection,DevelopersStrip}.tsx`; old intro paragraph is in the hero (`home.hero.about`); copy taken from the live site |
| 3 | 15 service pages, original content each | ✅ | `content/services.{en,ar}.ts`, routes in `lib/routes.ts`. "Property Snagging Dubai" = existing `/snagging-services-in-dubai/` (kept: ranks on Google; avoids a duplicate page) |
| 4 | 7 location pages, location-specific | ✅ | `content/locations.{en,ar}.ts` — new: Ajman, RAK, Fujairah, UAQ (same URL pattern as the 3 legacy pages) |
| 5 | Detailed "What we inspect" (8 categories) | ✅ | Homepage `WhatWeInspect.tsx` + `/scope-of-work/` (anchors `#structural`, `#electrical`…) |
| 6 | Sample report page: real examples, fields, CTA "Book Your Inspection" | 🟡 | `/sample-report/` — uses existing report images; client must confirm personal data is removed |
| 7 | Real photos, optimised, descriptive ALT, Gallery page with uploads; photos shown whole and open full size on click (client feedback 2026-10-09) | ✅ | `/gallery/`, Admin → Gallery (ALT required), `next/image` AVIF/WebP, `components/ui/Lightbox.tsx` (homepage photo grid + gallery page) |
| 8 | Quote form: "Location" instead of "Project name", "Get My Quote", responsive, email/CRM, conversion tracking. Price = built-up area × `PRICE_PER_SQFT` (AED 0.70, 2026-10-12); 5 visible fields, the rest optional; handover date; gclid/UTM saved with every lead; booking bar = Name, Phone, Type | ✅ | `QuoteForm.tsx`, `BookingForm.tsx`, `/api/leads/`, `lib/estimate.ts`, `lib/attribution.ts`, `lib/track.ts` (`generate_lead`) |
| 9 | Genuine reviews, Google profile link, credentials, stats, scrolling reviews | 🟡 | Admin → Reviews, `ReviewsMarquee.tsx`, `/reviews/`; `site.googleReviewUrl` is DUMMY |
| 10 | Unique titles/descriptions, one H1, clean URLs, ALT, canonical, sitemap, robots, schema, internal links | ✅ | `lib/seo.ts`, `lib/schema.ts`, related-services blocks, `scripts/seo-audit.mjs` |
| 10 | GSC + GA4 + conversion tracking (calls, WhatsApp, forms) | 🟡 | `TrackClicks.tsx` (`click_call`, `click_whatsapp`); IDs in `.env` — see `docs/tracking.md` |
| 11 | Developer pages (Emaar, DAMAC, Sobha…) only where justified | 🟡 | Admin → Posts, type "Developer page" → `/{slug}/`, listed at `/snagging-by-developer/`. None published: needs genuine content |
| 12 | FAQs (snagging, timing, cost, duration, report, handover, DLP, re-inspection, pre-purchase, HVAC, areas) | ✅ | Homepage FAQ + `/faqs/` (+ per-service FAQs), FAQPage schema |
| 13 | Black & white theme, **purple for pictures and forms** | ✅ | Tokens `brand*` in `globals.css`; see `docs/design-system.md` |
| 13 | Nav: Home, Services, Locations, About, Sample report, Gallery, Blog, FAQs, Contact (Sample report, Gallery, Blog, FAQs added back to the header on client request, 2026-10-09; Reviews stays in the footer) | ✅ | `components/layout/nav.ts`, `components/layout/Footer.tsx` |
| 13 | Reference design (About + Reviews pages) | ✅ | `/about-us/` (story, values), `/reviews/` (rating badge, cards, write-a-review banner) |
| 15 | Resources/blog + 10 initial topics | 🟡 | `npm run blog:drafts` creates 10 DRAFT outlines (not published until written) |
| 16 | Responsive, CWV, image formats, lazy-load, HTTPS, working links | ✅/⏳ | Built in; HTTPS on the server (Nginx/Caddy); verify with `npm run seo:audit` + Lighthouse |
| 17 | Final QA checklist | ⏳ | `docs/qa-checklist.md` |

## Open question for the client
The report is titled **propertyinspectors.ae**, but the live site is **propertyinspectors.me**. If the business is moving to `.ae`, that is a domain migration: set `NEXT_PUBLIC_SITE_URL`, 301 every `.me` URL to the same path on `.ae`, and use Search Console's *Change of address* tool. Do NOT switch without that plan.
