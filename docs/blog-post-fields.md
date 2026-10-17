# Blog post fields: what each one means and how to fill it

For anyone adding a post in **Admin → Blog posts → New post**. Each field also has a one-line hint under it in the editor.
Examples are from the live post `/civil-structural-property-snagging-guide/`.

**Quick rule:** only Title, Content and Status are required. Every other empty field falls back to a sensible default
(shown in the "Empty =" column), so leave a field empty when you have nothing better than the default.

## Main fields

| Field | What it is / where it shows | How to fill it | Empty = |
|---|---|---|---|
| **Title (H1)** | The headline at the top of the post, and the title on its `/blog/` card. | One clear sentence with the topic. *Guide for Property Snagging: Civil and Structural aspect of the Property* | Required |
| **URL slug** | The post's address: `propertyinspectors.me/{slug}/`. | Lowercase words with hyphens, filled in from the title. Choose it before publishing and **never change it after** (Google ranks the address). If you do change it, a 301 redirect is added automatically. *civil-structural-property-snagging-guide* | Made from the title |
| **Excerpt** | 1–2 sentence summary under the title and on the `/blog/` card. | 80–200 characters, taken from the intro. | No summary shown |
| **Content** | The article. | Use **Heading 2** for sections and **Heading 3** for sub-sections (never Heading 1: the title is the H1). Add at least one link to another page of the site. 600+ words. | Required |
| **FAQ** | Questions and answers shown under the article. They are also sent to Google as FAQ data (FAQPage schema). | 5–12 questions readers really ask. Answer only with what the article says: no prices or promises that are not on the site. | No FAQ section |

## SEO (Google search)

| Field | What it is / where it shows | How to fill it | Empty = |
|---|---|---|---|
| **SEO title** | The blue headline in Google results and the browser tab. | 30–60 characters, main phrase near the start. *Property Snagging Guide: Civil & Structural Inspection of Property* | The title |
| **Meta description** | The grey text under the headline in Google. | 120–160 characters. Say what the reader gets, so they click. | Google picks text from the page |
| **Focus keyword** | The main phrase people search for. **Not shown anywhere**; only the SEO checklist uses it (keyword in title, description, slug, first 100 words). | One phrase: *property snagging guide* | Checklist can't score it |
| **Secondary keywords** | Related phrases to use naturally in the text. **Not shown anywhere**; a note for writers. | Comma separated: *structural inspection, property snagging uae, construction defects* | — |
| **Canonical URL** | Tells Google which address is the "original" of this content. | Leave empty, or put the post's own full address: *https://propertyinspectors.me/civil-structural-property-snagging-guide/*. Only use another address if this post is a copy of another page. If you change the slug, update this too. | The post's own address (correct in almost every case) |
| **Breadcrumb title** | Short name in the trail above the title: *Home / Resources & blog / **Civil & Structural Snagging Guide***. Also in Google's breadcrumb data. | 2–5 words. | The title |
| **Schema type** | Tells Google what kind of page this is (structured data). | **BlogPosting** or **Article** for normal posts (both are fine; our posts use Article). Don't use **HowTo**: Google no longer shows HowTo results, and this editor does not add the step data it needs. | BlogPosting |
| **Allow Google to index / Follow links** | `index`: the post may appear in Google. `follow`: Google follows its links. | Keep both ticked. Untick *index* only for a post that must stay out of Google. | — |

## Social sharing (Open Graph)

What WhatsApp, Facebook, LinkedIn and X show when someone shares the post link (a card with picture, headline and text).

| Field | What it is | How to fill it | Empty = |
|---|---|---|---|
| **OG title** | Headline of the shared card. | Short and catchy, up to ~60 characters. *Civil & Structural Snagging: What Inspectors Check* | SEO title |
| **OG description** | Text under the headline of the shared card. | One sentence, up to ~150 characters. | Meta description |
| **OG image** | Picture of the shared card. | 1200×630 px landscape. **If you later replace the featured image, change or clear this too**, otherwise shares keep the old picture. | Featured image |

## Sidebar

| Field | What it is / where it shows | How to fill it | Empty = |
|---|---|---|---|
| **Status** | Draft = hidden. Published = live. Scheduled = goes live on the publish date. | Draft while writing, then Published. Unpublishing a live post takes its URL offline (add a 301 in Redirects if it ranks). | Draft |
| **Language** | English posts are at `/{slug}/`, Arabic at `/ar/{slug}/` (right-to-left). | | English |
| **Type** | *Blog article* is listed in `/blog/`. *Developer page* is listed in `/snagging-by-developer/` (Emaar, DAMAC, a project…). | Developer pages only with genuine, useful content (client rule: no thin pages). | Blog article |
| **Publish date (UAE time)** | The "Published" date on the post. For Scheduled posts, when it goes live. Click anywhere in the box to open the calendar. | For old posts brought over from the previous site, use their original date. | Now (when Published) |
| **Featured image** | Big photo at the top of the post and on its `/blog/` card. Also used in Google's article data. | Our own inspection photo, landscape, at least 1200 px wide. *Upload* or a path like `/images/scope/tiling.jpg`. | No photo (grey card) |
| **Featured image alt text** | Describes the photo for Google Images and screen readers. | Plain description of what is in the photo, no keyword lists. *Inspector checking floor tiles with a moisture meter* | Title is used |
| **Category** | Shown on the `/blog/` card (e.g. *Snagging Guides · 13 Mar 2026*). | Pick the closest one. | No category |
| **Tags** | A few topic words. **Not shown on the site**; for your own sorting. | *civil, structural, waterproofing* | — |
| **Location** | Emirate the post is about. **Not shown on the site**; for your own sorting. | UAE-wide unless the post is about one emirate. | UAE-wide |
| **Related service** | Where the black "Book a snagging inspection" box at the end of the post links. | The closest service or emirate page, e.g. `/hvac-mep-inspection/` for an MEP post. | Homepage quote form |
| **Author** | Author name in Google's article data (not shown on the page). | *Property Inspector Team* | Property Inspectors |
| **Show table of contents** | A "Contents" box linking to the post's headings (shown when there are 3 or more). | Keep ticked for long posts. | — |

## SEO checklist (sidebar)
A live score while you write: focus keyword set and used in the title / description / slug / first 100 words, title 30–60
and description 120–160 characters, H2 headings, at least one internal link, featured image ALT, 600+ words.
It is a guide, not a rule: the old ranking posts keep their original titles and descriptions even when they are longer.
