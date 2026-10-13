# 2026-10-13-012 — Admin blog: visual text editor, publish switch and delete in the list

**Agent/Author:** Claude Code
**Task:** Client: (1) the post edit screen has no text editor, add one; (2) in the blog list, make the status a Publish/Unpublish switch; (3) put a Delete button in the list too. Also checked an error on `/admin/posts/5/`.

## What changed
- **Error on `/admin/posts/5/`:** the dev server's `.next` cache was stale (`Cannot find module './vendor-chunks/third-party-capital.js'`), so `main-app.js` and the admin CSS returned 500. This was not a code bug, and the dev server serves the page normally again.
- **Visual editor** (`src/components/admin/RichTextEditor.tsx`, no new library):
  - **Visual** tab (default): WYSIWYG area styled like the live article (`article-body`).
  - Toolbar: Paragraph / Heading 2–4 / Quote, Bold, Italic, bulleted and numbered lists, Link, Unlink, Image, horizontal line, Clear formatting, Undo, Redo. The active style is highlighted.
  - Images can be uploaded from the toolbar, pasted or dropped. The editor asks for ALT text, and files go through the existing `/api/admin/upload/`.
  - Pasting from Word or Google Docs goes through Markdown, so fonts, colours and styles are dropped.
  - **Markdown** tab shows the source. It replaces the old Write/Preview tabs.
  - The selection is restored after using the style menu or the link/image prompts. Chrome's inline `style` attributes are stripped.
- **HTML → Markdown converter** (`src/lib/html-to-markdown.ts`): content is still stored as Markdown, so the public rendering, TOC and sanitizing are unchanged.
  - Handles headings (H1 → H2, H5/H6 → H4), paragraphs and hard breaks, bold/italic/strike/code, links, images, nested lists, quotes, tables, rules and code blocks.
  - Iframes, figures and sup/sub are kept as raw HTML.
  - Escapes text that Markdown would otherwise read as formatting.
  - Base64 images are dropped; the editor uploads pasted image files instead.
  - `tests/unit/html-to-markdown.test.ts` (10) includes round-trip tests.
  - All 5 existing posts were round-tripped through it with no visible change to their HTML. Two differences are intended: post 4's in-content H1 becomes an H2, and adjacent bold tags are merged. Trailing spaces before `</p>` are also dropped.
  - Opening a post does not change it. Only typing in the visual editor rewrites the Markdown.
- **Blog list** (`/admin/posts/`):
  - The Status column is a switch: Published ⇄ Draft. Unpublishing asks first and warns that the URL goes offline; if the post ranks, add a 301.
  - A future-dated post shows "Scheduled dd/mm/yyyy".
  - New **Delete** button next to Edit / View. It asks for confirmation and warns when the post is live.
  - The edit screen's Delete now asks for confirmation too; before, it deleted at once.
- **Action** `setPostPublishedAction(id, published)`:
  - Checks the admin session.
  - Publish → `PUBLISHED`. It keeps an earlier publish date, or uses now when there is none or it is in the future.
  - Unpublish → `DRAFT`.
- **Cache refresh:** `revalidatePost()` is shared by save, delete and the switch. Besides the literal paths it revalidates the `/[locale]/…` route patterns, because English pages are served from `/en/…` internally. Before, a saved English post could stay stale for up to an hour.
- **Checked in headless Edge** on the dev server (logged in), using a temporary post that was deleted afterwards:
  - Typing, Heading 2 from the menu, bulleted list, bold, a Docs-style paste and the Markdown tab produce the expected Markdown, and it saves to the DB.
  - In an empty editor (new post), typing and headings work.
  - Switch: publishing works; cancelling an unpublish leaves the post published; confirming sets it to Draft.
  - Delete: cancelling keeps the post; confirming deletes it.
  - No console errors.
  - The 5 real posts were not modified.
- typecheck, lint and 117 tests pass; coverage 92.8%.
- Docs: `admin-cms.md` (Post editor, Blog list, screens table).

## Files touched
- src/components/admin/{RichTextEditor(new),PostListControls(new),PostForm}.tsx
- src/lib/html-to-markdown.ts (new), tests/unit/html-to-markdown.test.ts (new)
- src/app/admin/actions.ts, src/app/admin/(panel)/posts/{page.tsx,[id]/page.tsx}
- docs/admin-cms.md

## Decisions & why
- **No editor library** (AGENTS.md §6). The editor uses `contentEditable` and the browser's editing commands, plus our own converter (about 250 lines).
- **Markdown stays the storage format:** existing posts, `renderMarkdown()` (sanitize + TOC) and the SEO checklist need no change. Storing HTML would have mixed two formats.
- **Unpublish = Draft, with a warning:** a post URL can rank on Google (AGENTS.md §5.1), so the admin is told to add a 301 before taking a ranking post offline.

## Follow-ups / known issues
- **Featured images of posts 1, 2, 3 and 5 point to old `/wp-content/uploads/2026/03/…` files.** These return 404 locally and are not in `legacy-redirects.ts`. Upload the images in each post (Featured image → Upload), or copy the files into `public/images/blog/` and map them.
- Post 4's content starts with `# …` (a second H1 on the page). It becomes an H2 when the post is next edited in the visual editor, or it can be changed now in the Markdown tab.
- Tables can be edited in the Markdown tab; the visual toolbar has no table button.
