# 2026-11-04-002 — Booking bar: open WhatsApp on submit (like the other forms)

**Agent/Author:** Claude Code
**Task:** The homepage "Get your free quote" booking bar only saved a lead; the client wants it to also open WhatsApp on submit, the same way the other forms already do.

## What changed
- **`BookingForm` now hands off to WhatsApp on submit**, matching `QuoteForm`/`LeadPopup`:
  - After the Name/Phone validation passes, it opens `https://wa.me/<whatsapp>?text=…` **synchronously inside the click** (before the background fetch) so popup blockers let it through.
  - Pre-filled message: intro line + Name, Phone, and Property type (when chosen). Intro and labels are reused from `dict.quote` (`waIntro`, `name`, `phone`, `propertyType`, `types`) — no new dictionary strings, so EN + AR both work.
  - The lead is still saved + emailed: the `/api/leads/` POST now runs in the background with `keepalive: true` (was `await`ed before), and the success/error status line is unchanged.
  - `generate_lead` now also carries `method: "whatsapp"` (same convention the pop-up uses).
- **`BookingForm` props:** `types` → `q: Dictionary["quote"]` (the select options now read `q.types`), plus a new `whatsapp: string`.
- **`BookingBar`** is now an async server component: it reads `getSettings()` and passes `whatsapp={cfg.whatsapp}` and `q={dict.quote}` to the form. (Same source the other forms use for the number.)
- Docs: `docs/forms-and-leads.md` booking-bar entry updated (was "No WhatsApp hand-off").
- Checks: typecheck + lint pass.

## Files touched
- src/components/forms/BookingForm.tsx
- src/components/home/BookingBar.tsx
- docs/forms-and-leads.md

## Decisions & why
- **Reused `dict.quote` labels** instead of adding `waIntro`/labels to `home.booking`: keeps one source for the WhatsApp copy, avoids EN/AR drift, and the text ("Hi Property Inspectors, I'd like a quote…", "Your name", "Mobile number", "Property type") fits the booking bar fine.
- **Background `keepalive` fetch** (not `await`): the WhatsApp tab opens immediately; the lead save continues even as focus moves to WhatsApp — same pattern as `QuoteForm`.
- **Kept the success/error status line.** The pop-up dropped its states because it has no DB save; the booking bar still saves, so the "Thank you…" confirmation stays useful.
- **Number from `getSettings()`**, so changing the WhatsApp number in the admin updates this form too (consistent with QuoteForm/LeadPopup).

## Follow-ups / known issues
- Success copy ("…we'll contact you shortly") was left as-is; it reads fine even though WhatsApp now opens. Change it later if the client wants it to mention WhatsApp like the full quote form does.
- `npm run build` not re-run this session.
