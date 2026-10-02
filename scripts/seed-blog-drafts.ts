/**
 * Creates the 10 client-requested blog topics as DRAFTS with SEO fields and an H2 outline.
 * They are NOT published: a writer must complete each article (client rule: useful content, not generic).
 * Skips any slug that already exists. Run: npm run blog:drafts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const drafts = [
  { slug: "what-is-property-snagging", title: "What Is Property Snagging?", kw: "property snagging", meta: "What property snagging means in the UAE, what inspectors check, and why it matters before you accept handover from your developer.", h2: ["What snagging means", "What a snagging inspection covers", "Snagging vs a general property inspection", "When to book", "What happens after the report"] },
  { slug: "property-snagging-checklist-dubai", title: "Property Snagging Checklist Dubai", kw: "snagging checklist dubai", meta: "A room-by-room property snagging checklist for Dubai handovers: finishes, MEP, AC, kitchens, bathrooms, balconies and documents.", h2: ["Before handover day", "Living areas and bedrooms", "Kitchen", "Bathrooms", "Electrical and AC", "Balconies and external areas"], note: "NOTE: /property-snagging-checklist-before-handover-dubai/ already exists (imported from WordPress). Prefer UPDATING that post instead of publishing this one, to avoid duplicate content." },
  { slug: "how-much-does-snagging-cost-in-dubai", title: "How Much Does Snagging Cost in Dubai?", kw: "snagging cost dubai", meta: "What affects the cost of a snagging inspection in Dubai — property type, size, re-inspection — and how to compare quotes fairly.", h2: ["What affects the price", "Apartments vs villas", "What should be included", "Re-inspection costs", "Get an instant quote"] },
  { slug: "when-should-you-arrange-a-snagging-inspection", title: "When Should You Arrange a Snagging Inspection?", kw: "when to do snagging", meta: "The right time to book snagging: pre-handover, handover day, during the DLP and the 11-month inspection — and what each one catches.", h2: ["Pre-handover", "On handover", "During the defect liability period", "The 11-month inspection", "Before buying resale"] },
  { slug: "what-happens-during-property-handover", title: "What Happens During Property Handover?", kw: "property handover dubai", meta: "A step-by-step guide to property handover in the UAE: notices, payments, inspection, snag lists, keys and utilities.", h2: ["The handover notice", "Payments and documents", "Inspecting the property", "Signing with a snag list", "After you get the keys"] },
  { slug: "what-does-a-snagging-report-include", title: "What Does a Snagging Report Include?", kw: "snagging report", meta: "What a professional snagging report includes — defect location, description, photo, severity and recommendation — with examples.", h2: ["How defects are documented", "Severity ratings explained", "Example entries", "Sending the report to your developer", "Tracking fixes"] },
  { slug: "common-defects-in-new-dubai-properties", title: "Common Defects in New Dubai Properties", kw: "common snagging defects dubai", meta: "The defects we find most often in new Dubai apartments and villas, from hollow tiles and silicone gaps to AC and drainage issues.", h2: ["Finishes and tiling", "Doors and windows", "Bathrooms and waterproofing", "Electrical", "AC and ventilation", "External areas"] },
  { slug: "dlp-11-month-inspection-explained", title: "DLP / 11-Month Inspection Explained", kw: "dlp inspection dubai", meta: "What the defect liability period is, what developers must fix, and why an 11-month inspection protects you before it ends.", h2: ["What the DLP is", "What developers must fix", "Defects that appear after move-in", "Timing the 11-month inspection", "How to submit your snag list"] },
  { slug: "apartment-vs-villa-snagging", title: "Apartment vs Villa Snagging", kw: "apartment vs villa snagging", meta: "How snagging differs for apartments and villas — scope, time on site, typical defects and what to expect in the report.", h2: ["Scope differences", "Time on site", "Typical apartment defects", "Typical villa defects", "Which inspection do you need?"] },
  { slug: "things-to-check-before-accepting-a-new-property", title: "Things to Check Before Accepting a New Property", kw: "check before property handover", meta: "The essential checks before you accept a new property in the UAE — and the issues that are expensive to fix after you sign.", h2: ["Documents and payments", "Structure and finishes", "Water and drainage", "Electrical safety", "AC performance", "When to call a professional"] },
];

async function main() {
  for (const d of drafts) {
    const exists = await prisma.post.findFirst({ where: { locale: "en", slug: d.slug } });
    if (exists) {
      console.log("skip (exists)", d.slug);
      continue;
    }
    const content = [
      `> DRAFT OUTLINE — replace with original, useful content before publishing (aim 900–1,500 words).${d.note ? `\n> ${d.note}` : ""}`,
      "",
      ...d.h2.flatMap((h) => [`## ${h}`, "", "_Write this section._", ""]),
      "## Book your inspection",
      "",
      "Need help? [Get an instant quote](/#quote) or [talk to us](/contact-us/).",
    ].join("\n");
    await prisma.post.create({
      data: {
        type: "POST",
        locale: "en",
        status: "DRAFT",
        title: d.title,
        slug: d.slug,
        content,
        metaTitle: `${d.title} | Property Inspectors`.slice(0, 60),
        metaDescription: d.meta,
        focusKeyword: d.kw,
        relatedService: "/snagging-services/",
      },
    });
    console.log("✓ draft", `/${d.slug}/`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
