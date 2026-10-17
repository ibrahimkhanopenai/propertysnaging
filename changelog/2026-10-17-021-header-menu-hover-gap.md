# 2026-10-17-021 — Header menu: dropdown closed before the mouse reached it

**Agent/Author:** Claude Code
**Task:** User report: hovering "Services" opens the menu, but moving the mouse onto a service makes the menu disappear, so the service cannot be clicked. Asked for a browser walk-through.

## What changed
- **Cause (reproduced in headless Edge, before the fix):**
  - The dropdowns open from the bottom of the header (`absolute top-full`; the Services panel is positioned against the whole header). The hover area was only the nav link, which ends at 99 px; the header ends at 124 px.
  - Moving down from "Services" therefore crossed a 25 px strip that belonged to no item. The menu closed at y=101, and the click on "Apartment snagging" went nowhere.
  - `transition` did not include `visibility`, so the menu also disappeared instantly, with no grace period.
- **Fix in `src/components/layout/Header.tsx`, CSS only, no JS:**
  - `<nav>` uses `self-stretch xl:-my-3 xl:flex`, the `<ul>` `items-stretch`, and each `<li>` `flex items-center`. Every nav item now spans the full header height, so its hover area reaches the top edge of its dropdown with no gap. The header looks the same (screenshot compared with the live site).
  - **Hover intent:**
    - A menu opens 100 ms after the mouse arrives, so passing over the next item does not pop its menu.
    - The Locations list closes 200 ms after the mouse leaves, and the Services panel after 500 ms, for long diagonal paths to its far columns.
    - Keyboard focus opens at once.
    - `transition-[opacity,translate,visibility]` makes the close delay apply to `visibility`.
  - The Locations list closes at once when the Services item is hovered (`group-has-[>li[data-mega]:hover]/nav:delay-0`; the Services `<li>` has `data-mega`).
  - Both dropdowns keep the same z-index, so Locations (later in the DOM) is on top when both are briefly visible.
- **Browser walk-through after the fix:** headless Edge with real mouse moves at normal hand speed (~1250 px/s) and slow speed (~600 px/s), then a real click. **75/75 checks pass**:
  - English at 1280, 1440 and 1920 px (45/45); Arabic (RTL) at 1280 and 1440 px (30/30).
  - Services: straight down, far-left diagonal and far-right diagonal, fast and slow. Locations: down and diagonal.
  - Switching menus: Services, then Locations, then a city. Locations, then Services.
  - Both menus close when the mouse leaves. Keyboard focus opens the menu.
- **Tried and rejected during testing:**
  - Putting Services above Locations (z-index) fixed the far-right diagonal but broke Services → Locations: Services grabbed the mouse on the way down.
  - An invisible hover "bridge" under the nav had the same problem.
- Checks: 139 tests, typecheck and lint pass.
- Docs: `design-system.md` (header dropdown rules and why).

## Files touched
- src/components/layout/Header.tsx
- docs/design-system.md

## Decisions & why
- **CSS only**: no new client JS in the header (AGENTS.md: keep JS small). A JS "menu aim" controller would handle extreme paths, but the CSS rules pass every realistic path tested.
- **500 ms for the Services panel**: at 400 ms, the slowest Arabic path to the farthest column closed 3 px before the panel. 500 ms passes it, and the panel lingering half a second after the mouse leaves is barely noticeable.

## Follow-ups / known issues
- `npm run build` was not re-run for this change: a `next dev` server (started outside this session) was using `.next`. Run the build before deploying.
- Below 1280 px the desktop nav is hidden and the mobile menu is used. It was not changed.
