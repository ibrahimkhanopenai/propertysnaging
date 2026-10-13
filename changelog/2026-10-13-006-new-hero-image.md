# 2026-10-13-006 — New homepage hero image, shown smaller so the hand is fully visible

**Agent/Author:** Claude Code
**Task:** Client: replace the homepage hero image ("Property Snagging & Inspection Services in the UAE") with `Properties in Dubai.png`. The old image showed too large, so the hand was cut off; show it a little smaller, but not too small.

## What changed
- **Image:** `Properties in Dubai.png` (1671×941, 1.8 MB PNG) saved as JPEG q86 (207 KB) over the same file, `public/images/hero-city-in-hand.jpg` (AGENTS.md §5.10: replace by overwriting the same name). `site.ts` and the ALT ("Hand holding a model of the Dubai skyline…") still fit, so they are unchanged.
- **Sizing (`Hero.tsx`):** from `xl` (≥1280px) the photo frame has the photo's own aspect ratio (`aspect-[1671/941]`) at full hero height and is anchored to the end edge. The whole photo shows uncropped, about 17% narrower than the full-bleed version at 1920px. Before, `object-cover` on the full width cropped the bottom and cut the fingers, and at 1440px the booking bar also covered them. `sizes` updated to `(min-width: 1280px) 1600px, 100vw`.
- **Edge fade (`globals.css` `.hero-photo`, xl only):** a CSS mask fades the photo's inner edge into the white behind the text, so there is no hard image edge.
- **Arabic (xl):** the frame is mirrored (`xl:rtl:-scale-x-100`), so the hand reaches in from the right and the towers sit on the left, next to the right-aligned text. The mask flips with it. The photo has no lettering, so mirroring is safe.
- Below `xl` (mobile/tablet) the layout is unchanged: full-bleed + the existing white scrim. At those sizes the photo is barely cropped vertically.
- Checked on the dev server (headless Edge): 1920, 1440, 1280 (EN) and 1440 (AR) show the whole hand with water below it and no booking-bar overlap; 1024 and ~500px are fine. typecheck + lint pass.

## Files touched
- public/images/hero-city-in-hand.jpg (overwritten)
- src/components/home/Hero.tsx
- src/app/globals.css

## Decisions & why
- Same file name instead of a new path: keeps `site.ts`, OG/preload references and the "replace by overwriting" convention.
- No change below xl. Hero height there is `clamp(600px, 50vw, …)`, which crops the photo only a little.

## Follow-ups / known issues
- The source `Properties in Dubai.png` is still in the repo root (untracked). It can be deleted; the site uses the JPEG.
