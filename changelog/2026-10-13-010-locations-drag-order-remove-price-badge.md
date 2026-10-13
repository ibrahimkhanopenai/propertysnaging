# 2026-10-13-010 — Admin Locations: drag to reorder; price badge removed from location pages

**Agent/Author:** Claude Code
**Task:** Client: (1) in Admin → Locations, change the order by dragging rows up/down instead of typing numbers; (2) remove the "From AED 0.70 per sq ft / See your price instantly in the form below" badge, so competitors don't see the price.

## What changed
- **Price badge removed** from the location page hero (`LocationPage.tsx`; it sat on the corner of the hero photo, all 7 emirates, EN + AR). The `getPricing()` call there and the dictionary keys `pageUi.priceFrom` / `priceNote` (EN + AR) are gone.
- **Drag to reorder** (`src/components/admin/SortableList.tsx`, client, no library):
  - Each row has a ⠿ handle. Drag it with a mouse or finger; the list reorders live and the new order saves when you let go.
  - Keyboard: focus the handle and press ↑/↓.
  - The page scrolls when you drag near the top/bottom edge.
  - A status line shows "Saving order…" / "Order saved". If the save fails, the old order comes back with an error.
  - Rows are keyed by id, so unsaved edits in other rows survive a move.
  - Move/up are tracked on `window`: React moves the dragged row in the DOM, which drops pointer capture. The first version used capture and stopped halfway; found and fixed in the test.
- **Admin → Locations:** the Order fields are gone (add form and rows). "Add" is now "Add to the end".
- **Actions:**
  - New `reorderLocationItemsAction(ids)`. It checks admin, integer ids with no duplicates, and that all rows exist in the same emirate + list. It then writes sortOrder 1…n in one transaction and regenerates that location page (EN + AR).
  - `saveLocationItemAction` no longer touches sortOrder when editing. A new row gets max + 1, so it goes to the end.
- Docs: `admin-cms.md` (Locations: drag order).
- **Checked on the dev server** (headless Edge, real mouse and key events). Test changes were reverted; the Dubai order is the same as before.
  - EN + AR Dubai pages have no price badge. The admin has no Order fields.
  - Dragging community 1 below row 3 saves the new order: it survives a reload and shows on the public Dubai page.
  - ↑↑ on the moved row's handle restores the original order.
  - "Add to the end" appends; the test row was deleted through the admin.
  - Results: 107 tests, typecheck and lint pass.

## Files touched
- src/components/pages/LocationPage.tsx
- src/i18n/dictionaries/{en,ar}.ts
- src/components/admin/SortableList.tsx (new)
- src/app/admin/(panel)/locations/page.tsx, src/app/admin/actions.ts
- docs/admin-cms.md

## Decisions & why
- **Own drag code, not a library** (AGENTS.md §6: no new UI libraries). Pointer events cover mouse and touch; the arrow keys cover keyboard users.
- **Saved at once on drop:** no separate "Save order" button to forget. Same as the other admin lists.
- **Only Locations** got drag ordering, as asked. Developer logos still have a number field; `SortableList` can be reused there.

## Follow-ups / known issues
- **The price is still public in the quote form:** it shows the live price (area × rate). The rate is also sent to the browser as a form prop, so it can be read in the page source of the homepage and /contact-us/. Hiding it fully means removing the instant price from the form (CRO feature, client 2026-10-12). Waiting for the client's decision.
- `docs/client-requirements.md` §8 still describes the form price (unchanged, correct).
