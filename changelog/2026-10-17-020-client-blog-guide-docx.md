# 2026-10-17-020 — Client blog guide (Word) in the repo root

**Agent/Author:** Claude Code
**Task:** Make a document in the root folder that can be shared with the client. In basic English, it should give the full blog instructions: each field's name, what value to put in it, what happens if it is left empty, and where images show and what they are for. It should also say that the 5 blog posts have been added with images chosen by us, which the client can change from the admin.

## What changed
- **`Blog-Guide-Property-Inspectors.docx`** (new, repo root): A4, 7 pages, basic English. Sections:
  1. What we have already done: the 5 posts (title, web address, photo used) and their FAQs/SEO/social fields. The photos were chosen by us and can be changed in the admin. The old blog photos were deleted from the old server.
  2. How to open the admin panel (login URL, no credentials) and which button does what.
  3. Before you start (what to have ready).
  4. Every field, explained: 4 columns (Field / What to write / If you leave it empty / Where it shows) for:
     - 4.1 Main content
     - 4.2 Google search (SEO)
     - 4.3 Social sharing (OG)
     - 4.4 Right side panel
  5. Images: where each one shows, what it is for, size and tips. The OG image box in the 5 posts holds the same photo as the featured image, so change both or clear OG.
  6. How to change the photo of a post (steps).
  7. Important rules (slug, keep the 5 old posts' SEO title/description, real photos, true facts, unique text, headings, index, draft first).
  8. The SEO checklist box.
  9. Checklist before you publish.
- **The "if empty" and "where it shows" answers were checked against the code:**
  - Empty SEO title: post title + "| Property Inspectors UAE".
  - Empty meta description: excerpt, then Google's own text.
  - Empty OG fields: SEO title / meta description / featured image.
  - Empty author: "Property Inspectors".
  - Tags and Location are not shown on the site.
  - Category names are the ones in production.
- Built with docx-js (script kept outside the repo). Rendered through LibreOffice to check the layout: tables fit the page, header rows repeat, no orphaned headings.

## Files touched
- Blog-Guide-Property-Inspectors.docx (new)

## Decisions & why
- **Word file, not Markdown:** the client opens it by double-click, can print it, and the tables read properly. A `.md` file would show raw symbols. The developer version of the same guide stays in `docs/blog-post-fields.md`.
- **No login credentials in the document**, because it is meant to be shared. The client gets them separately.
- It describes the admin **after** the 017/018 deploy: the "Publish date (UAE time)" label, the calendar opening on click, the grey hints, and "New post" only on the Blog posts page.

## Follow-ups / known issues
- **Deploy 017/018 before sharing the guide**, otherwise the hints and calendar behaviour it describes are not live yet.
- If the admin form changes, update both this Word file and `docs/blog-post-fields.md`.
