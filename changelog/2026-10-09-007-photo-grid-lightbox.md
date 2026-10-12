# 2026-10-09-007 — Photos shown whole, click to open full size

**Agent/Author:** Claude Code
**Task:** Client feedback on the homepage photo section: "Photos are not complete and we are unable to click and open the full image."

## What changed
- **Homepage photo grid (`PhotosSection.tsx`):** the mosaic of wide and short frames was replaced by a uniform grid of 4:5 portrait frames. It has 2 columns on phones and 4 on md+, and shows 8 photos (was 7). All our photos are portrait phone shots (0.75–0.8 ratio), so heads and bodies are no longer cut off. Small 400×500 photos are no longer stretched into a wide frame, which is why photo 01 looked blurry.
- **New `components/ui/Lightbox.tsx`:** click a photo to open it full size (`object-contain`). It has prev/next buttons, a "3 / 8" counter, the caption, arrow keys (mirrored in Arabic/RTL), and Esc or backdrop click to close. Focus moves to the close button, stays inside the viewer, and goes back to the clicked photo on close. Page scroll is locked while it is open.
  - The grid stays server-rendered. Each tile is a `<button data-lightbox="i">`, and the client wrapper catches the click.
  - The viewer is portalled to `<body>`. Sections animate with `transform`, which kept `position: fixed` inside the section instead of covering the screen.
- A small magnifier badge on each photo shows that it can be opened. It is always visible on phones and appears on hover on desktop.
- **Gallery page (`/gallery/`):** every photo opens in the same viewer, and prev/next runs through all categories in page order.
- Copy: new `lightbox` keys (open/close/prev/next) in both dictionaries.

## Files touched
- src/components/ui/Lightbox.tsx (new), src/components/home/PhotosSection.tsx, src/app/[locale]/gallery/page.tsx
- src/i18n/dictionaries/{en,ar}.ts, docs/client-requirements.md

## Decisions & why
- Own small component, no lightbox library (AGENTS.md: no new UI libraries, keep JS small).
- Only url/alt/caption are passed to the client component, not whole DB rows.
- Tested in headless Chrome: home (1440 and 390 mobile), `/gallery/`, and `/ar/`. Open, next and close work, focus returns, and scroll unlocks.

## Follow-ups / known issues
- Most photos are only 400×500 px, so they look soft when opened full screen. Larger originals from the client would fix this (overwrite the same file names, or upload in Admin → Gallery).
- The homepage shows Admin → Gallery photos marked "featured". Mark 8 photos as featured for a full grid (with fewer, the last row is shorter).
