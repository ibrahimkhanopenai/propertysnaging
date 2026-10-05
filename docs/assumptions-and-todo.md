# Assumptions & TODO before launch

## DUMMY data (replace — all in `src/lib/site.ts` unless noted)
| Item | Current value | Where |
|---|---|---|
| Email | info@propertyinspectors.me | `site.email`, `.env LEAD_NOTIFY_TO` |
| Opening hours | Mo-Sa 08:00-20:00 | `site.hours` |
| DED licence no. | DED-000000 | `site.dedLicense` |
| Social links | guessed URLs | `site.social` |
| Stats | 1,500+ inspections, 10+ years, 300+ points | `site.stats` (`genuine:false`) — client requires GENUINE numbers. ⚠️ Live site (mypropertysnagging.com) states **60,000+ inspections / 12,000+ hrs** — big discrepancy, confirm real figures (not changed/fabricated) |
| Google rating | 4.9 placeholder | `site.reviews.rating` — now **hidden on the homepage** while `isPlaceholder` is true |
| Google review link | Maps search URL | `site.googleReviewUrl` — use the real profile / review link |
| Reviews | 3 real testimonials carried from the live site | `site.defaultReviews` (shown until Admin → Reviews has entries); ratings represented as 5★ (source had none) — confirm |
| Homepage "Real findings" | defect/recommendation copy cleaned from the live site | `home.findings` in `en.ts`/`ar.ts` — confirm wording |
| Price | 10 AED per bedroom | `.env PRICE_PER_BEDROOM` |
| GTM / GA IDs | empty | `.env` — copy from WordPress |
| Arabic copy | first draft | `ar.ts`, `pages.ar.ts` — native review needed |

## Assumptions made
- Hosting is a self-managed Node server ("local") — no Vercel-specific features used.
- MySQL is required, so Payload CMS was not used (it has no MySQL adapter); admin is custom.
- Download pages (`/sample-report/` etc.) link straight to the existing PDFs.
- `/download-brochure/` uses the company profile PDF (no separate brochure PDF found).
- Images reuse the current site's photos (paths in `site.images`); hero = client-supplied `/images/hero-city-in-hand.jpg` (2026-10-02; the earlier inspector photo `20251122_142826-scaled.jpg` is still in /public).
- Logo = client-supplied PNG (`/images/logo.png`, white version `/images/logo-white.png` for the footer). Swap for an SVG if one becomes available.

## Open tasks
- [ ] **Confirm domain**: report says propertyinspectors.ae, live site is .me (see `docs/client-requirements.md`)
- [ ] Confirm sample report images have all client personal data removed
- [ ] Write the 10 blog drafts (`npm run blog:drafts`) and genuine developer pages
- [ ] Replace all DUMMY values above
- [ ] Native Arabic review
- [ ] Meta parity with `docs/legacy-seo.json`
- [ ] Real Google reviews (Places API or manual)
- [ ] Optional: Arabic translations of the 5 imported blog posts
- [ ] Confirm the developer logo strip wording ("We snag homes by the UAE's leading developers") — logos imply inspections in those projects, not a partnership
- [ ] Re-export the "Dubai Properties" logo (current PNG only contains the red tick, so it is hidden)
- [ ] Homepage hero/About copy uses the old site's claims ("one of the best and most trusted", "10,000 hours" per engineer) — client OK'd for now (2026-10-02); revisit before launch
- [ ] **Brand/contact decision**: the redesign brief calls the business "My Property Snagging" (mypropertysnagging.com, +971 55 412 1205) but the local project is "Property Inspectors" (propertyinspectors.me, +971 58 155 1637). Local identity kept (header/footer/`site.ts` untouched). Confirm whether to switch brand/phone — see `changelog/2026-10-03-010-homepage-premium-redesign.md`
- [ ] Confirm the real inspection stats vs the live site's 60,000+/12,000+ (Stats row above)
- [ ] Confirm the 3 default testimonials + the "Real findings" defect/recommendation wording carried from the live site
