# 2026-10-09-005 — Pop-up: Name, bedrooms and BUA, Submit opens WhatsApp

**Agent/Author:** Claude Code
**Task:** Client asked that the first-visit pop-up take Name, No. of bedrooms and BUA (sq ft), and that Submit open WhatsApp.

## What changed
- `LeadPopup.tsx`: the phone field was removed. New fields are a **No. of bedrooms** select (Studio, 1–7 BR) and **BUA (sq ft)** (number input). Name and bedrooms are required; BUA is optional.
- Submit opens `wa.me/<site.whatsapp>` in a new tab with the details pre-filled (intro line, name, bedrooms, BUA), fires `generate_lead` (`form_id: "popup"`, `method: "whatsapp"`) and closes the pop-up. No more success/error states.
- The pop-up no longer posts to `/api/leads/`, so nothing is saved to MySQL and no email is sent.
- Layout passes `whatsapp={site.whatsapp}` instead of `locale`.
- Pop-up copy rewritten in both dictionaries ("Get a quick quote on WhatsApp" / "احصل على عرض سعر سريع عبر واتساب").
- Docs: forms-and-leads, tracking, client-requirements.

## Files touched
- src/components/forms/LeadPopup.tsx, src/app/[locale]/layout.tsx, src/i18n/dictionaries/{en,ar}.ts
- docs/{forms-and-leads,tracking,client-requirements}.md

## Decisions & why
- **No DB save:** `Lead.phone` is required, and the client dropped the phone field. WhatsApp already gives us the sender's number, so the chat is the lead.
- **BUA optional:** many buyers don't know their built-up area, and requiring it would lose leads. The engineer can ask in the chat.
- WhatsApp opens inside the submit handler (same as `QuoteForm`), so popup blockers allow it. Button stays purple (forms rule in the design system).
- `"popup"` stays in the `/api/leads/` source enum and the email labels because old rows use it.

## Follow-ups / known issues
- If the visitor closes WhatsApp without sending, the lead is lost, and `generate_lead` has already fired. In GTM, treat popup `generate_lead` as "WhatsApp opened", not a confirmed lead.
- Not tested on a real phone. Check that WhatsApp opens the app on iOS/Android.
