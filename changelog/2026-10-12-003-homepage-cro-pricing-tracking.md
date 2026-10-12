# 2026-10-12-003 — Homepage CRO fixes, price per sq ft, gclid/UTM on leads, Clarity

**Agent/Author:** Claude Code
**Task:** Apply the client's CRO & Google Ads audit (PDF, written for the WordPress site truecheckinspection.com) to the Next.js homepage only. Client answers: price = built-up area × AED 0.70 from `.env`; stats and rating stay as they are; CTA colour "according to the theme"; hook line instead of a new H1; the "one of the best…" about text stays; real photos come later. Tracking codes are taken from truecheckinspection.com.

## What changed
- **Price (audit #1 "AED 10" bug):** `estimatePrice()` is now `round(BUA × PRICE_PER_SQFT)`, and bedrooms no longer change the price. `.env` / `.env.example`: `PRICE_PER_BEDROOM=10` → `PRICE_PER_SQFT=0.70`. With no area (or under 100 sq ft) the box says "Add the built-up area to see your price". Commercial, or a missing rate, shows "Price on request". The same function is used by the form and by `/api/leads/`.
- **Quote form (`#quote`, also on /contact-us/):** 5 visible fields (property type, bedrooms, built-up area, name, mobile). Location, emirate, email and a **handover date** picker (it replaced the notes box) sit behind "Add more details (optional)". "No obligation. Your number is never shared." shows under the button.
- **Booking bar:** "Get your free quote" with Name, Phone and Property type, and the button "Get my quote". The email field is removed.
- **Hero:** the H1 is unchanged (SEO rule). A hook line "Don't sign your handover until an engineer has checked it." is added under it. The 4 generic icons are replaced by 3 proofs (DED licensed, InterNACHI certified, Report in 6–24h). One copper primary button "Get my free quote". The green "Chat on WhatsApp" button has a pre-filled message ("Hi, I need a snagging inspection for my [apartment / villa] in [community]. Handover date: [ ]"), also used by the final-CTA WhatsApp button. The phone is a text link: "Or call an engineer: …". In Arabic the white wash is mirrored so the right-aligned text is readable (before, the intro sat on the photo).
- **CTA colour:** new `cta` Button variant plus all form submit buttons (quote, booking bar, pop-up) use `brand-dark` #A1521F (5.6:1 with white, was #C96A32 at ~3.7:1), with hover `brand-deep` #8A4519 (new token). WhatsApp stays green.
- **Sample report section:** "Book your inspection" uses the CTA colour. "See the full sample report" is now **"Download sample report (PDF)"** (`site.pdfs.sampleReport`). This section also shows on /sample-report/, where the old button linked to the page itself.
- **FAQ:** "How much does a snagging inspection cost?" is first, so it is open by default. The answer now says the price is based on built-up area (EN + AR).
- **Readability:** small readable labels raised from 10–12px to 12–13px (trust stat labels, credentials, findings tags, photo captions, final-CTA labels, `Kicker`, FAQ label). Decorative ordinals (01, 02…) are unchanged.
- **Ad attribution (audit #9):** `src/lib/attribution.ts` saves `gclid` (or `gbraid`/`wbraid`) and `utm_source/medium/campaign/term` from the landing URL in localStorage (last click wins, 90 days). It runs from `TrackClicks` on every page. The quote form and the booking bar send these with the lead. New `Lead` columns: `handoverDate`, `gclid`, `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`. They appear in the lead email and in Admin → Leads (new "Handover" and "Ad click" columns).
- **Microsoft Clarity:** `components/analytics/Clarity.tsx`, read from `NEXT_PUBLIC_CLARITY_ID` (truecheckinspection.com uses `v5f8ri65o1`).
- **GTM:** `.env.example` and docs now point to `GTM-N2BF4B58` (the container on truecheckinspection.com).
- Docs: forms-and-leads, tracking, design-system (brand rows were still listed as green; corrected to copper, CTA rule added), client-requirements, assumptions-and-todo.

## Files touched
- prisma/schema.prisma, prisma/migrations/20261012065819_lead_handover_attribution/migration.sql (new)
- src/lib/{estimate,pricing,attribution(new)}.ts, src/app/api/leads/route.ts, src/app/admin/(panel)/leads/page.tsx
- src/components/forms/{QuoteForm,BookingForm,LeadPopup}.tsx
- src/components/home/{Hero,FinalCta,SampleReportSection,Findings,PhotosSection,TrustSection}.tsx, src/components/pages/Faq.tsx
- src/components/ui/{Button,Kicker}.tsx, src/app/globals.css
- src/components/analytics/{Clarity(new),TrackClicks}.tsx, src/app/[locale]/layout.tsx, src/app/[locale]/contact-us/page.tsx
- src/i18n/dictionaries/{en,ar}.ts, .env.example (+ local .env)
- docs/{forms-and-leads,tracking,design-system,client-requirements,assumptions-and-todo}.md

## Decisions & why
- **Not done (homepage-only scope, or no real data yet):** ad landing pages, location pages, the Dubai page hero image, real defect photos and report pages, Google rating, developer-logo permission. Kept as they are on the client's instruction: the hand hero image, the stats, and the "one of the best…" about text. The "Atlantis shown twice" finding is not a bug: the logo strip is an endless marquee that repeats the list.
- **H1 not replaced** by the audit's "Don't sign your handover…" line: the H1 is SEO-tuned and the client shortened it on 2026-10-09. The line is a hook under it instead.
- **Two buttons in the hero, not one:** the copper "Get my free quote" is the single primary action. WhatsApp stays as the green channel button, matching the audit's own mockup and the colour rule (green = WhatsApp only).
- **Hero form not moved beside the H1:** it would cover the hand photo the client asked to show in full. The booking bar already sits on the hero's bottom edge, so it was shortened instead.
- **Commercial = "Price on request"** (as before). The client's per-sq-ft rate may not apply to commercial units.
- **No fallback rate:** if `PRICE_PER_SQFT` is missing, no price is shown rather than a wrong one. A missing env value with a hard-coded fallback is what caused the "AED 10" bug.
- Migration SQL uses `` `Lead` `` (capital L): MySQL on Linux has case-sensitive table names. Prisma on Windows generated `lead`; it was fixed and the local checksum updated.
- "Reply in minutes" from the audit's micro-copy was left out. Only promise it if the team can keep it.
- Tested on the local dev server with MySQL. Visiting `/?gclid=…&utm_*=…` saved the tags. BUA 1,250 → AED 875; commercial → "Price on request"; 80 sq ft → asks for area. The submitted lead was stored with price, handover date, gclid and all UTMs, and the booking bar sent `generate_lead`. Screenshots at 1440 (EN + AR) and 390 showed no horizontal scroll and one H1. Test leads were deleted afterwards. typecheck + lint pass.

## Follow-ups / known issues
- **Deploy:** run `npm run db:deploy` on the server **before** starting the new build. Without the new columns, `/api/leads/` fails and leads are lost. Set `PRICE_PER_SQFT=0.70` and remove `PRICE_PER_BEDROOM` from the server `.env`. Set `NEXT_PUBLIC_GTM_ID=GTM-N2BF4B58` and `NEXT_PUBLIC_CLARITY_ID=v5f8ri65o1`, then rebuild (`NEXT_PUBLIC_*` values are baked in at build time). Right now the live site loads **no** GTM.
- **Confirm GTM container:** on 2026-10-09 the client gave `GTM-MCTLKNHC`; today's instruction points to `GTM-N2BF4B58` (truecheckinspection.com).
- Clarity: one project records both domains. Don't also add Clarity inside GTM. The Clarity snippet was not seen in a live render (the ID is empty locally on purpose).
- Google Ads conversion tags and enhanced conversions live inside GTM and need GTM access: create a "Google Ads conversion" tag on `generate_lead` / `click_whatsapp` / `click_call`.
- The WhatsApp pop-up and plain WhatsApp/call clicks carry no gclid (no form post); they are counted by events only.
- The header "Get a quote" button is still black (header is site-wide; not changed in this homepage-only task).
- Arabic copy for the new lines is a first draft; needs a native review.
