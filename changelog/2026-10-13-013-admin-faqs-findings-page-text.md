# 2026-10-13-013 — Admin phase 3: FAQs, "Defects we find" and page text

**Agent/Author:** Claude Code
**Task:** Start phase 3 of the admin roadmap (`docs/assumptions-and-todo.md`): FAQs (homepage + each service/location page), the homepage "Defects we find" items (photo, category, defect, recommendation; EN/AR), and service/location body text (hook, intro, sections) as overrides, with the content files as fallback. The user also asked to check for changes made after the last task, so nothing existing breaks or conflicts.

## What changed
- **Checked before starting:** the working tree was clean apart from the untracked `Properties in Dubai.png` and `logo/`, which were not touched. `origin/main` had no new commits; local `main` is 1 commit ahead (the blog editor commit, not pushed yet). Phase 3 builds on the latest code.
- **DB** (migration `20261013135155_admin_faqs_findings_page_text`): `FaqItem` (page, question/answer EN + AR, published, sortOrder), `Finding` (category/defect/fix EN + AR, photo, alt/altAr, published, sortOrder), `PageText` (page + locale key; hook, intro, sections JSON; null = default).
- **Admin → FAQs** (`/admin/faqs/?p=…`):
  - Tabs for Homepage, the 15 service pages and the 7 location pages. A page with saved FAQs shows "edited".
  - An empty page lists its current FAQs from the code, with **Load these FAQs to edit them**. The load pairs EN and AR by position.
  - The add form appears once the page has rows. Each row has Q/A in EN and AR, show on site, Save, Delete and ⠿ drag order (the existing `SortableList`, keyboard ↑/↓ too).
  - A row without an Arabic Q + A gets a "Not on the Arabic page" badge.
- **Admin → Defects we find** (`/admin/findings/`):
  - Load the 6 current findings, then edit, hide, reorder, add or delete them.
  - Each finding has its own photo upload and an English ALT (required). The Arabic ALT is optional; when it is empty, the Arabic page uses the English one.
- **Admin → Page text** (`/admin/page-text/?p=…&l=en|ar`):
  - Per page and language: hook (location pages only), intro, and sections. Each section has a heading, paragraphs (blank line between them) and bullets (one per line). Sections can be added, removed (asks first) and moved ↑/↓.
  - "Changed/Default" badges per field and **Reset to default**. Fields are controlled, so a validation error keeps the edits.
  - The H1, `<title>`, meta description and URL cannot be edited (SEO rules §5).
- **Site reads** (code fallback, MySQL down → defaults):
  - `getFaqs(page, locale)` (`src/lib/faqs.ts`): used by the homepage, `ContentPage`, `LocationPage` and `/faqs/`. The FAQPage JSON-LD follows the edited list. A page with no rows shows the code list.
  - `getFindings(locale)` (`src/lib/findings.ts`): with no rows, the dictionary list and the Admin → Images scope photos (unchanged output). When every finding is hidden, the section is hidden.
  - `getPageContentWithText(pageKey, locale)` (`src/lib/page-text.ts`): content file + overrides, for service/location pages only.
  - `src/lib/admin-pages.ts`: the shared list of editable service/location pages.
- **Arabic rule:** a FAQ or finding with no Arabic text is left off the Arabic page. An English answer on an RTL page would look broken. Defaults have full Arabic.
- **Robustness:**
  - `FindingsExplorer` used photo URLs as React keys, so two findings with the same photo would clash; it now keys by position.
  - The annotation dot only shows on the default wall photo it was positioned for (`marker`).
  - `Faq`, `ContentPage` and `LocationPage` key sections, paragraphs and bullets by index instead of by text.
  - `/faqs/` keeps its one H1 when every homepage FAQ is hidden.
- **Caching:** saves revalidate the page (EN `/[locale]/…` pattern + `/` + `/ar/` paths) and `/faqs/` for homepage/service FAQs. The 15 service pages and `/faqs/` got `revalidate = 3600` as a safety net, the same as the location pages.
- Admin → Images: the "Defects we find" help text now says Real findings uses those photos only until its items are loaded.
- Admin sidebar: **FAQs**, **Defects we find**, **Page text**.
- **Tests:** `tests/unit/faqs-findings-page-text.test.ts` (13). It covers page lists, EN/AR default pairing, resolve rules (published, Arabic), DB-down fallbacks, section validation (every default section passes unchanged), overrides and form values.
  - Results: 130 tests, typecheck, lint and `npm run build` pass; coverage 93.5% (the new lib files are at 100% lines).
- **End-to-end, dev server** (headless Edge via CDP, logged in): 43/43 checks.
  - FAQs: load, edit, hide, add EN-only (hidden on `/ar/`), keyboard reorder, delete; the Dubai list; `/faqs/` counts.
  - Findings: load, edit, hide, Arabic hidden without Arabic text, add with a real upload; clicking a row features it.
  - Page text: hook, section edit + add; the empty-section error saves nothing; Reset; the Arabic villa intro; saving default text stores nothing. No console errors.
  - Screenshots checked: the homepage findings section, and the admin Page text and FAQs screens.
- **End-to-end, production** (`next start`): saves refresh the cached EN + AR pages and `/faqs/` within about 0.1–1 s. Cleanup through the admin brought every page back to the defaults.
- **Test data removed:** the three new tables are empty again, the test upload was deleted, and the public pages show the same FAQs, findings and text as before.
- Docs: `admin-cms.md` (screens, FAQs, Defects we find, Page text), `assumptions-and-todo.md` (phase 3 ticked + what is still code), AGENTS.md §6 (render with `getFaqs()` / `getFindings()` / `getPageContentWithText()`).

## Files touched
- prisma/schema.prisma, prisma/migrations/20261013135155_admin_faqs_findings_page_text/
- src/lib/{admin-pages,faqs,findings,page-text}.ts (new), src/lib/image-slots.ts
- src/app/admin/actions.ts, src/app/admin/(panel)/{layout.tsx,faqs/page.tsx(new),findings/page.tsx(new),page-text/page.tsx(new)}
- src/components/admin/PageTextForm.tsx (new)
- src/components/home/{Findings,FindingsExplorer}.tsx, src/components/pages/{ContentPage,LocationPage,Faq}.tsx
- src/app/[locale]/{page.tsx,faqs/page.tsx}, the 15 service `page.tsx` files (revalidate only)
- tests/unit/faqs-findings-page-text.test.ts (new), AGENTS.md, docs/{admin-cms,assumptions-and-todo}.md

## Decisions & why
- **Same pattern as phases 1–2:** defaults stay in code and a page with no rows renders exactly as before, so deploying before anyone uses the screens is safe.
- **"Load" before "Add":** adding one FAQ to an empty page would otherwise replace all its current FAQs with that one. The admin first copies the current list, then edits it.
- **Page text stores only differences:** text equal to the content file is saved as null, so later code fixes still reach pages nobody edited. This also lets Reset bring the original back.
- **Sections as plain fields** (heading, paragraphs, bullets), not Markdown or HTML. This matches the existing `PageSection` shape and layout; headings stay H2 (SEO rule §5.8).
- **Scope of page text:** hook, intro and sections only, as in the roadmap. "Why snagging matters", defect groups and info pages are still code; they are listed in the roadmap if the client asks.
- The **dev server** on port 3000 was an orphaned process left by an earlier session (its parent shell was gone). It was restarted to load the new Prisma client, stopped for the production build and test, then started again as a background task of this session.

## Follow-ups / known issues
- **Production:** the deploy workflow's `npm run db:deploy` creates the three tables. Nothing else is needed.
- **ISR race (Next.js, also affects phases 1–2):** if a visitor request regenerates a page at the moment a save lands, the old text can be cached again. Seen once in testing when a page was requested during the save. It fixes itself on the next save or within an hour (`revalidate = 3600`). Not seen when the save finished first (3/3).
- Uploads of replaced or deleted findings stay in `UPLOAD_DIR` (same as Gallery and Images).
- After a failed page-text save, the error stays visible until the next save, even once it has been fixed in the form.
- The Arabic FAQ / finding copy is still the first-draft Arabic (native review open in `assumptions-and-todo.md`).
