# 2026-10-12-004 — Commercial priced per sq ft, GTM-N2BF4B58 final, tests updated

**Agent/Author:** Claude Code
**Task:** Follow-up to 2026-10-12-003 with the client's answers: keep the GTM container used on truecheckinspection.com, and use the same AED/sq ft rate for every property type, commercial included.

## What changed
- `estimatePrice(areaSqft, ratePerSqft)`: the property-type argument is removed. Commercial now gets `BUA × PRICE_PER_SQFT` like apartments and villas. The quote form and `/api/leads/` were updated to match.
- GTM: `GTM-N2BF4B58` is confirmed final in docs (tracking, assumptions, seo-migration launch checklist). `GTM-MCTLKNHC` is not used.
- Tests (missed in 003, which only ran typecheck + lint):
  - `utils.test.ts`: price tests rewritten for area × rate (rounding, 100 sq ft minimum, no area, no rate).
  - `leads-api.test.ts`: sets `PRICE_PER_SQFT`. Covers area pricing, commercial pricing, no price without area or rate, handover date + gclid/UTM stored and in the email, and a malformed date rejected.
  - `gtm.test.tsx`: uses the final container ID and adds Clarity snippet tests (valid ID renders; bad IDs render nothing).
- `npm test`: 14 files, 87 tests pass. typecheck + lint pass.

## Files touched
- src/lib/estimate.ts, src/components/forms/QuoteForm.tsx, src/app/api/leads/route.ts
- tests/unit/{utils,leads-api,gtm}.test.ts(x)
- docs/{forms-and-leads,tracking,assumptions-and-todo,seo-migration}.md

## Decisions & why
- "Price on request" now shows only when `PRICE_PER_SQFT` is missing on the server. Without an area the form asks for it.

## Follow-ups / known issues
- Google Ads conversion tags need access to the GTM container and the Google Ads account; neither is available through the WordPress login.
- Deploy steps from 003 still apply: `npm run db:deploy` first, then update the server `.env` and rebuild.
