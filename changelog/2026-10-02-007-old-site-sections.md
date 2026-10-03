# 2026-10-02-007 — Old-site homepage sections + booking bar form

**Agent/Author:** Claude Code
**Task:** Bring five sections from the live propertyinspectors.me homepage into the new site, in the new design, using the existing copy; booking form must email the admin.

## What changed
- **Booking bar** under the hero: "Book now for inquiries and booking" — Name*, Email*, Phone*, type (Villa/Townhouse, Apartment, Commercial), Send. Saves the lead and emails the admin through `/api/leads/` (new `source: booking_bar`, email subject names the form). Tracks `generate_lead`.
- **Company intro** — "UAE's Leading Property Snagging & Inspection Company" (H2; the client's H1 stays in the hero) with the hand-and-city sketch.
- **About us** — "Setting the Standard for Property Snagging Services", photo in a purple frame, Get a quote + More about us.
- **Certified by InterNACHI** — the two InterNACHI seals + Government of Dubai logo as cards.
- **Developer logos** — 9 logos on a black band (logos are white PNGs).
- EN copy is the live site's own text (tiny grammar fixes only: "each completed over" → "who have each completed over", "ensuring … typically" → "with … typically"). AR copy translated from it.

## Files touched
- src/components/forms/BookingForm.tsx (new)
- src/components/home/{BookingBar,IntroSection,AboutSection,CertifiedSection,DevelopersStrip}.tsx (new)
- src/app/[locale]/page.tsx
- src/app/api/leads/route.ts
- src/lib/site.ts (`developers`, `images.intro`)
- src/i18n/dictionaries/{en,ar}.ts (`home.booking/intro/about/certified/developers`)
- docs/{client-requirements,design-system,forms-and-leads,assumptions-and-todo}.md

## Decisions & why
- The 12-section client order is untouched; new sections are slotted between them. Booking bar sits on the hero's bottom edge so Trust still follows the hero.
- Old H1 became an H2 (one H1 per page; the client-required H1 stays).
- Developer heading says we inspect homes by these developers — not "partners" (the old site's "authorised channel partner" disclaimer is a real-estate leftover and was not carried over).
- "Dubai Properties" logo skipped: the PNG has only the red tick.
- Reused existing `/wp-content/uploads/...` paths; no new assets.

## Follow-ups / known issues
- Local `.env` has no `SMTP_USER`/`SMTP_PASS`, so lead emails are skipped locally (lead is still saved). Tested: POST with `booking_bar` → 200, saved, test row deleted.
- Client to confirm the claims in the reused copy and the developer heading (see `docs/assumptions-and-todo.md`). Arabic needs native review.
