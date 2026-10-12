# 2026-10-12-001 — "Waterproofing" marker moved from the T-shirt to the wall

**Agent/Author:** Claude Code
**Task:** Client asked that the "Waterproofing" marker on the homepage "Real findings" photo point at the wall, not the inspector's T-shirt.

## What changed
- `Findings.tsx`: the copper marker dot now sits on the lit patch of wall where the inspector's torch is pointing (right of the raised fist). The "WATERPROOFING" label runs to the left of the dot over bare wall (order is now label → line → dot). The leader line is shorter (`w-10` → `w-6`). The marker still shows from md up only.

## Files touched
- src/components/home/Findings.tsx

## Decisions & why
- **Physical `right-`/`dir="ltr"` instead of logical `start-`:** the photo is not mirrored in Arabic, so the marker must stay on the same spot of the wall. With `start-`, it would have moved to the other side in RTL.
- The dot is on the torch spot because that is the defect the caption describes ("Elevated moisture was detected on the wall surface").
- Checked in headless Chrome at 768, 1024, 1440 and 1920 (EN) and 1440 (`/ar/`). At 1024px (narrowest photo, ~540px) the label just clears the cap.

## Follow-ups / known issues
- The position is tuned to `scope/paint-and-walls.jpg`. If that photo is replaced, or the featured finding (first item in `home.findings.items`) changes, re-check the marker position.
