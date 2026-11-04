# 2026-11-04-004 — Self-host fonts (fix intermittent `next/font/google` build failure)

**Agent/Author:** Claude Code
**Task:** After the audit fix (changelog 003), CI reached `npm run build` and it failed in `next/font` on `src/app/admin/layout.tsx`: `TypeError: Cannot read properties of null (reading '1')` at `@next/font/.../google/loader.js`, after "Retrying 1/3…". Deploy still blocked.

## Cause
`next/font/google` fetches each font's CSS from Google **at build time**. This is a known intermittent Next.js bug (vercel/next.js#99114, open): when Google returns an extensionless `/l/font?kit=…` URL or an empty/rate-limited response, the loader's regex match is `null` and `[1]` throws. It is non-deterministic — the same commit builds on one run and fails on another (confirmed: the build passed locally, failed in CI). It affects Next 15.5.x generally, not our version bump, and there is no fixed release yet.

## What changed
Switched all three fonts from `next/font/google` to **`next/font/local`** with the woff2 files vendored in the repo, so the build does **no network fetch** — deterministic on CI and on the EC2 deploy build.
- **New `src/fonts/`**: 11 woff2 files + `index.ts` exporting `dmSans`, `manrope`, `plexArabic`.
  - DM Sans (latin) 400/500/600/700 — body
  - Manrope (latin) 600/700/800 — headings
  - IBM Plex Sans Arabic (arabic) 400/500/600/700 — Arabic body + headings
  - ~400 KB total.
- **`src/app/admin/layout.tsx`** and **`src/app/[locale]/layout.tsx`**: import the fonts from `@/fonts` instead of declaring `next/font/google` fonts inline.
- **Variable names + weights are identical** to before (`--font-dmsans`, `--font-manrope`, `--font-plex-ar`), so `globals.css` and every `.variable` usage are unchanged — the site looks the same.
- **`scripts/download-fonts.mjs`**: regenerates `src/fonts/` by resolving each weight's gstatic woff2 via google-webfonts-helper. Run it to change weights/subsets.
- Docs: `docs/architecture.md` font line updated.
- Checks: typecheck, lint, and `npm run build` all pass (the `/admin` route that was failing now builds).

## Files touched
- src/fonts/ (new: index.ts + 11 .woff2)
- src/app/admin/layout.tsx
- src/app/[locale]/layout.tsx
- scripts/download-fonts.mjs (new)
- docs/architecture.md

## Decisions & why
- **Self-host over a CI build retry.** A retry would hide the flake but leave the root cause (and still risk a longer Google outage, and keep the EC2 deploy build flaky). Removing the build-time fetch fixes it everywhere, and matches this project's self-contained-assets approach. (User chose this over the quick retry.)
- **latin subset for DM Sans/Manrope, arabic for Plex Arabic** — same subsets the old Google config requested. Latin covers the English site; latin-ext was not used before either.
- **woff2 only** — the single modern format; every browser the site targets supports it (same as what `next/font/google` served).
- Confirmed the woff2 files are not covered by `.gitignore`, so they commit and reach the server (`npm ci` on EC2 has no font files otherwise).

## Follow-ups / known issues
- To add a weight/subset or update fonts: edit `scripts/download-fonts.mjs` + `src/fonts/index.ts`, run the script, rebuild.
- `next/font/google` is now used nowhere; keep it that way to stay off the flaky build-time fetch.
- Combined with changelog 003, CI should now pass end-to-end (audit + build) and Deploy should run.
