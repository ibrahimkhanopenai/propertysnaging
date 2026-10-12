# 2026-10-12-005 — Larger footer logo

**Agent/Author:** Claude Code
**Task:** Make the footer logo bigger so the small "INSPECTORS.ME" line under "PROPERTY" is readable.

## What changed
- `Logo` has a new `large` prop: height `h-20` (80px) on mobile and `md:h-24` (96px) from md up, compared with `h-14`/`md:h-16` before. That is about 1.5× bigger. `sizes` was updated to match.
- The footer uses `<Logo inverted large />`. The header logo is unchanged.
- Homepage only: the gap above the footer logo was too big. The final CTA (`FinalCta`, the last homepage section, also black) had `md:py-24` bottom padding, which stacked on the footer's `py-16`, giving 160px of empty black. CTA bottom padding is now `pb-6 md:pb-8`, so the gap is about 96px. Checked with a headless Edge screenshot at 1920px.

## Files touched
- src/components/layout/Logo.tsx
- src/components/layout/Footer.tsx
- src/components/home/FinalCta.tsx

## Decisions & why
- Only the footer changed. A taller logo in the header would make the sticky header taller.

## Follow-ups / known issues
- None. If the footer logo needs to be bigger still, `md:h-28` fits in the first footer column.
