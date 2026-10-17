# 2026-10-17-017 — Blog posts: empty fields filled, placeholder images, publish-date timezone fix

**Agent/Author:** Claude Code
**Task:** Edit all 5 blog posts in Admin and fill the empty fields (featured image, canonical URL, Open Graph, …). Use related images from the site for now; the client will change them later. Also: suggestions.

## What changed
- **Production, through Admin** (posts 1–5, the same server-action form posts as 2026-10-17-016). Each save re-sent every current value and changed only the fields listed below. The form was read again after each save to confirm.

  | Post | Featured + OG image (site photo) | Featured ALT |
  |---|---|---|
  | 1 checklist | `/images/scope/hvac.jpg` | Property Inspectors engineer scanning a new apartment with a thermal camera |
  | 2 civil & structural | `/images/scope/paint-and-walls.jpg` | Property Inspectors engineer checking a wall surface with a torch |
  | 3 interior finishes | `/images/scope/tiling.jpg` | Inspector checking floor tiles with a moisture meter |
  | 4 MEP | `/images/gallery/electrical-inspection.jpg` | Inspector testing a wall socket with an electrical tester |
  | 5 Dubai | `/images/hero-city-in-hand.png` (featured only, see below) | Hand holding a model of the Dubai skyline with towers and palm trees (existing hero ALT) |

  - **Canonical URL:** the post's own absolute URL. This is the same URL as before (self-canonical) and as `legacy-seo.json`.
  - **OG title / OG description:** short social-share versions, written from each post. The SEO `<title>` and meta description are unchanged (legacy values).
  - **FAQs:** 3 per post, answered only from the post's own text (no new claims, prices or turnaround times). They show as the FAQ section under the article, with FAQPage JSON-LD.
  - **Focus keyword** (posts 2–5, admin checklist only): changed to the keyword that matches most of the fixed title, description, slug and intro. Post 1's keywords were already set, so they were not changed.
    - Post 2: "property snagging guide"
    - Post 3: "interior finishes"
    - Post 4: "electrical and plumbing"
    - Post 5: "property snagging"
  - **Post 1 "Related service":** was `C:/Program Files/Git/handover-inspection-dubai/` (its CTA button 404'd). It is now `/handover-inspection-dubai/`.
  - Post 1's content is now stored with CRLF line endings. Node's FormData, like browsers, converts line breaks to CRLF in form posts; posts 2–5 already had CRLF. The text is identical, and the rendered article HTML is byte-identical to before.
- **Not overwritten:** post 5's OG image `/uploads/2026/10/sample640426-1-2-c3bf4d.jpg`. It was set in Admin after 2026-10-17-016, so it is the client's change. It is a sample landscape photo, flagged in `assumptions-and-todo.md`.
- **Bug found and fixed — publish date moved on every browser save:**
  - Post 5's date had moved from 12:34 to 18:04 UTC (+5:30, the India offset) when it was saved in a browser.
  - Cause: `PostForm` showed the date in the browser's timezone (`getTimezoneOffset`), but `savePostAction` parsed the submitted `datetime-local` value in the server's timezone (UTC). Each save from a non-UTC computer moved the date by that offset, and repeated saves keep moving it.
  - Fix: both sides now use UAE time (UTC+4, no DST), via `toUaeDateTimeInput()` / `parseUaeDateTimeInput()` in `src/lib/utils.ts`. The label is "Publish date (UAE time)". An invalid date is now refused with "Publish date is not valid." instead of saving an Invalid Date.
  - Post 5's date was restored to 2026-03-13 12:34 UTC (through Admin, with the old server code still live).
- **Checked on production:**
  - Every post: canonical, `og:title`, `og:description`, `twitter:title`, `og:image` (200), featured image with ALT (next/image 200), Article JSON-LD `image`, FAQPage with 3 questions, one H1.
  - Title, description, canonical and publish date are still identical to `legacy-seo.json`. All internal links return 200.
  - `/blog/`: 5 cards, all with images.
- **Code checks:** 135 tests pass (4 new in `utils.test.ts`, also run with `TZ` = UTC, Asia/Kolkata and America/New_York). Typecheck and lint are clean.

## Files touched
- src/lib/utils.ts, src/app/admin/actions.ts, src/components/admin/PostForm.tsx
- tests/unit/utils.test.ts
- docs/admin-cms.md, docs/assumptions-and-todo.md
- Production DB through Admin: posts 1–5 (fields above)

## Decisions & why
- **Images:** genuine branded inspection photos already on the site. The stock ones were not used: the About photo has a watermark, and the report collage is stock. The navy t-shirt gallery photos were also skipped (open question in `assumptions-and-todo.md`).
  - For portrait photos, the centre of the 16:9 crop shows the inspector, the logo and the work.
  - Paths point to the existing `/images/` files, so nothing new was uploaded.
- **OG image = featured image (posts 1–4):** this is what was asked ("fill the columns"). An empty OG image would follow the featured image automatically. With a value set, the client must change both when replacing the photo, or clear OG image.
- **Explicit canonical** equals the default self-canonical, so there is no SEO change. If a slug is ever changed, the canonical must be updated too (an empty canonical would follow automatically).
- **UAE time for the admin field** instead of converting in the browser: it gives the same value on server render and hydration, does not depend on the admin's computer, and needs no client JS. The business and its posts are in the UAE.

## Follow-ups / known issues
- **Deploy needed for the date fix.** Until then, saving a post in Admin from a computer outside UTC still moves its publish date by that computer's UTC offset. After the deploy, the admin shows existing dates in UAE time (e.g. post 1: 14:30 = 10:30 UTC); the stored dates do not change.
- Replace the placeholder images and post 5's sample OG image with real photos (todo list).
- Legacy titles longer than 60 characters (posts 2 and 3) and descriptions longer than 160 characters (posts 2–4) were kept on purpose (SEO rule §5.6). Change them only after an SEO review.
- Report turnaround wording in the posts ("within hours", "within 12 hours", "less than 6 hours" vs the site's 6–24h) is still to be confirmed by the client (from 2026-10-17-016).
