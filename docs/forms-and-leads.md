# Quote form, pop-up & leads

Component: `src/components/forms/QuoteForm.tsx` (homepage `#quote`).

## Flow
1. Visitor picks property type + bedrooms → price updates live: `bedrooms × PRICE_PER_BEDROOM` (Studio = 1; Commercial = "Price on request"). Logic shared in `src/lib/estimate.ts`.
2. On submit (name + mobile required):
   - WhatsApp opens **immediately** in a new tab with all details prefilled (must happen inside the click or browsers block it).
   - In parallel the form POSTs to `/api/leads/` with `keepalive`.
3. `/api/leads/`: zod validation → honeypot check → rate limit (5 / 10 min / IP, in-memory) → saves `Lead` in MySQL → responds → **after the response** sends the SMTP email (`after()`), then marks `emailSent`.
4. Leads are visible at `/admin/leads/`.

## Config (`.env`)
`PRICE_PER_BEDROOM`, `PRICE_CURRENCY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `LEAD_NOTIFY_TO`.
If SMTP is not configured the lead is still saved and a warning is logged.

## WhatsApp number
`site.whatsapp` in `src/lib/site.ts` (international format, no `+`).

## Fields (client report §8)
Property type, bedrooms, **Location / community** (replaces the old "Project name"), emirate (all 7), name, mobile, built-up area, email, notes. Button: **"Get my quote"**. Stored in `Lead.location`; `Lead.source` = `quote_form` | `contact_page` | `popup`.

## Callback pop-up (client report §1)
`components/forms/LeadPopup.tsx` — appears 10 s after landing, once per browser session, never on `/contact-us/`. Only Name + Phone + Submit, small close button, Esc/backdrop closes. On phones it's a bottom sheet (reduces Google intrusive-interstitial risk). Leads go through the same `/api/leads/` pipeline.

## Conversion tracking
See `docs/tracking.md`.
