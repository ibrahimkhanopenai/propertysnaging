# Admin CMS

URL: `/admin/` (login at `/admin/login/`). Admin is `noindex` and blocked in robots.txt.

## Auth
- Users in `AdminUser` table, bcrypt (cost 12). First user from `npm run db:seed` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- Session: HS256 JWT in httpOnly cookie `pi_admin` (12h), secret `AUTH_SECRET` (≥32 chars).
- Checked twice: `middleware.ts` (edge) and `(panel)/layout.tsx` + every server action (`requireAdmin()`).
- Change password: update `ADMIN_PASSWORD` in `.env` and re-run `npm run db:seed` (upserts the hash).

## Screens
| Screen | Path |
|---|---|
| Dashboard | `/admin/` |
| Posts list / new / edit | `/admin/posts/`, `/admin/posts/new/`, `/admin/posts/{id}/` |
| Leads (quote form) | `/admin/leads/` |
| Redirects | `/admin/redirects/` |
| Reviews (genuine only) | `/admin/reviews/` |
| Gallery (upload, ALT required, feature on homepage) | `/admin/gallery/` |

## Blog post fields
**Content:** title (H1), slug (auto from title, editable), excerpt, Markdown content with preview, FAQ repeater, featured image (upload) + alt, category, tags, location, related service (end CTA), author, table of contents toggle, language (EN/AR), status (Draft/Published/Scheduled), publish date.

**SEO:** SEO title (30–60 counter), meta description (120–160 counter), live Google preview, focus keyword, secondary keywords, canonical URL, robots index/follow, schema type (BlogPosting/Article/HowTo), breadcrumb title, OG title/description/image. Live SEO checklist (keyword in title/description/slug/intro, H2 present, internal link, alt text, 600+ words).

## Behaviour
- Scheduled posts go live automatically once `publishedAt` passes (pages revalidate hourly).
- Changing the slug of a non-draft post auto-creates a 301 in `Redirect`.
- Slugs that clash with static pages are rejected.
- Saving revalidates the post, blog index, homepage and sitemap.
- Images upload to `UPLOAD_DIR` (default `./storage/uploads`, outside `/public`) and are served by `/uploads/...` — back this folder up.

## Content format
Markdown (`marked`, GFM). `##` = H2, `###` = H3. Admin input is trusted (not sanitised) — only give admin access to trusted staff.

## Post types
- **Blog article** (`POST`): listed in `/blog/`, BlogPosting schema, dates + reading time.
- **Developer page** (`DEVELOPER`): for Emaar, DAMAC, Sobha, Nakheel, Meraas, Danube, Ellington, Azizi, Binghatti, Aldar or a specific development. Same `/{slug}/` URL level, listed in `/snagging-by-developer/`, Service schema, breadcrumb "Snagging by developer". Publish only with genuine, useful content (handover process, common defects seen, how to submit snags) — client rule: no thin keyword pages.

## Blog drafts
`npm run blog:drafts` creates the 10 client topics as DRAFTS with SEO title/description, focus keyword and an H2 outline. Complete each article before publishing. "Property Snagging Checklist Dubai" overlaps the existing imported post — update that post instead.
