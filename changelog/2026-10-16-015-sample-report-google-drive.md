# 2026-10-16-015 — Sample report: Google Drive link instead of the PDF

**Agent/Author:** Claude Code
**Task:** Client: point the sample report download button at the Google Drive link `https://drive.google.com/file/d/11ATB3locz3A632ZqWODD07VX1IakglRj/view?usp=sharing`, opening in a new tab, and remove the PDF. (This is the follow-up planned in `2026-10-13-005-sample-report-view-only.md`.)

## What changed
- `site.pdfs.sampleReport` is now the Drive URL. It is the default for Admin → Settings → "Sample report link". No override is saved in the DB, so the Drive link is used everywhere: the homepage Sample report section, the `/sample-report/` hero and bottom buttons, EN + AR. All buttons already open in a new tab (`external` → `target="_blank" rel="noopener noreferrer"`).
- **PDF removed:** `public/downloads/property-inspectors-sample-snagging-report.pdf` (12.6 MB) was deleted, so it can no longer be downloaded from its direct URL.
- **Old URLs keep working (301 → Drive)**, in `legacy-redirects.ts`:
  - WordPress `/wp-content/uploads/2026/02/Sample-Report-PropertyInspectors.pdf`: the entry was updated, not deleted.
  - `/downloads/property-inspectors-sample-snagging-report.pdf`: added in a new `offSite` list.
  - Both use `site.pdfs.sampleReport`, so the URL is written only once.
- **Button label:** "Download sample report (PDF)" → "View sample report" (AR: "اعرض نموذج التقرير"). Drive opens a viewer, not a file download. On `/sample-report/`, the hero button used the generic "Download PDF"; it now uses the same label. The other download pages still say "Download PDF".
- Tests (`assets.test.ts`): legacy redirects may point to the Drive URL. A new test checks that the removed PDF 301s to Drive and is no longer in `/public`.
- Checked: typecheck, lint and 131 tests pass. On the dev server, `/sample-report/` (3 Drive links), `/ar/sample-report/` (3), `/` and `/ar/` (1 each) have `target="_blank"` and no old PDF links. Both old PDF URLs return 301 to the Drive URL.

## Files touched
- src/lib/site.ts, src/lib/legacy-redirects.ts
- src/components/pages/ContentPage.tsx
- src/i18n/dictionaries/en.ts, src/i18n/dictionaries/ar.ts
- tests/unit/assets.test.ts
- public/downloads/property-inspectors-sample-snagging-report.pdf (deleted)

## Decisions & why
- **Redirect the old PDF URLs instead of returning 404:** the WordPress URL is indexed, and the `/downloads/` URL may have been shared. Per the SEO rules, legacy entries are updated, never dropped.
- **Kept the `/sample-report/` meta title and description** ("Download a sample snagging report…"). It is a legacy ranking page, and changing its metadata needs an SEO review.
- **Kept the download icon** on the button. No new icon was added.

## Follow-ups / known issues
- Check the Drive sharing setting: "Anyone with the link → Viewer". If the client wants no download option, also turn on "Viewers can't download". Test in a private window, because the owner always sees the download button.
- To update the report, use Drive → "Manage versions → Upload new version". The link stays the same, so no code change is needed. The link can also be changed in Admin → Settings.
