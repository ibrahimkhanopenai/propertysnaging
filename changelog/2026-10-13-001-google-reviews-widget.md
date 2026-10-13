# 2026-10-13-001 — Live Google reviews on the homepage (SociableKit widget)

**Agent/Author:** Claude Code
**Task:** The client sent the SociableKit Google Reviews embed for PropertyInspectors.me (embed ID 25661949). Show the real reviews in the homepage reviews section.

## What changed
- New `components/home/GoogleReviewsWidget.tsx` (small client island): renders `<div class="sk-ww-google-reviews" data-embed-id>` and injects `widget.js` only when the section is within 800px of the viewport. The script is removed on unmount and injected again on the next mount, so the widget still renders after client-side navigation back to the homepage.
- `ReviewsMarquee.tsx`: the 3 static quotes (`site.defaultReviews` / Admin → Reviews) are replaced by the widget. The layout is now the heading + "Read our Google reviews" / "Write a review" in one row, with the widget full width below. The aggregate-rating block is still hidden while `site.reviews.isPlaceholder` is true.
- `site.ts`: `googleReviewsWidget: { embedId, src }` added; `defaultReviews` removed (no longer used).
- Docs: assumptions-and-todo, client-requirements (§9), design-system (homepage order).
- Checked on the dev server (headless Edge, 1440px, EN + AR): the widget loads 5.0★ and the review cards (Handeazy, Bijoy Joseph, Ealias K K …). typecheck, lint and 87 tests pass.

## Files touched
- src/components/home/{GoogleReviewsWidget(new),ReviewsMarquee}.tsx
- src/lib/site.ts
- docs/{assumptions-and-todo,client-requirements,design-system}.md

## Decisions & why
- **Script embed, not the iframe:** the iframe has a fixed `height="1000px"`, which leaves blank space or clips on mobile. The script sizes itself to the content.
- **Lazy injection instead of `next/script`:** the section is near the bottom of the page, so the script loads only as the visitor scrolls toward it. This keeps the first load small. Also, `next/script` runs a script only once per session.
- No Review/AggregateRating JSON-LD was added. The widget is third-party client-side HTML, and `isPlaceholder` is still true.

## Follow-ups / known issues
- Free SociableKit plan: the widget shows a "Free Google Reviews Widget by SociableKIT" link. A paid plan removes it.
- Review text renders client-side, so Google won't index it as page content. This is acceptable for social proof.
- `/reviews/` still lists Admin → Reviews entries (currently empty → placeholder text). The same widget can be added there if wanted.
- `site.googleReviewUrl` (the two buttons) is still the DUMMY Maps search URL. Replace it with the real Google Business Profile / write-review link. The widget's own "Write a review" button already uses the real profile.
- Rating: Google shows 5.0. Set `site.reviews.rating` and `isPlaceholder: false` if the masthead rating should show.
