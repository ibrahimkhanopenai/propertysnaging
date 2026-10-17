# Design system — Black & White + green accents (client-approved, Oct 2026)

## Principles
- **Client rule: black & white theme; copper is the single brand accent** — kickers, numerals, markers, hairlines, tags, image hover rings, form focus, active/focus states. Never for headings or nav. **No copper buttons** (client 2026-10-13): lead CTAs (`cta` variant) and form submits are black `ink`; on black sections the lead CTA uses the white `light` variant.
- Mostly white. Black is reserved for: top bar, primary buttons, the "most popular" persona card, stats strip, Google rating box, CTA band, homepage "Our services" and "Sample report" sections, Why choose us, footer.
- It's a **snagging** company: show real inspection photos and defects, not skylines/luxury villas (skylines only on location cards).
- One memorable moment per section; no decorative gradients or scroll animations.

## Tokens (`src/app/globals.css`)
| Token | Hex | Use |
|---|---|---|
| ink | #0A0A0A | text, primary buttons, dark bands |
| ink-soft | #27272A | hover on ink |
| paper | #FFFFFF | background (~70%) |
| mist | #F5F5F4 | alternate sections (~18%) |
| line | #E4E4E7 | borders |
| muted | #52525B | body text on white |
| subtle | #71717A | captions |
| wa | #15803D | WhatsApp buttons ONLY |
| snag | #B91C1C | errors / defect tags ONLY |
| brand | #C96A32 | COPPER — kickers, numerals, markers, hairlines, tags, form focus, image hover ring |
| brand-dark | #A1521F | copper text on white (5.6:1) — not used for buttons |
| brand-deep | #8A4519 | unused (was the copper CTA hover) |
| brand-light | #E7A877 | copper tint for dark backgrounds (ordinals on `bg-ink`, etc.) |
| brand-tint | #FBF1EA | subtle copper fill (badges, tag backgrounds, price box) |
| brand-line | #EDCCB2 | form input borders, soft hairlines |

## Type
- EN: Manrope 600–800 (headings, `font-display`) + DM Sans 400–600 (body).
- AR: IBM Plex Sans Arabic 400–700 for both.
- Headings use `text-balance`, tight tracking; body 16–18px, line-height 1.6–1.8.

## Homepage section order (client requirement — do not reorder)
Top bar → Header → Hero (H1, statement, company description from the old site, Get a quote / Book an inspection / WhatsApp, phone) → Booking bar (purple-accent form card) → Trust stats & credentials (DED + InterNACHI seals as large 4:3 plates) → Our services (black) → What we inspect → Real photos / common defects → Sample report (black) → Process → About us (mist, purple photo frame) → Why choose us (black) → Developer logos (black — logos are white) → Emirates we cover → Reviews (live Google reviews widget) → FAQ → Final CTA with quote form (black + purple form) → Footer (black)
Global: floating Call/WhatsApp (desktop), bottom bar (mobile), 10-second callback pop-up.

## Components
`ButtonLink` (variants: primary, **cta**, outline, whatsapp, light, ghostLight — `cta` = the one lead action per section, black `ink` (white `light` on black sections); WhatsApp buttons stay green `wa`; CRO audit 2026-10), `Container` (near full width: max 1920px, gutters 16→24→40→64px), `SectionHeading`, `Icon` (inline SVG), `PageHero`, `ContentPage`, `Faq`, `PostCard`.
Radius: 12px buttons, 16–18px cards, 22–24px large panels. Min touch target 44px.

**Header dropdowns (desktop, `Header.tsx`, CSS only):**
- Each nav item spans the full header height, so the mouse never leaves it on the way down to its menu.
- Hover intent: a menu opens after 100 ms, the Locations list closes 200 ms after the mouse leaves, and the full-width Services panel after 500 ms (long diagonal paths to its far columns). Keyboard focus opens at once.
- The Locations list closes at once when Services is hovered.
- Don't add a gap between the nav and the menus, and don't give the panels different z-indexes; both rules were tested in a browser, see changelog 2026-10-17-021.

## Section patterns (inspired by propertyinspectiondxb.com, Oct 2026 — order and colours unchanged)
- **Service cards:** real inspection photo on top (4:3, purple inner ring + slight zoom on hover), title, summary, "Read more →". Photo/ALT pairing in `ServicesGrid.tsx` → `site.images.scope` + `home.services.photoAlt`.
- **Icon cards** ("What we inspect"): icon in a round `mist` badge that turns `ink` on hover.
- **Photo grid:** 12 square photos, 2/3/4 columns.
- **FAQ:** boxed accordion items; the open item gets an `ink` border, `mist` background and a black round +/× toggle.
- **Contact block** in the final CTA: address (Google Maps link), phone and email, each with a round icon.
- **Footer:** "Get in touch" with icons + a 6-thumbnail photo-gallery column (Admin → Gallery, falls back to `site.defaultGallery`).
