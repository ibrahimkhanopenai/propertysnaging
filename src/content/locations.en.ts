import { site } from "@/lib/site";
import type { PageContent } from "./types";

export type LocationKey = "dubai" | "abudhabi" | "sharjah" | "ajman" | "rak" | "fujairah" | "uaq";

/**
 * Location pages — each with location-specific content (client rule: no duplicated location pages).
 * Dubai / Abu Dhabi / Sharjah: <title> + description + URL are the old site's (they rank; also identical on
 * truecheckinspection.com). Body copy builds on the WordPress pages (why it matters, areas) but is
 * written per city (2026-10-12).
 */
export const locationsEn: Record<LocationKey, PageContent> = {
  dubai: {
    // Old site title/description kept as-is (page ranks on Google) — see docs/legacy-seo.json
    metaTitle: "Snagging Companies in Dubai | Professional Property Inspections",
    metaTitleAbsolute: true,
    metaDescription: "Are you looking for certified snagging services in Dubai? We inspect villas, apartments & commercial properties and deliver detailed reports. Book Now!!",
    breadcrumb: "Snagging in Dubai",
    navLabel: "Dubai",
    summary: "Our home base — fastest scheduling for handovers across Dubai.",
    h1: "Property snagging services in Dubai",
    hook: "You only get a short window to report defects after handover. Make it count.",
    intro: "Dubai sees thousands of off-plan handovers every year, and developers give buyers a short window to report defects. From our Business Bay office we reach most communities the same day.",
    image: site.images.locations.dubai,
    imageAlt: "Engineer checking floor tiles with a moisture meter during a snagging inspection",
    schema: "service",
    city: "Dubai",
    why: {
      title: "Why snagging matters in Dubai",
      paragraphs: [
        "Towers and villa communities in Dubai go up fast, and the finishing is usually the last thing to be rushed before handover. Then there's the climate: the AC runs most of the year and humidity gets into every gap, so a small fault on day one can be a real repair bill by the end of the first summer.",
        "A snagging inspection gives you a written list of what's wrong, with photos, before you accept the keys and while the developer is still responsible for fixing it. Paying for the same repairs yourself a year later costs a lot more.",
      ],
    },
    communities: ["Dubai Marina & JBR", "Business Bay", "Downtown Dubai", "Palm Jumeirah", "Dubai Hills Estate", "JVC & JVT", "Arabian Ranches", "Damac Hills", "Dubai Creek Harbour", "Meydan & MBR City", "Dubai South"],
    faqs: [
      { q: "How quickly can you inspect in Dubai?", a: "We usually schedule Dubai inspections within a few days, and reports are delivered within 6 to 24 hours." },
      { q: "Do you cover all Dubai communities?", a: "Yes — from Dubai Marina to Dubai South and everything in between." },
      { q: "How much does snagging cost in Dubai?", a: "The price is based on the built-up area of your property. Enter your area in the quote form on this page to see an estimate; we confirm the final price before booking." },
      { q: "Do I need to be there during the inspection?", a: "No. It helps if you can come at the end so the engineer can show you the main findings, but you can also arrange key access with the developer or your agent." },
    ],
    related: ["apartmentSnagging", "villaSnagging", "handoverInspection", "dlpInspection"],
  },
  abudhabi: {
    // Old site title/description kept as-is (page ranks on Google) — see docs/legacy-seo.json
    metaTitle: "Best Property Snagging Abu Dhabi | Professional Inspections UAE",
    metaTitleAbsolute: true,
    metaDescription: "Expert property snagging services in Abu Dhabi & UAE. Get detailed inspection reports before handover to find defects and protect your investment. Book now",
    breadcrumb: "Snagging in Abu Dhabi",
    navLabel: "Abu Dhabi",
    summary: "Large villa communities on Yas, Saadiyat and Al Reem.",
    h1: "Property snagging services in Abu Dhabi",
    hook: "Bigger homes, more AC zones, more to check. We plan Abu Dhabi inspections with that in mind.",
    intro: "Abu Dhabi's newer communities are dominated by large villas and townhouses on master-planned islands. These homes have more outdoor area, more AC zones and more to check — so we plan Abu Dhabi inspections with extra time on site.",
    image: site.images.locations.abudhabi,
    imageAlt: "Engineer testing a bathroom basin and tap during a snagging inspection",
    schema: "service",
    city: "Abu Dhabi",
    why: {
      title: "Why snagging matters in Abu Dhabi",
      paragraphs: [
        "A lot of what's being handed over in Abu Dhabi is big: villas and townhouses on Yas, Saadiyat and Al Reem, plus new towers on Al Reem and along Al Raha Beach. A bigger home means more rooms, more bathrooms and more AC units, so there's simply more that can go wrong.",
        "The summer heat is hard on air conditioning, roof waterproofing and outside drainage. If a defect is in your snagging report before handover, fixing it is the developer's job. If it turns up after you've moved in, you may end up chasing it yourself.",
      ],
    },
    communities: ["Yas Island", "Saadiyat Island", "Al Reem Island", "Al Raha Beach", "Al Reef", "Masdar City", "Khalifa City", "Al Shamkha", "Al Khalidiyah", "Al Zahiyah", "Al Nahyan", "Al Markaziyah"],
    faqs: [
      { q: "Is there an extra charge for Abu Dhabi?", a: "Contact us with your property details and location — we confirm the full price before booking." },
      { q: "How long does a villa inspection take in Abu Dhabi?", a: "Most villas take 3–5 hours. Very large homes can take longer; we'll tell you what to expect when you book." },
      { q: "Do you inspect apartments on Al Reem and Al Raha Beach?", a: "Yes. Apartments are usually quicker than villas, and you get the same detailed photo report." },
    ],
    related: ["villaSnagging", "townhouseSnagging", "handoverInspection", "thermalImaging"],
  },
  sharjah: {
    // Old site title/description kept as-is (page ranks on Google) — see docs/legacy-seo.json
    metaTitle: "Expert Property Snagging Sharjah | Inspection Services UAE",
    metaTitleAbsolute: true,
    metaDescription: "Professional property snagging services in Sharjah, UAE. Get detailed inspection reports to spot defects before handover and protect your investment. Book now",
    breadcrumb: "Snagging in Sharjah",
    navLabel: "Sharjah",
    summary: "Fast-growing new communities and resale apartments.",
    h1: "Property snagging services in Sharjah",
    hook: "New community or older building, we'll tell you plainly what needs fixing before you sign.",
    intro: "Sharjah's new master communities have brought a wave of first-time handovers, alongside a large stock of older apartment buildings. We inspect both — new-build snagging and condition checks for resale homes.",
    image: site.images.locations.sharjah,
    imageAlt: "Engineer checking a freshly painted wall with a torch during a snagging inspection",
    schema: "service",
    city: "Sharjah",
    why: {
      title: "Why snagging matters in Sharjah",
      paragraphs: [
        "Sharjah has two very different kinds of homes. New communities like Aljada, Tilal City and Al Zahia are handing over thousands of first homes, while Al Majaz, Al Khan and Al Nahda are full of older apartment buildings that change hands every year.",
        "New homes tend to have finishing and MEP snags the developer should fix before you move in. Older ones usually hide wear: tired AC units, old plumbing and signs of past leaks. Either way, knowing before you sign gives you something to negotiate with.",
      ],
    },
    communities: ["Aljada", "Tilal City", "Al Zahia", "Muwaileh", "Al Mamsha", "Sharjah Waterfront City", "Al Khan", "Al Majaz", "Al Nahda", "Al Qasimia", "Al Taawun", "Al Qasba", "Al Qulayaa", "Al Rolla"],
    faqs: [
      { q: "Do you inspect older apartments in Sharjah?", a: "Yes. Our secondary property inspection is designed for lived-in and older homes." },
      { q: "Can you inspect a Sharjah apartment before I buy it?", a: "Yes. A pre-purchase inspection shows you the real condition before you sign, so you can negotiate on price or ask the seller to fix things first." },
      { q: "How soon will I get the report?", a: "Within 6–24 hours of the inspection, with photos of every defect and what should be done about it." },
    ],
    related: ["apartmentSnagging", "secondaryInspection", "prePurchase", "handoverInspection"],
  },
  ajman: {
    metaTitle: "Property Snagging Ajman | Apartment & Villa Inspection",
    metaDescription: "Property snagging and inspection in Ajman for new apartments, villas and resale homes. Independent engineers, detailed photo reports and fast turnaround.",
    breadcrumb: "Snagging in Ajman",
    navLabel: "Ajman",
    summary: "New apartments and value-focused buyers.",
    h1: "Property snagging services in Ajman",
    hook: "On a tight budget, every repair the developer pays for is money you keep.",
    intro: "Ajman attracts many first-time buyers and investors looking for value. On a tighter budget, it's even more important that repairs are paid by the developer, not by you — that's what a snagging report helps achieve.",
    image: site.images.locations.ajman,
    imageAlt: "Engineer testing a kitchen sink and its drainage during an apartment inspection",
    schema: "service",
    city: "Ajman",
    why: {
      title: "Why snagging matters in Ajman",
      paragraphs: [
        "Ajman is where a lot of first-time buyers and investors start, with new towers in Al Zorah, Emirates City and Ajman Downtown. Prices are lower than in Dubai, but repair bills aren't, so a missed defect hurts more.",
        "If you plan to rent the flat out, anything found after handover turns into tenant complaints and call-out fees. A snagging report before you take the keys puts those repairs on the developer's list instead.",
      ],
    },
    communities: ["Al Zorah", "Emirates City", "Ajman Downtown", "Al Nuaimiya", "Al Rashidiya", "Al Yasmeen", "Al Helio"],
    faqs: [
      { q: "How do I book an inspection in Ajman?", a: "Send us your property type, location and preferred date through the quote form or WhatsApp, and we confirm a slot." },
      { q: "Is it worth it for a small apartment?", a: "Usually, yes. Even a studio can have a dozen snags, and the price is based on the built-up area, so smaller homes cost less to inspect." },
    ],
    related: ["apartmentSnagging", "prePurchase", "secondaryInspection", "sharjah"],
  },
  rak: {
    metaTitle: "Property Snagging Ras Al Khaimah | RAK Home Inspection",
    metaDescription: "Property snagging in Ras Al Khaimah for beachfront apartments and villas on Al Marjan Island, Mina Al Arab and Al Hamra. Coastal-focused checks and photo reports.",
    breadcrumb: "Snagging in Ras Al Khaimah",
    navLabel: "Ras Al Khaimah",
    summary: "Beachfront homes where humidity and salt air matter.",
    h1: "Property snagging services in Ras Al Khaimah",
    hook: "Sea air is hard on new homes. We check the things it damages first.",
    intro: "Many of RAK's new homes sit right on the coast. Sea air and high humidity are tough on metal fixings, window seals, external paint and AC outdoor units, so our RAK inspections pay extra attention to them.",
    image: site.images.locations.rak,
    imageAlt: "Engineer inspecting an AC unit through a ceiling access panel",
    schema: "service",
    city: "Ras Al Khaimah",
    why: {
      title: "Why snagging matters in Ras Al Khaimah",
      paragraphs: [
        "A lot of RAK's new supply is on the water: apartments and villas on Al Marjan Island, Mina Al Arab and around Al Hamra. Salt air and humidity start working on metal fixings, seals and outside paint from the first day, so something that looks minor at handover can get worse quickly.",
        "Many buyers here are investors or holiday-home owners who live somewhere else. An independent inspection means someone checks the property properly even if you can't be there for the handover.",
      ],
    },
    communities: ["Al Marjan Island", "Mina Al Arab", "Al Hamra Village", "Julphar", "Al Nakheel", "Seih Al Uraibi"],
    faqs: [
      { q: "Can you inspect if I live abroad?", a: "Yes. Arrange key access with the developer or your agent and we'll handle the inspection and send you the report." },
      { q: "Do you inspect villas in Al Hamra and Mina Al Arab?", a: "Yes, villas and townhouses as well as apartments. For villas we also check the roof, outside areas and every AC unit." },
    ],
    related: ["apartmentSnagging", "villaSnagging", "moistureDetection", "handoverInspection"],
  },
  fujairah: {
    metaTitle: "Property Snagging Fujairah | Home Inspection Fujairah",
    metaDescription: "Property snagging and inspection in Fujairah for new and resale homes on the east coast. Independent engineers and detailed photo reports.",
    breadcrumb: "Snagging in Fujairah",
    navLabel: "Fujairah",
    summary: "East-coast homes, inspected by appointment.",
    h1: "Property snagging services in Fujairah",
    hook: "Heavier rain and sea humidity mean drainage and waterproofing are the first things we test.",
    intro: "Fujairah's east-coast location brings its own conditions — humidity from the sea and heavier rain events from the mountains than the west coast. Good waterproofing and drainage matter here.",
    image: site.images.locations.fujairah,
    imageAlt: "Engineer testing a wall socket during a snagging inspection",
    schema: "service",
    city: "Fujairah",
    why: {
      title: "Why snagging matters in Fujairah",
      paragraphs: [
        "Fujairah sits between the mountains and the sea, so homes here deal with humid air and, a few times a year, much heavier rain than the west coast gets. Roofs, balconies and wet areas are where that shows up first.",
        "We inspect here by appointment and plan the trip around your handover or purchase date, so the report still reaches you in time to act on it.",
      ],
    },
    communities: ["Fujairah City", "Dibba Al Fujairah", "Al Aqah", "Kalba (nearby)"],
    faqs: [
      { q: "Do you cover all of Fujairah?", a: "We cover Fujairah city and the wider emirate by appointment. Tell us your location when requesting a quote." },
      { q: "How far ahead should I book?", a: "Ideally a week or two before your deadline, so we can plan the trip and still get the report to you in time." },
    ],
    related: ["moistureDetection", "villaSnagging", "prePurchase", "rak"],
  },
  uaq: {
    metaTitle: "Property Snagging Umm Al Quwain | UAQ Home Inspection",
    metaDescription: "Property snagging in Umm Al Quwain for new waterfront developments and resale homes. Engineer-led inspections and clear photo reports.",
    breadcrumb: "Snagging in Umm Al Quwain",
    navLabel: "Umm Al Quwain",
    summary: "Emerging waterfront communities and resale homes.",
    h1: "Property snagging services in Umm Al Quwain",
    hook: "New waterfront homes and older villas need different checks. We do both.",
    intro: "Umm Al Quwain is seeing new waterfront and residential projects alongside its established neighbourhoods. Whether you're collecting keys to a new home or buying resale, an independent inspection tells you exactly what you're getting.",
    image: site.images.locations.uaq,
    imageAlt: "Thermal camera checking AC performance during a property inspection",
    schema: "service",
    city: "Umm Al Quwain",
    why: {
      title: "Why snagging matters in Umm Al Quwain",
      paragraphs: [
        "Umm Al Quwain is quieter than its neighbours, but new waterfront and residential projects are bringing first handovers alongside established areas like Al Salamah and Al Raas.",
        "With a new home, the aim is a complete snag list for the developer. With an older one, it's knowing what you're buying: how old the AC is, whether the plumbing has leaked before and whether past repairs were done properly.",
      ],
    },
    communities: ["UAQ waterfront developments", "Al Salamah", "Al Raas", "Al Ramlah", "Umm Al Quwain city centre"],
    faqs: [
      { q: "How far in advance should I book in UAQ?", a: "Ideally one to two weeks before your handover or purchase deadline." },
      { q: "Can you inspect a UAQ villa before I buy it?", a: "Yes. A pre-purchase inspection gives you the real condition of the villa before you commit, so there are no surprises after transfer." },
    ],
    related: ["handoverInspection", "secondaryInspection", "prePurchase", "ajman"],
  },
};
