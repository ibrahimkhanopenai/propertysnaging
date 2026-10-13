# 2026-10-13-005 — Sample report "view only": image viewer built, then reverted (Google Drive instead)

**Agent/Author:** Claude Code
**Task:** Client: the sample report must open in a new tab without a download option. First built as page images, then reverted at the client's request; they will use a Google Drive "prevent download" link instead.

## What changed
- Net change: **none**. The sample report is back to how it was before this task. `public/downloads/property-inspectors-sample-snagging-report.pdf` is served again, and the buttons say "Download sample report (PDF)".
- The intermediate version was fully reverted, nothing left behind: `/sample-report/view/` page, 140 WebP page images, `ViewOnly` component, render script, `assets-source/`, redirects, dictionary keys, tests, docs.
- Checked: typecheck, lint and 87 tests pass. On the dev server the PDF URL returns 200 `application/pdf` and `/sample-report/view/` returns 404.

## Decisions & why
- **Rejected: rendering the PDF to page images.** Every new or updated report would need the images re-rendered and redeployed. The client wants to swap PDFs themselves.
- **Chosen: Google Drive link with "prevent download"** (client manages the file). Drive's viewer hides download/print/copy for viewers. "Manage versions → Upload new version" keeps the same link, so updating the report needs no code change.

## Follow-ups / known issues
- When the client sends the Drive link (`https://drive.google.com/file/d/<id>/view`):
  1. `site.pdfs.sampleReport` → the Drive URL (buttons already open in a new tab via `external`).
  2. 301 the old PDF URLs to the Drive URL: `/downloads/property-inspectors-sample-snagging-report.pdf` (`next.config.ts`) and the WordPress URL in `legacy-redirects.ts` (update the entry, don't delete it).
  3. Delete the PDF from `public/downloads/`, otherwise it stays downloadable at its direct URL.
  4. `tests/unit/assets.test.ts`: allow an external destination for this one PDF.
  5. Button label: "Download sample report (PDF)" → "View sample report" (EN + AR); `/sample-report/` meta description "Download…" → "View…".
- Drive cannot stop screenshots. While logged in as the owner, the download button still shows; test the link in a private window.
