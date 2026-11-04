# 2026-11-04-006 — Remove Key Figures from location pages + Admin → Locations save feedback

**Agent/Author:** Claude Code
**Task:** (1) Remove the **whole** Key Figures / stats strip from location pages (earlier only the "15,000+ Properties inspected" stat was filtered out — the client wanted the entire section gone). (2) Admin → Locations: Save/Add had no visible feedback, so it wasn't clear the click registered or the save succeeded — add it.

## What changed

### Location pages — Key Figures section removed (`src/components/pages/LocationPage.tsx`)
- Deleted the entire `KEY FIGURES` `<section>` (the `10+ / 300+ / 6–24h / 10,000+` strip, and the `15,000+` that was already filtered). No condition/filter left behind — the whole block is gone, so nothing can reappear.
- The stats config (`site.ts stats`) is untouched; the **homepage still shows all five figures**. Only location pages drop the strip.
- Docstring updated (no more "key figures" in the section flow).

### Admin → Locations — save feedback (`src/components/admin/SubmitButton.tsx` + `locations/page.tsx`)
- New **`SubmitButton`** client component: uses `useFormStatus()` to show a pending label ("Saving…/Adding…/Loading…") and disable the button while the server action runs, then briefly flashes a confirmation ("Saved ✓/Added ✓/Loaded ✓"). Rendered inside each server-action form.
- Wired into the **Add**, per-row **Save**, and **Load defaults** buttons for both Communities and Areas. Delete stays a plain button (removing the row is its own feedback). Drag-reorder already had its own `aria-live` status in `SortableList`.
- Updated the Areas list help text ("Area chips" → "Areas shown on the location page (name + optional description)") since areas now render as a list, not chips.

## Files touched
- src/components/pages/LocationPage.tsx
- src/components/admin/SubmitButton.tsx (new)
- src/app/admin/(panel)/locations/page.tsx

## Decisions & why
- **Whole section removed, not filtered** — matches the clarified request and the "no leftover condition/trash" rule; the `inspections` filter from changelog 005 is gone.
- **`useFormStatus` SubmitButton over converting each row to `useActionState`** — the rows are plain server-action forms rendered in a server component (inside `SortableList`); a small client button island gives pending + "saved" feedback without restructuring every form. The saved flash covers the case where a Save doesn't visibly change the row.
- **Homepage figures kept** — the client only asked to remove them from location pages.

## Follow-ups / known issues
- Checks pass: `npm run typecheck`, `npm run lint`, `npm run build` (90/90 pages). (`SubmitButton` has no logic in the lib coverage set, so `test:coverage` is unaffected.)
- Same `SubmitButton` could later be reused on other admin list screens (FAQs, findings, redactions) if they want the same feedback — not done here (out of scope).
