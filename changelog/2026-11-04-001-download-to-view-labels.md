# 2026-11-04-001 — "Download" → "View" labels + sample-report Description copy

**Agent/Author:** Claude Code
**Task:** Client reported some pages still show "Download" after the earlier "View sample report" change. Also asked to reword the sample report "Description" field text (market-standard, not reusing any word from the old copy).

## What changed
- **Download buttons → "View PDF" on all download pages.** `common.download` was still "Download PDF" and is used by `ContentPage` for every page whose download is NOT the sample report — i.e. `/company-profile/`, `/check-list/`, `/inspection-tools/`, `/download-brochure/`. The sample-report button already read "View sample report"; only this generic label lagged.
  - EN: "Download PDF" → "View PDF"
  - AR: "تحميل PDF" → "عرض PDF"
- **`/download-brochure/` H1** (the one visible heading still saying "download"):
  - EN: "Download our brochure" → "View our brochure"
  - AR: "حمّل كتيبنا" → "اعرض كتيبنا"
- **Sample report "Description" field copy** (homepage + `/sample-report/` + all location pages, via `SampleReportSection` → `home.report.fields`):
  - EN: "What is wrong, in plain language" → "A clear account of each defect found" (no word reused from the old text, per client)
  - AR: "ما المشكلة بلغة واضحة" → "بيان واضح لكل عيب تم رصده"
- **Meta titles/descriptions → "View"** (client confirmed: everything "view", nothing "download"). Changed the user-visible/search-snippet text; URLs and route keys untouched.
  - EN `pages.en.ts`: companyProfile, sampleReport, checkList, downloadBrochure metaDescriptions "Download the/a/our…" → "View…"; downloadBrochure metaTitle "Download Brochure | Property Inspectors" → "View Brochure | Property Inspectors".
  - AR `pages.ar.ts`: the same five — "حمّل…" → "اطّلع على…"; brochure metaTitle "تحميل الكتيب…" → "عرض الكتيب…".
- Checks: typecheck passes; no visible "Download"/"حمّل" left in content (remaining Arabic `محمّلة`/`تحمّل` are unrelated words — "overloaded" / "withstood").

## Files touched
- src/i18n/dictionaries/en.ts (`home.report.fields` Description, `common.download`)
- src/i18n/dictionaries/ar.ts (same two)
- src/content/pages.en.ts (`downloadBrochure.h1`; metaTitle/metaDescription for companyProfile, sampleReport, checkList, downloadBrochure)
- src/content/pages.ar.ts (same)

## Decisions & why
- **"View PDF"** chosen because these local PDFs open in the browser's PDF viewer (external link, new tab), so "View" is accurate; the download icon on the button is kept for consistency with the existing "View sample report" button, which also uses it.
- **Meta changed on client confirmation.** First pass left `metaTitle`/`metaDescription` alone as SEO-sensitive; client then confirmed they want "view" everywhere, so these were changed too. The `/download-brochure/` URL and route key still stay (non-negotiable URL rule).
- **SEO note:** the brochure page title tag changed "Download Brochure" → "View Brochure"; if it was ranking for the query "download brochure", that signal is now weaker. Meta descriptions are not a ranking factor (snippet only), so those are low-risk.

## Follow-ups / known issues
- `npm run build` not re-run this session.
