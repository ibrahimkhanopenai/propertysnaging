# 2026-11-04-003 — Fix CI `npm audit` gate blocking deploy (next, nodemailer, zod)

**Agent/Author:** Claude Code
**Task:** Deploy stopped: the CI step `npm audit --omit=dev --audit-level=high` exited 1 on high/critical vulnerabilities, so the Deploy workflow (gated on CI success) never ran.

## What changed
Only dependency versions — no app code changed.
- **next** `15.5.27` → **`15.5.29`** (lockfile). Fixes the **critical** advisory GHSA-2464-fhr4-w9xw (Image Optimization RCE) + the Server Actions DoS. Within the existing `^15.5.0` range, so `package.json` was not touched.
- **nodemailer** `10.0.13` → **`10.3.1`** (lockfile). Clears the moderate addressparser advisories. Within `^10.0.13`, `package.json` untouched.
- **zod** `^3.25.0` → **`^4.6.7`** (`package.json` + lockfile). The high advisory GHSA-mrhx-c7xc-m3w5 (memory exhaustion) has **no v3 fix** — latest v3 (3.25.76) is still flagged; the only patched line is 4.6.6+. This is a **major upgrade**, but our usage is a compatible subset (`z.object/string/number/enum/union/literal`, `.min/.max/.int/.trim/.regex/.email/.optional`, `safeParse`, `error.issues`) in just two files, so no code changes were needed.
- Done via `npm audit fix` (next + nodemailer, non-breaking) then `npm install zod@^4.6.7`.

## Result
- `npm audit --omit=dev --audit-level=high` → **found 0 vulnerabilities (exit 0)**. CI audit step now passes → Deploy will run.
- `npm run typecheck`, `npm run lint`, `npm test` (**139/139**, incl. `leads-api.test.ts` + `schema.test.ts` which exercise the zod schemas) all pass.

## Files touched
- package.json (zod range only)
- package-lock.json (next, nodemailer, zod + transitive)

## Decisions & why
- **zod v4, not relaxing the audit gate.** The client's CI deliberately fails on high/critical. Lowering `--audit-level` or ignoring the advisory would leave a real high vuln in production. Since usage is simple and the full test suite + typecheck pass, the proper upgrade is low-risk.
- **`package.json` ranges for next/nodemailer left as-is.** The existing `^` ranges already permit the patched versions; `npm ci` on the server installs exactly from `package-lock.json`, so the fixed versions deploy.

## Follow-ups / known issues
- The **full** `npm audit` (dev included) still reports dev-only criticals/moderates — mainly **tinypool** (via **vitest**) and eslint plugins. These are **devDependencies**, excluded by CI's `--omit=dev`, and never ship to production, so they do not block deploy. Clearing them needs a breaking **vitest** major bump (`npm audit fix --force` → vitest@5); do that separately, not as part of a deploy hotfix.
- Watch the first deploy build: zod v4 emits `@deprecated` type hints for `.email()` (non-fatal); if desired, migrate `z.string().email()` → `z.email()` later for cleanliness.
- `npm run build` not re-run locally this session (CI builds on deploy).
