# Architecture

## Request flow
```
Browser ──► middleware.ts
             ├─ /admin/*  → verify JWT cookie (pi_admin) → else redirect /admin/login/
             ├─ /en/*     → 301 to the unprefixed URL (EN must have one URL only)
             ├─ /ar/*     → pass through → app/[locale=ar]/...
             └─ anything else → REWRITE (not redirect) to /en/... → app/[locale=en]/...
           (matcher skips /api, /_next, /uploads, /wp-content and files with an extension)
```

## Rendering
| Route | Strategy |
|---|---|
| Static pages (`app/[locale]/<page>`) | Static at build (SSG). Copy from `src/content`. |
| Homepage | ISR, `revalidate = 3600` (latest posts section reads DB) |
| Blog index / posts | ISR 1h + on-demand `revalidatePath()` from admin saves |
| `sitemap.xml` | ISR 1h |
| Admin | Dynamic (`force-dynamic`), never cached |

DB reads used by public pages are wrapped in try/catch (`src/lib/posts.ts`) so the site still builds/renders if MySQL is unreachable — the blog sections are just empty.

## Multiple root layouts
- `app/[locale]/layout.tsx` → public site `<html lang dir>` (fonts, header, footer, Organization JSON-LD, GTM/GA).
- `app/admin/layout.tsx` → admin `<html>`, `noindex`.
There is no `app/layout.tsx` on purpose.

## Blog post resolution (`app/[locale]/[...slug]/page.tsx`)
1. One segment → look for a published post with that slug + locale.
2. Not found → `Redirect` table lookup (`/old-slug/` → 301/302).
3. Else → `notFound()`.
Static page folders always win over the catch-all, so slugs that clash with pages are blocked in the admin.

## Data model (Prisma)
`AdminUser`, `Category`, `Post` (content + full SEO fields), `Redirect`, `Lead`. See `prisma/schema.prisma`.

## Performance choices
- No UI kit, no icon library, no animation library. Client JS only for: quote form, mobile menu, language switch.
- `next/font` (self-hosted Google fonts, `display: swap`); Arabic font loaded only on `/ar/`.
- `next/image` AVIF/WebP, explicit `sizes`, only hero is `priority`.
- Static/ISR everywhere; long cache headers on `/wp-content/*` and `/uploads/*`.
- GTM/GA via `@next/third-parties` (loaded after hydration).

## Upgrading to Next.js 16
Next 16 renames `middleware.ts` → `proxy.ts` (export `proxy` instead of `middleware`). Do it in one PR, test admin auth + `/ar/` + `/en/` redirect, and log it in `changelog/`.
