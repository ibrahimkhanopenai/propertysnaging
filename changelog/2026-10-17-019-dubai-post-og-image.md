# 2026-10-17-019 — Dubai blog post: share image set to the Dubai skyline photo

**Agent/Author:** Claude Code
**Task:** Client chose option A: replace the Dubai post's OG (share) image, a sample star-trails photo, with the Dubai skyline image.

## What changed
- **Post 5** (`/property-snagging-inspection-dubai-abudhabi-sharjah/`), production, through Admin:
  - OG image changed from `/uploads/2026/10/sample640426-1-2-c3bf4d.jpg` to `/images/hero-city-in-hand.png`. This is the same photo as the post's featured image.
  - Only this field changed; the other 29 were re-sent unchanged and checked after the save.
- **Checked live:**
  - `og:image` and `twitter:image` point to the skyline PNG (200).
  - The publish date is still 2026-03-13 12:34 UTC, and the 12 FAQs are still there.
- **Deploy status checked:** the code from 2026-10-17-017/018 (UAE-time publish date, calendar on click, field hints, sidebar) is **not deployed yet**. Production still shows the old "Publish date" label and the "New post" sidebar link.

## Files touched
- docs/assumptions-and-todo.md (item ticked)
- Production DB through Admin: post 5 `ogImage`

## Decisions & why
- **Set the path explicitly (option A)** instead of clearing the field, as the client chose. If the featured image is replaced later, change the OG image too, or clear it so it follows the featured image.
- **Sample file kept:** the old upload stays in `UPLOAD_DIR`; nothing on the site uses it now.

## Follow-ups / known issues
- Deploy 017/018. Until then, saving a post in the admin from a computer outside UTC moves its publish date.
- Facebook and LinkedIn cache share previews. To refresh them now, re-scrape the URL in the Facebook Sharing Debugger and the LinkedIn Post Inspector. WhatsApp refreshes on its own after some time.
