# 2026-10-02-006 — Black background for "Our services" and "Sample report"

**Agent/Author:** Claude Code
**Task:** Make the homepage "Our property inspection services" and "Sample inspection report" sections black with white text.

## What changed
- Services: section is `bg-ink` with white heading, `zinc-400` intro text and white "View all services" link. Cards stay white (dark text) so the photos and copy stay readable; hover border is now white.
- Sample report: section is `bg-ink` with white heading, `zinc-400` text, dark translucent field cards with white number badges, and light / ghost-light buttons. Purple photo frames unchanged.

## Files touched
- src/components/home/ServicesGrid.tsx
- src/components/home/SampleReportSection.tsx
- docs/design-system.md

## Decisions & why
- `SampleReportSection` is shared, so `/sample-report/` (and `/ar/sample-report/`) also gets the black version — keeps both places consistent.
- Purple stays on pictures only (client rule); no URL, heading-level or copy changes.

## Follow-ups / known issues
- Black now covers more of the homepage than the ≈12% guideline; confirm with the client.
