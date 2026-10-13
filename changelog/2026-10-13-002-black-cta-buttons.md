# 2026-10-13-002 — CTA buttons black instead of copper

**Agent/Author:** Claude Code
**Task:** Client: the copper/gold button backgrounds ("Get my free quote", "Get my quote") should be black across the whole site. Only the buttons that were copper change.

## What changed
- `ButtonLink` `cta` variant: `bg-brand-dark hover:bg-brand-deep` → `bg-ink hover:bg-ink-soft`. This covers the homepage hero "Get my free quote" and the location-page hero CTA.
- Form submit buttons → `bg-ink hover:bg-ink-soft`: `BookingForm` (booking bar "Get my quote"), `QuoteForm` (final CTA + contact page), `LeadPopup`.
- `SampleReportSection` "Book your inspection" (homepage, `/sample-report/`, location pages) sits on a black section, where a black button would disappear. It now uses the white `light` variant (white bg, black text), the site's convention on dark bands.
- Copper stays for everything that is not a button (kickers, numerals, markers, hairlines, tags, focus states).
- `globals.css` token comment and `docs/design-system.md` (rule, token table, `ButtonLink` note) updated.
- Checked on the dev server (headless Edge, 1440px): hero, booking bar and popup buttons are black. typecheck + lint pass.

## Files touched
- src/components/ui/Button.tsx
- src/components/forms/{BookingForm,QuoteForm,LeadPopup}.tsx
- src/components/home/SampleReportSection.tsx
- src/app/globals.css, docs/design-system.md

## Decisions & why
- **White, not black, on the black Sample report section:** a black button on `bg-ink` has no contrast. Next to it, "Download sample report" stays the white-outline `ghostLight`.
- `cta` is kept as its own variant (same look as `primary` now) so the lead CTAs can be restyled in one place later.

## Follow-ups / known issues
- `brand-deep` is now unused. The token is kept, so nothing else is affected.
