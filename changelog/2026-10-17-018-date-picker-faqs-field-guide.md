# 2026-10-17-018 — Date fields open the calendar on click, sidebar "New post" removed, 10+ FAQs per post, blog field guide

**Agent/Author:** Claude Code
**Task:** (1) Date inputs: clicking anywhere in the field opens the calendar (a lightweight library or another way). (2) Remove "New post" from the admin sidebar; the posts list already has the button. (3) At least 10 FAQs on every blog post. (4) Explain every blog post field (OG title, OG description, focus keyword, secondary keywords, breadcrumb title…), for posts added in the future.

## What changed
- **Date fields: `src/components/ui/DateInput.tsx` (new, client).**
  - Renders a native `<input type="date|datetime-local">`. A click anywhere in the field calls the browser's own `showPicker()`, so the calendar opens even when the click misses the small icon.
  - Disabled or read-only fields, browsers without `showPicker`, or a picker that is already open keep the native behaviour (`try/catch`).
  - Keyboard focus alone does not open it. No date-picker library (AGENTS.md: no new UI libraries); it adds a few hundred bytes of JS.
  - Used in all 3 date fields on the site:
    - Admin post editor: publish date (datetime-local)
    - Admin → Reviews: review date
    - Public quote form: handover date (homepage final CTA and `/contact-us/`, EN + AR)
- **Admin sidebar:** "New post" removed. New posts are created from the **New post** button on Blog posts or "Write a new post" on the dashboard; the `/admin/posts/new/` URL is unchanged.
- **Post editor help text (`PostForm.tsx`):** a one-line grey hint under every field (what it is, where it shows, what an empty field falls back to). `ImageField` takes an optional `hint`.
- **`docs/blog-post-fields.md` (new):** field-by-field guide with examples from a live post, covering the main fields, SEO, Open Graph and the sidebar. Linked from `docs/admin-cms.md` and the AGENTS.md docs index.
- **FAQs, production through Admin:** posts 1–5 now have 11, 13, 12, 12 and 12 FAQs (60 in total, up from 3 each). Only the `faqs` field was changed. Every other field was re-sent unchanged and checked after the save; publish dates were unchanged.
  - Answers use only facts from each post's own text, plus "DED licensed / InterNACHI certified" from the site. There are no prices or turnaround times.
  - Questions are worded differently across posts so the 5 FAQ sections do not repeat each other.
- **Checked:**
  - Unit tests: `tests/unit/date-input.test.tsx` (4).
  - Full suite: 139 tests pass. Typecheck, lint and `npm run build` pass.
  - **Headless Edge on the dev server, 9/9 checks pass, no console errors.** `showPicker` was replaced with a recorder, and the clicks were real mouse clicks 12 px from the field's left edge (not on the icon):
    - The calendar opens on click: new post, edit post, Reviews, quote form on `/` and `/ar/`.
    - Keyboard Tab does not open it.
    - The sidebar has no "New post", and the posts list still has its button.
    - The edit form shows the publish date in UAE time (stored 12:26Z → shown 16:26).
  - The post editor was screenshotted to check the hints.
  - **Production:** each post's FAQPage JSON-LD has the same number of questions as the visible FAQ list. The publish dates are the original dates, and there is one H1 per page.

## Files touched
- src/components/ui/DateInput.tsx (new), src/components/admin/PostForm.tsx, src/components/forms/QuoteForm.tsx
- src/app/admin/(panel)/layout.tsx, src/app/admin/(panel)/reviews/page.tsx
- tests/unit/date-input.test.tsx (new)
- docs/blog-post-fields.md (new), docs/admin-cms.md, AGENTS.md (docs index)
- Production DB through Admin: posts 1–5 `faqs`

## Decisions & why
- **Native picker + `showPicker()` instead of a library** (flatpickr, react-datepicker…):
  - It needs no new dependency or CSS, and it works without JS (the plain input still submits).
  - It keeps the browser's own accessible calendar, and phones still get their native picker.
  - Its look is the browser's own and cannot be styled. If a custom-styled calendar is wanted later, that would need a library.
- **FAQ count 11–13, not exactly 10:** each post had enough distinct, useful questions in its own text. Questions that would only repeat another answer were not added.
- **Hints in the editor and a doc:** the hint is in front of whoever writes the post, and the doc gives the full explanation with examples.

## Follow-ups / known issues
- **Deploy needed** for the code in this entry and in 2026-10-17-017 (date timezone fix). Until then, avoid re-saving posts in Admin from a computer outside UTC.
- `showPicker()` support: Chrome/Edge 99+, Firefox 101+, Safari 16+. In older browsers the field works as before (click the icon).
- The "HowTo" schema option only changes the schema `@type` and adds no steps. The editor hint says not to use it; removing the option is a possible clean-up.
