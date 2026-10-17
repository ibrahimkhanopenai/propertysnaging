# 2026-10-17-016 — The 4 remaining old blog posts re-added in Admin (production)

**Agent/Author:** Claude Code
**Task:** Add the blog posts from truecheckinspection.com (the old WordPress site) to propertyinspectors.me through Admin, logging in with the `.env` admin account. Skip the one post that was already added (the checklist post).

## What changed
- **Source:** the WordPress REST API on truecheckinspection.com. It has 5 published posts, the same 5 as `docs/seo-migration.md`. `/property-snagging-checklist-before-handover-dubai/` was already live (Admin post 1), so it was skipped and not changed.
- **Added and published on production** (Admin posts 2–5), each at its old URL:

  | Admin id | URL | Category | Related service (end CTA) |
  |---|---|---|---|
  | 2 | `/civil-structural-property-snagging-guide/` | Snagging Guides | `/snagging-services/` |
  | 3 | `/property-snagging-interior-finishes-fitout-guide/` | Snagging Guides | `/snagging-services/` |
  | 4 | `/property-snagging-electrical-plumbing-mep-guide/` | MEP & Technical | `/hvac-mep-inspection/` |
  | 5 | `/property-snagging-inspection-dubai-abudhabi-sharjah/` | UAE Property | `/snagging-services-in-dubai/` |

- **SEO fields:** the same slug, meta title and meta description as the table in `docs/seo-migration.md`. Each post also keeps its original WordPress publish date (to the minute).
- **Other fields copied from post 1:** author "Property Inspector Team", schema `Article`, table of contents on, index/follow. Canonical and OG fields are empty (defaults).
- **New per post:** an excerpt taken from the post's own intro, focus and secondary keywords, a breadcrumb title and tags.
- **Content:** converted to Markdown in the same way as post 1. The text is word-for-word the WordPress text (checked with a word diff), apart from:
  - Bold-paragraph "headings" became `##` / `###` by their place in the outline. The WordPress font sizes were not used, because they were inconsistent. Third-level labels in the civil post ("Key Checks Include", "Inspection Points"…) are bold lines, since the TOC only lists H2/H3.
  - `•` lines became real lists. WordPress `<h1>` blocks became H2/H3, so each page still has one H1. The Dubai post's closing sentence was styled as an H1; it is now a normal paragraph.
  - Old-domain links: `www.truecheckinspection.com` (Dubai post, intro and the "Why choose" heading) now reads **PropertyInspectors.me** and links to `/`. The interior post's "series of blogs" links now point to the internal `/civil-structural-property-snagging-guide/` and `/property-snagging-electrical-plumbing-mep-guide/`.
  - Contact block made clickable, as in post 1 (WhatsApp, `tel:` and `mailto:` links). The plain `https://www.propertyInspectors.me` self-link line was dropped.
  - Dubai post: the "Coverage across the UAE" list now links to the Dubai, Abu Dhabi, Sharjah and Ras Al Khaimah location pages.
- **How it was done:** through the Admin server actions (`loginAction`, `savePostAction`), the same no-JS form posts the login and new-post forms make. So `requireAdmin()`, validation, the slug clash check and revalidation all ran as normal. Before each create, the script made sure the slug was not already in Admin → Posts. No DB access, no code change.
- **Checked on production:**
  - Each of the 4 URLs returns 200.
  - `<title>`, meta description and canonical are identical to `docs/legacy-seo.json`, and the publish date is the WordPress date.
  - Robots are `index, follow`. Each page has one H1, a TOC and BreadcrumbList + Article JSON-LD. No old domain is left on the page.
  - Every internal link on the 4 pages returns 200.
  - All 5 posts are on `/blog/` and in `/sitemap.xml`.
  - Before publishing, the Markdown was also rendered locally with `renderMarkdown()`: no H1 in the body, and every internal link ends in `/`.
- Docs: `seo-migration.md` (URL map statuses, launch checklist item ticked), `assumptions-and-todo.md` (item ticked, checklist-post CTA bug added).

## Files touched
- docs/seo-migration.md, docs/assumptions-and-todo.md
- changelog/2026-10-17-016-legacy-blog-posts-re-added.md (new)
- Production DB only (through Admin): posts 2–5. No code changes.

## Decisions & why
- **No featured images.**
  - The WordPress featured images (`/wp-content/uploads/2026/03/…`) return 404 on the old server in every size, and the Wayback Machine has no copy.
  - Post 1 has no featured image either, so the 5 posts look the same on `/blog/`. The default OG image is used.
  - Stock or other photos were not swapped in (client rule: genuine photos only).
- **Wording kept as the client wrote it**, as was done for post 1, including grammar slips. Some claims differ between the posts and the site:
  - Report time: "within hours" (civil, MEP, Dubai), "within 12 hours" (interior, also post 1) and "Less than 6 hours report turnaround" (Dubai). The site says 6–24 hours.
  - The client should confirm these (follow-ups).
- **Related-service CTAs** link to the closest service or location page instead of the homepage form (post 1's setting). This adds internal links to the matching pages, and those pages have the quote form too.
- **Post 1 not edited:** the user asked to skip it. Its CTA bug is reported, not fixed (see follow-ups).

## Follow-ups / known issues
- **Bug on the live checklist post (post 1):** its "Related service" is `C:/Program Files/Git/handover-inspection-dubai/`. That is a Git Bash path conversion from when it was added, and its "Book a snagging inspection" button 404s. Fix: Admin → Posts → Edit post 1 → Related service → `/handover-inspection-dubai/` → Save.
- Post 1's WordPress original ended with "Refer to our other blogs below" links to the other 4 posts. They were left out when it was added because those posts did not exist yet. Now they do, so the links could be added back as internal links.
- Featured images: if the client still has the original files (`Civil-structural-snagging`, `Property-snagging-Interior-Handover`, `property-snagging-electrical-plumbing-mep`, `Dubai-Image-for-Blog-Landscape`, `Need-Property-Snagging-n-Inspection`), upload each in the post editor with real ALT text.
- Confirm the report turnaround claim in the posts (6 / 12 hours vs the site's 6–24h).
- The posts are English only. Arabic versions are still an optional item in `assumptions-and-todo.md`.
