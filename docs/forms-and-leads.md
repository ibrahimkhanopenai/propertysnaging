# Quote form, pop-up & leads

Component: `src/components/forms/QuoteForm.tsx` (homepage `#quote`).

## Flow
1. Visitor enters the **built-up area (sq ft)** → price updates live: `round(BUA × PRICE_PER_SQFT)` (client, 2026-10-12: AED 0.70 per sq ft, so 1,250 sq ft = AED 875). Bedrooms no longer affect the price. Same rate for apartments, villas and commercial. Below 100 sq ft or empty → "Add the built-up area to see your price"; no `PRICE_PER_SQFT` → "Price on request" (never a made-up number). Logic shared by the form and the API in `src/lib/estimate.ts`.
2. On submit (name + mobile required):
   - WhatsApp opens **immediately** in a new tab with all details prefilled (must happen inside the click or browsers block it).
   - In parallel the form POSTs to `/api/leads/` with `keepalive`, including the saved gclid/UTM tags (`src/lib/attribution.ts`, see `docs/tracking.md`).
3. `/api/leads/`: zod validation → honeypot check → rate limit (5 / 10 min / IP, in-memory) → saves `Lead` in MySQL → responds → **after the response** sends the SMTP email (`after()`), then marks `emailSent`.
4. Leads are visible at `/admin/leads/`.

## Config (`.env`)
`PRICE_PER_SQFT`, `PRICE_CURRENCY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `LEAD_NOTIFY_TO`.
If SMTP is not configured the lead is still saved and a warning is logged.

## WhatsApp number
`site.whatsapp` in `src/lib/site.ts` (international format, no `+`).

## Fields (client report §8)
Visible: property type, bedrooms, built-up area, name, mobile. Behind **"Add more details (optional)"**: **Location / community** (replaces the old "Project name"), emirate (all 7), email, **handover date** (date picker; replaced the free-text notes box, CRO audit 2026-10). Button: **"Get my quote"**, with "No obligation. Your number is never shared." under it. Stored in `Lead.location`, `Lead.handoverDate`; `Lead.source` = `quote_form` | `contact_page` | `popup` | `booking_bar`.

## Booking bar (homepage, under the hero)
`components/forms/BookingForm.tsx` — short quote form ("Get your free quote", CRO audit 2026-10): Name*, Phone*, property type (Villa/Townhouse, Apartment, Commercial), **Get my quote**. Email was removed (each extra field loses leads). Same `/api/leads/` pipeline (MySQL + admin email to `LEAD_NOTIFY_TO`, subject "New lead (booking bar): …"), `source: booking_bar`, fires `generate_lead` with `form_id: booking_bar`. No WhatsApp hand-off.

## WhatsApp pop-up (client report §1)
`components/forms/LeadPopup.tsx` — appears 10 s after landing, once per browser session, never on `/contact-us/`. Fields: Name, No. of bedrooms (Studio–7 BR) and BUA in sq ft (optional), small close button, Esc/backdrop closes. On phones it's a bottom sheet (reduces Google intrusive-interstitial risk). **Submit opens WhatsApp** with the details pre-filled and closes the pop-up. Nothing is saved to MySQL or emailed (there is no phone field; the number comes with the WhatsApp chat). Old `Lead` rows with `source = popup` come from the earlier Name + Phone version.

## Conversion tracking
See `docs/tracking.md`.
