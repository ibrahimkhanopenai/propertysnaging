# 2026-10-02-005 — Full-width layout

**Agent/Author:** Claude Code
**Task:** Remove the large empty left/right space so the site uses the full screen width.

## What changed
- `Container` max width 1240px → 1920px, with responsive side gutters (16px mobile, 24px sm, 40px lg, 64px 2xl). All pages, header, footer use it, so the change is site-wide.
- Header mega-menu dropdown widened (max 1400px) to match.

## Files touched
- src/components/ui/Container.tsx
- src/components/layout/Header.tsx
- docs/design-system.md

## Decisions & why
- Kept a 1920px cap (not unlimited) so text lines and the hero image don't stretch too far on ultra-wide monitors.

## Follow-ups / known issues
- Check sections with long paragraphs on wide screens; they keep their own `max-w-*` text widths.
