# Analytics & conversion tracking

## Setup
1. `.env`: `NEXT_PUBLIC_GTM_ID=GTM-N2BF4B58` — the same container as the WordPress site truecheckinspection.com (confirmed final 2026-10-12; `GTM-MCTLKNHC` is not used). `NEXT_PUBLIC_*` values are baked in at build time: set them on the server, then `npm run build`. Rendered as Google's official snippet in `<head>` + `<noscript>` after `<body>` on every public page (not admin) — `src/components/analytics/GoogleTagManager.tsx`. Set `NEXT_PUBLIC_GA_ID=G-XXXX` ONLY if GA4 is not configured inside GTM (both = double counting).
2. Search Console: verification tag already in `site.googleVerification`. After launch submit `/sitemap.xml`.
3. Microsoft Clarity: `NEXT_PUBLIC_CLARITY_ID=v5f8ri65o1` (same project as the WordPress site) → official snippet in `<head>` (`src/components/analytics/Clarity.tsx`). Don't also add Clarity as a tag inside GTM (double sessions).

## Google Ads click id + UTM on every lead
`src/lib/attribution.ts`: on every page load (`TrackClicks`) the URL's `gclid` (or `gbraid`/`wbraid`) and `utm_source/medium/campaign/term` are saved in `localStorage` (last ad click wins, kept 90 days). The quote form and the booking bar send them with the lead → stored in `Lead.gclid`, `Lead.utmSource`… (migration `20261012065819_lead_handover_attribution`), shown in the lead email and in Admin → Leads ("Ad click" column). Use the gclid for **offline conversion import** in Google Ads (mark leads that booked/paid and upload them back). The WhatsApp pop-up and plain WhatsApp/call buttons carry no gclid — those are counted by the `click_whatsapp` / `click_call` events only.

## Events pushed (`window.dataLayer` + `gtag` if present)
| Event | When | Params |
|---|---|---|
| `generate_lead` | Quote form / contact form saved successfully, or pop-up submitted (opens WhatsApp, `method: "whatsapp"`) | `form_id` (`quote_form`, `contact_page`, `popup`), `property_type`, `value`, `currency`, `method` |
| `click_call` | Any `tel:` link clicked (header, hero, floating, mobile bar, footer, contact) | `location` (from `data-track`) |
| `click_whatsapp` | Any `wa.me` link clicked | `location` |

Code: `src/lib/track.ts`, `src/components/analytics/TrackClicks.tsx` (global listener — new tel/WhatsApp links are tracked automatically; add `data-track="name"` to label them).

## In GA4
Mark `generate_lead`, `click_call`, `click_whatsapp` as **key events** (conversions). In GTM create Custom Event triggers with these names → GA4 Event tags.
