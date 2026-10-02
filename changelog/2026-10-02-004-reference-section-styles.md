# 2026-10-02-004 — Homepage sections restyled after propertyinspectiondxb.com

**Agent/Author:** Claude Code
**Task:** Use propertyinspectiondxb.com's section styles on our site (user chose: restyle only, keep the client's section order and colours; no logo strip).

## What changed
- Services: image-topped cards with real inspection photos, summary, "Read more →" (EN/AR ALT text in dictionaries).
- What we inspect: icons in round badges, hover lift.
- Real photos: 12 square photos in a 2/3/4-column grid (4 more real photos added to `site.defaultGallery`).
- FAQ (shared component, all pages): boxed accordion items with a round +/× toggle.
- Final CTA: contact block (address → Google Maps, phone, email) with round icons.
- Footer: "Get in touch" with icons, plus a 6-thumbnail photo-gallery column linking to `/gallery/`.

## Files touched
- src/components/home/{ServicesGrid,WhatWeInspect,PhotosSection,FinalCta}.tsx
- src/components/pages/Faq.tsx
- src/components/layout/Footer.tsx (now async — reads the gallery)
- src/lib/site.ts (`mapsUrl`, 4 more gallery photos)
- src/i18n/dictionaries/{en,ar}.ts (`home.services.readMore/photoAlt`, `home.cta.address/phone/email`, `footer.contact/gallery`)
- docs/design-system.md

## Decisions & why
- Section order, black/white theme and "purple = pictures + forms" rules kept (docs/client-requirements.md); only layout patterns borrowed. No copy or images taken from the reference site.
- "Who we work with" logo strip skipped: no genuine partner logos (client rule: no fake trust signals).
- Property-type icon grid and "Why snagging matters" not added, because that would change the section order.

## Follow-ups / known issues
- `npm run build` couldn't run because the running dev server locks the Prisma engine DLL. typecheck + lint pass; `/`, `/ar/`, `/faqs/` render 200 on the dev server. Stop dev and run `npm run build` before deploying.
- `mapsUrl` is a search link; replace with the real Google Business Profile link when available.
