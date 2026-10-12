# 2026-10-09-006 — New logo, fuller header nav, lighter hero with the whole hand

**Agent/Author:** Claude Code
**Task:** Client feedback on the homepage: bigger logo (new files supplied in `logo/`), FAQ/Blog/Sample report/Gallery missing from the header, hero background "too white" (photo should show lightly behind the text), and "complete the hand image".

## What changed
- **Logo:** `public/images/logo.png` is now `logo/Black-Logo-Transperant.png` (the transparent one) cropped to its content and resized to 1200×451. `logo-white.png` is the same file with a white fill, for the footer. `Logo.tsx`: new size, `h-11 md:h-12` → `h-14 md:h-16`.
- **Favicon:** `src/app/icon.jpg` and `apple-icon.jpg` were rebuilt from `logo/Black Icon.png`. The icon is centred and fills the square; the old one was small and off-centre.
- **Header nav:** Home, Services, Locations, About, **Sample report, Gallery, Blog, FAQs**, Contact. The mobile menu uses the same list. Nav links no longer wrap, and the padding is slightly tighter below 2xl. At xl (1280–1535px) the header phone number is hidden so everything fits on one line; the top bar always shows it.
- **Bug fix (existing):** the header WhatsApp and "Get a quote" buttons showed on phones and pushed the menu button off-screen (visible in the client's phone screenshot). Cause: `cn()` only joins strings, so `hidden` lost to ButtonLink's base `inline-flex`. Now they use `max-lg:hidden` / `max-sm:hidden`.
- **Hero:** the white wash is now 82% → transparent instead of solid white over the left 40%, so the photo shows behind the text. From md up the hero height is `clamp(600px, 50vw, 900px)` and the photo is anchored at `right 65%`, so the whole hand and the Burj Khalifa tip are in frame from 768px to 1920px wide.
- Docs: client-requirements (nav row), assumptions-and-todo (logo, stock collage).

## Files touched
- public/images/logo.png, public/images/logo-white.png, src/app/icon.jpg, src/app/apple-icon.jpg
- src/components/layout/{Logo.tsx,Header.tsx,nav.ts}, src/components/home/Hero.tsx
- docs/{client-requirements,assumptions-and-todo}.md

## Decisions & why
- **Transparent logo over the `-COPIED` ones:** the COPIED files have a solid white background, which would show as a white box on the dark footer.
- **Reviews not added to the header:** the client's mockup has it, but their message lists only FAQ, Blog, Sample report and Gallery. Ten items would not fit at 1280px. Reviews stays in the footer.
- Checked with headless Chrome at 1280, 1440, 1536 and 1920 (desktop), and 360 and 390 (mobile emulation, no horizontal scroll).

## Follow-ups / known issues
- Waiting on the client: original photos for the Sample report collage (`/images/reports/sample-report-page-{1,2,3}.jpg`, stock) and the About photo (`/images/about/property-handover.jpg`, Unsplash watermark). Replace them by overwriting the same file names.
- "Blue t-shirt image" (point 3) is not changed yet. `gallery/external-works-inspection.jpg` and three other gallery photos show an inspector in a navy shirt, not the branded white polo. Need the client to say whether to remove them or keep them.
- On phones the hero shows the skyline, not the whole hand: a portrait screen can't fit the wide photo.
- `logo/` (source files) is untracked; delete it or keep it outside the repo once the client confirms the logo.
