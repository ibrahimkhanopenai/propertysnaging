# 2026-10-02-008 — Official logo; old intro text moved into the hero

**Agent/Author:** Claude Code
**Task:** Use the client's logo; remove the separate "UAE's Leading Property Snagging & Inspection Company" section and put its text in the hero (no sketch image); keep old-site claims for now.

## What changed
- Logo: client PNG cleaned to transparent black (`public/images/logo.png`) + white copy for the footer (`public/images/logo-white.png`). `Logo.tsx` now renders it with `next/image`; schema `logo` uses it too.
- Removed `IntroSection` and the sketch image from the homepage. Its paragraph is now `home.hero.about` (EN + AR), shown under the hero statement.
- Old-site claims kept as written (client decision).

## Files touched
- public/images/logo.png, public/images/logo-white.png (new)
- src/components/layout/Logo.tsx
- src/components/home/Hero.tsx; src/components/home/IntroSection.tsx (deleted)
- src/app/[locale]/page.tsx
- src/lib/site.ts (`images.logo`, `images.logoWhite`; removed `images.intro`)
- src/i18n/dictionaries/{en,ar}.ts
- docs/{client-requirements,design-system,assumptions-and-todo}.md

## Decisions & why
- The client-required H1 and short statement stay; the old paragraph sits below them in smaller text so the CTAs remain above the fold.
- Old logo file under `/wp-content/uploads/...` left in place (legacy asset path rule).

## Follow-ups / known issues
- Still open: developer heading wording, full "Dubai Properties" logo.
