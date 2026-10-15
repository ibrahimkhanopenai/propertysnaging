# 2026-10-15-014 — Homepage hero: original "Properties in Dubai.png", uncompressed, more space under the hand

**Agent/Author:** Claude Code
**Task:** Client: use `Properties in Dubai.png` for the big "hand" image on the homepage. Do not compress it; use the original as-is. The hand has too little space below it (screenshot). Follow-up: "too zoomed, use the original image only, and test it".

## What changed
- **Image:** `Properties in Dubai.png` (repo root, 1671×941, 1.86 MB) is copied byte-for-byte to `public/images/hero-city-in-hand.png` (same MD5). Nothing is cropped or re-encoded.
  - Before, the hero was a JPEG q86 conversion of the same photo (`hero-city-in-hand.jpg`, 2026-10-13-006). That file was deleted; it was a rebuild-only file, not a legacy URL, and nothing else references it.
  - `site.ts` `images.hero` → `/images/hero-city-in-hand.png`. The ALT text is unchanged.
- **No compression (`Hero.tsx`):** the hero `<Image>` is `unoptimized`, so the browser receives the PNG file itself, not a WebP/AVIF re-encode by next/image.
- **Space under the hand:**
  - Cause: the booking card overlaps the hero by 40px (mobile) / 56px (md+), so it covered the bottom of the hand.
  - Fix: the photo frame now ends 1rem above the card overlap (`bottom-14 md:bottom-[4.5rem]`, `xl:h-[calc(100%-4.5rem)]`). Its bottom 0.75rem fades into the white (`.hero-photo` mask in `globals.css`). At xl it is combined with the existing inner-edge fade via `mask-composite: intersect`.
  - md–lg anchors the photo `right bottom` (was `right 65%`), so the bottom (the hand) is never the part that is cropped.
- **First attempt, replaced in the same task:** the image pasted in chat (a 1057×512 screenshot) was used at first. On desktop it was upscaled up to 1.6×, which the client saw as "too zoomed". The original 1671×941 file is now used, so it is never upscaled.
- **Tested** on the dev server (headless Edge via CDP, fresh profile, measured the real `naturalWidth` = 1671):

  | Width | Photo shown | Scale | Hand → card gap |
  |---|---|---|---|
  | 1920 | whole photo | 0.88× | 70px |
  | 1536 | whole photo | 0.74× | 61px |
  | 1366 / 1280 | whole photo | 0.69× | 57px |
  | 1024 | 99% width | 0.62× | 53px |
  | 768 | 82% width | 0.56× | 50px |
  | 412 | 34% width (background behind text, as before) | 0.72× | 60px |

  - Screenshots checked at 1920, 1366, 1024 and 412 (EN), and 1920 and 1440 (AR, mirrored).
  - typecheck, lint and 130 tests pass.
- Docs: `assumptions-and-todo.md` (hero path).

## Files touched
- public/images/hero-city-in-hand.png (new), public/images/hero-city-in-hand.jpg (deleted)
- src/lib/site.ts, src/components/home/Hero.tsx, src/app/globals.css
- docs/assumptions-and-todo.md

## Decisions & why
- **New `.png` name instead of overwriting the `.jpg`:** a PNG under a `.jpg` name would be served with the wrong type, and converting to JPEG is the compression the client asked to avoid.
- **Gap above the card instead of removing the card overlap:** the overlapping booking card is part of the agreed layout; ending the photo higher keeps it and frees the hand.
- **Mobile unchanged:** below md the photo stays a cropped background behind the text with the white scrim (existing design); the whole photo would be too small to read on a phone.

## Follow-ups / known issues
- **Page speed:** the hero PNG is 1.86 MB and is the LCP image. Before, next/image served ~40–200 KB. This is the client's choice ("don't compress"). If PageSpeed/LCP becomes a problem, removing `unoptimized` brings the WebP/AVIF versions back.
- `Properties in Dubai.png` in the repo root (untracked) is now the source of the hero; it can be deleted, since the site uses the copy in `public/images/`.
- Test-tool note: a leftover headless Edge from an earlier run once served a cached old file. Always use a fresh profile and make sure the browser exits.
