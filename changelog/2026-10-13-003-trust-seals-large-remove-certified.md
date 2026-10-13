# 2026-10-13-003 — Large credential seals in the trust section; "Certified by InterNACHI" section removed

**Agent/Author:** Claude Code
**Task:** Client: the certificate images in the trust section (under the stats) are too small. Make them as big as in the "Certified by InterNACHI" section, then remove that section.

## What changed
- `TrustSection.tsx`: the small 56×44px logos are replaced by 3 large plates, styled like the old Certified section: a white 4:3 card (max 208px wide, border + soft shadow, logo `object-contain p-5`) with a copper ✓ and the label underneath. Revised after client feedback (the narrow centred grid left the sides empty): the plates now sit in a full-width panel that matches the key-figures row above (rounded border, hairline dividers, 3 equal columns on `bg-mist`, plates up to 240px wide). The columns stack on mobile. Same images (`site.credentials`) and same ALT/labels (`home.trust.credentials`).
- `CertifiedSection.tsx` deleted and removed from the homepage (`app/[locale]/page.tsx`). Its copy (`home.certified`) was removed from `en.ts` and `ar.ts`; nothing else used it.
- Docs: client-requirements (§2 row), design-system (homepage order).
- Checked on the dev server (headless Edge, 1440px + narrow): the 3 seals show large and centred, and the Certified section is gone. typecheck, lint and 87 tests pass.

## Files touched
- src/components/home/TrustSection.tsx
- src/components/home/CertifiedSection.tsx (deleted)
- src/app/[locale]/page.tsx
- src/i18n/dictionaries/{en,ar}.ts
- docs/{client-requirements,design-system}.md

## Decisions & why
- The seals keep the trust-section order (DED, InterNACHI, CPI) from `site.credentials`. The old Certified section showed InterNACHI first.
- No URL changes; the section had no anchor or link pointing to it.

## Follow-ups / known issues
- The InterNACHI explanation paragraph ("known worldwide as the leading association…") is no longer on the homepage. InterNACHI is still mentioned in the hero, the top bar and the trust labels, and the About page covers it.
