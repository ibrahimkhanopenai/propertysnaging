# Analytics & conversion tracking

## Setup
1. `.env`: `NEXT_PUBLIC_GTM_ID=GTM-MCTLKNHC` (client container). Rendered as Google's official snippet in `<head>` + `<noscript>` after `<body>` on every public page (not admin) — `src/components/analytics/GoogleTagManager.tsx`. Set `NEXT_PUBLIC_GA_ID=G-XXXX` ONLY if GA4 is not configured inside GTM (both = double counting).
2. Search Console: verification tag already in `site.googleVerification`. After launch submit `/sitemap.xml`.

## Events pushed (`window.dataLayer` + `gtag` if present)
| Event | When | Params |
|---|---|---|
| `generate_lead` | Quote form / contact form / pop-up saved successfully | `form_id` (`quote_form`, `contact_page`, `popup`), `property_type`, `value`, `currency` |
| `click_call` | Any `tel:` link clicked (header, hero, floating, mobile bar, footer, contact) | `location` (from `data-track`) |
| `click_whatsapp` | Any `wa.me` link clicked | `location` |

Code: `src/lib/track.ts`, `src/components/analytics/TrackClicks.tsx` (global listener — new tel/WhatsApp links are tracked automatically; add `data-track="name"` to label them).

## In GA4
Mark `generate_lead`, `click_call`, `click_whatsapp` as **key events** (conversions). In GTM create Custom Event triggers with these names → GA4 Event tags.
