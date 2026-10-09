# 2026-10-09-003 — Google Tag Manager: official head + body snippet

**Agent/Author:** Claude Code
**Task:** Client asked for the GTM code (container `GTM-MCTLKNHC`) in the `<head>` and right after the opening `<body>` tag, so they can set up and verify tracking.

## What changed
- New `src/components/analytics/GoogleTagManager.tsx`:
  - `<GtmHead>`: Google's install snippet, server-rendered into `<head>`.
  - `<GtmNoScript>`: the `<noscript><iframe>` right after `<body>`.
  - The ID comes from `NEXT_PUBLIC_GTM_ID`. Anything that is not `GTM-[A-Z0-9]+` renders nothing.
- `src/app/[locale]/layout.tsx` uses it instead of `@next/third-parties` `GoogleTagManager`, which injected GTM only after hydration (not in the HTML) and had no noscript part. GA4 fallback (`NEXT_PUBLIC_GA_ID`) unchanged. The admin layout has no GTM.
- Tests: `tests/unit/gtm.test.tsx` (snippet + noscript for a valid ID; nothing for empty, GA-style or malicious IDs).
- Docs: production container is now `GTM-MCTLKNHC` (`.env.example`, tracking, architecture, assumptions, seo-migration launch checklist).

## Files touched
- src/components/analytics/GoogleTagManager.tsx (new), src/app/[locale]/layout.tsx, tests/unit/gtm.test.tsx (new)
- .env.example, docs/{tracking,architecture,assumptions-and-todo,seo-migration}.md

## Decisions & why
- Plain `<script>` instead of `next/script` (lint rule disabled on that line): the client and GTM's install check expect the snippet in the served HTML `<head>`. gtm.js still loads `async`, so rendering is not blocked.
- Next.js places its own CSS/JS links and metadata first in `<head>`, and the GTM snippet comes after them. It still runs before any body content is parsed.
- The ID stays in `.env` (no hard-coding), so dev and staging are not tracked unless set.

## Follow-ups / known issues
- Set `NEXT_PUBLIC_GTM_ID=GTM-MCTLKNHC` in the production `.env` and rebuild (`NEXT_PUBLIC_*` values are baked in at build time).
- The client's message calls the site "TrueCheck Inspection", but this project is branded "Property Inspectors". Confirm it is the same site/container before going live.
- If GA4 is configured inside this GTM container, keep `NEXT_PUBLIC_GA_ID` empty.
