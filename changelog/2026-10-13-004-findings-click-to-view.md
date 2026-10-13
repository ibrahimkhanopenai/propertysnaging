# 2026-10-13-004 — "Defects we find": click a finding to show it in the large photo

**Agent/Author:** Claude Code
**Task:** Client: in the "Defects we find — and what we recommend" section, clicking a card in the defect list should swap the large photo, together with its category, defect and recommendation.

## What changed
- New client component `components/home/FindingsExplorer.tsx`, which holds the featured photo + report card and the defect log.
  - All 6 findings are now in the log, including 01, so visitors can go back to the first one. Each row is a `<button aria-pressed>`.
  - Clicking a row updates the featured slot: photo, ordinal (01–06), category tag, defect (h3) and recommendation. The report card is `aria-live="polite"`.
  - The 6 photos are stacked and cross-faded (`opacity` transition), so a click never shows an empty frame.
  - Active row: mist background, copper rule on the start edge, copper ring on the thumbnail.
  - On mobile (log below the photo), a click scrolls the photo back into view. The scroll is instant under `prefers-reduced-motion`.
  - The copper annotation marker is drawn only on photo 01, because its position matches that photo (the torch-lit wall).
- `Findings.tsx` is now a thin server wrapper: header + items mapped to `{category, defect, fix, src, alt}` from the dictionary and `site.images.scope`. No copy changes, so the EN/AR dictionaries are untouched.
- Checked on the dev server by driving headless Edge through CDP. Before the click: finding 01 (moisture) is shown. After clicking row 04: the h3 reads "A power socket was loose at its termination.", only the electrical photo is visible, and `aria-pressed` is true only on row 04. Screenshot confirms. typecheck, lint and 87 tests pass.

## Files touched
- src/components/home/FindingsExplorer.tsx (new)
- src/components/home/Findings.tsx

## Decisions & why
- Thumbnails in the log use `alt=""`: the button's text already names the finding, and the featured photo carries the real ALT.
- Row headings became `<span>`s, because headings aren't valid inside `<button>`. The featured card keeps its `<h3>`, and the section `<h2>` is unchanged.

## Follow-ups / known issues
- No hint text such as "Select a finding". The highlighted row and hover state make the interaction clear. If the client wants a hint, it needs a new dictionary key in EN + AR.
