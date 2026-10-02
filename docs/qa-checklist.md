# Pre-launch QA checklist (client report §17)

Run `npm run build && npm start`, then `npm run seo:audit -- http://localhost:3000` (checks H1, titles, descriptions, canonicals, duplicates, ALT, broken links, robots, sitemap).

- [ ] Every important page has exactly one H1 (audit)
- [ ] Unique SEO title + meta description on every page (audit) — compare legacy pages with `docs/legacy-seo.json`
- [ ] URLs clean, trailing slash, legacy URLs unchanged (`docs/seo-migration.md`)
- [ ] `/sitemap.xml` and `/robots.txt` correct
- [ ] Canonical tags (audit) + hreflang on EN/AR pages
- [ ] Structured data valid — test 3–4 pages in Google Rich Results Test
- [ ] Internal links: related services + other emirates blocks present; no broken links (audit)
- [ ] Mobile usability: nav, mega menu → mobile accordion, floating call/WhatsApp bar, pop-up as bottom sheet
- [ ] Page speed: Lighthouse mobile ≥ 90 on Home, a service page and a blog post
- [ ] Test every form: quote (home), contact page, pop-up → lead in Admin → Leads + email received
- [ ] Test every WhatsApp and phone button on iPhone + Android
- [ ] GA4/GTM: `generate_lead`, `click_call`, `click_whatsapp` visible in DebugView
- [ ] No duplicate content (service/location pages are unique; blog checklist post not duplicated by draft)
- [ ] No 404s for old WordPress URLs (crawl the old sitemap list)
- [ ] HTTPS everywhere, HTTP → HTTPS redirect at the proxy
- [ ] DUMMY data replaced (`docs/assumptions-and-todo.md`)
- [ ] After launch: resubmit sitemap in Search Console
