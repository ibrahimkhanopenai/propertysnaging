# 2026-10-13-011 — Admin Blog posts: visible Edit button

**Agent/Author:** Claude Code
**Task:** Client: "the edit option for blogs is not showing in the admin panel".

## What changed
- **Admin → Blog posts** (`/admin/posts/`): new **Actions** column on each row with an **Edit** button (opens `/admin/posts/{id}/`) and **View ↗** (opens the public post in a new tab).
- Before, the only way to edit was clicking the post title, which did not look like a link, so the edit screen seemed missing. The title link still works.
- Empty-state row now spans 7 columns.
- Docs: `admin-cms.md` screens table mentions the Edit/View buttons.
- Typecheck and lint pass.

## Files touched
- src/app/admin/(panel)/posts/page.tsx
- docs/admin-cms.md

## Decisions & why
- The edit screen and its actions already worked; only the entry point was hidden. A labelled button is the smallest fix.

## Follow-ups / known issues
- Not checked in the browser this time (admin needs a login). Open `/admin/posts/` and confirm the buttons show.
