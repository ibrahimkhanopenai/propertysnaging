# Design system — Black & White + purple accents (client-approved, Oct 2026)

## Principles
- **Client rule: black & white theme; purple is used for pictures and forms only** (image frames/hover rings, form panels, inputs, form buttons, pop-up). Never for headings, nav or generic buttons.
- Mostly white. Black is reserved for: top bar, primary buttons, the "most popular" persona card, stats strip, Google rating box, CTA band, footer.
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
| brand | #6D28D9 | PURPLE — form buttons, input focus, image frames |
| brand-dark | #5B21B6 | purple hover / price text |
| brand-tint | #F5F3FF | price box, image placeholders |
| brand-line | #DDD6FE | form input borders |

## Type
- EN: Manrope 600–800 (headings, `font-display`) + DM Sans 400–600 (body).
- AR: IBM Plex Sans Arabic 400–700 for both.
- Headings use `text-balance`, tight tracking; body 16–18px, line-height 1.6–1.8.

## Homepage section order (client requirement — do not reorder)
Top bar → Header → Hero (H1, statement, Get a quote / Book an inspection / WhatsApp, phone) → Trust stats & credentials → Our services → What we inspect → Real photos / common defects → Sample report → Process → Why choose us (black) → Emirates we cover → Reviews (scrolling) → FAQ → Final CTA with quote form (black + purple form) → Footer (black)
Global: floating Call/WhatsApp (desktop), bottom bar (mobile), 10-second callback pop-up.

## Components
`ButtonLink` (variants: primary, outline, whatsapp, light, ghostLight), `Container` (max 1240px), `SectionHeading`, `Icon` (inline SVG), `PageHero`, `ContentPage`, `Faq`, `PostCard`.
Radius: 12px buttons, 16–18px cards, 22–24px large panels. Min touch target 44px.
