import { site } from "@/lib/site";
import type { PageContent } from "./types";

export type OtherPageKey =
  | "about" | "scopeOfWork" | "realEstateAgents" | "developers" | "companyProfile"
  | "sampleReport" | "checkList" | "inspectionTools" | "downloadBrochure" | "privacy" | "terms";

/**
 * English copy for every non-home page.
 * metaTitle/metaDescription: sync with docs/legacy-seo.json (run `npm run wp:seo-export`)
 * before launch so rankings are not disturbed.
 */
export const pagesEn: Record<OtherPageKey, PageContent> = {
  about: {
    metaTitle: "About Us | DED Licensed Snagging Company in the UAE",
    metaDescription: "Property Inspectors is a DED-licensed, InterNACHI-certified snagging company with experienced engineers serving Dubai, Abu Dhabi, Sharjah and the wider UAE.",
    breadcrumb: "About us",
    h1: "Your trusted property inspection partner in the UAE",
    intro: "We give homeowners, buyers and investors an accurate, independent picture of their property, so they can make decisions with confidence.",
    image: site.images.about,
    sections: [
      { title: "Our story", paragraphs: ["Property Inspectors was founded by engineers from the construction and inspection industry who saw how often buyers accepted homes with hidden defects. We set out to make detailed, unbiased inspections the normal step before handover and purchase.", "Today our engineers — each with over 10,000 hours of inspection experience — inspect apartments, villas, townhouses and commercial units across the UAE."] },
      { title: "Our values", bullets: ["Independence: we inspect and report; we don't sell repairs", "Accuracy: every defect is photographed, located and rated", "Clarity: reports written for owners, not just engineers", "Speed: reports within 6–24 hours"] },
      { title: "Licensed and certified", paragraphs: ["We are licensed by Dubai's Department of Economy and Tourism (DED) and our engineers are certified by InterNACHI, the International Association of Certified Home Inspectors."] },
    ],
    related: ["snaggingServices", "sampleReport", "scopeOfWork"],
  },
  scopeOfWork: {
    metaTitle: "What We Inspect | Snagging Scope of Work",
    metaDescription: "What a Property Inspectors snagging covers: structure and finishes, electrical, plumbing, HVAC, waterproofing and moisture, kitchens, bathrooms and external areas.",
    breadcrumb: "What we inspect",
    h1: "What we inspect",
    intro: "Every inspection follows the same detailed checklist. Each system is tested with professional tools, and every defect is photographed and located in your report.",
    sections: [
      { id: "structural", title: "Structural and civil", paragraphs: ["Walls, ceilings, floors, visible cracks, tiles, doors, windows and all finishes — checked for level, alignment, damage and workmanship."] , bullets: ["Cracks and plaster defects", "Hollow, chipped or uneven tiles", "Door and window alignment, gaps and hardware", "Paint coverage and finish quality"] },
      { id: "electrical", title: "Electrical", paragraphs: ["We test every point we can safely reach."], bullets: ["DB panel labelling and condition", "Socket polarity, earthing and alignment", "Switches and lighting", "Earth leakage / safety devices"] },
      { id: "plumbing", title: "Plumbing", bullets: ["Water pressure at every outlet", "Visible and suspected leaks", "Drainage speed and blockages", "Fixtures and water heaters"] },
      { id: "hvac", title: "HVAC", bullets: ["Cooling performance and supply air temperature", "Airflow at diffusers", "Thermostats and controls", "FCU condition and condensate drainage", "Condenser / outdoor units"] },
      { id: "moisture", title: "Waterproofing and moisture", paragraphs: ["Moisture meters and thermal imaging in bathrooms, kitchens, balconies, terraces and below roofs to spot damp and waterproofing failures early."] },
      { id: "kitchen", title: "Kitchen", bullets: ["Cabinets, doors and hinges", "Countertops and joints", "Appliances (where installed)", "Plumbing and electrical points"] },
      { id: "bathroom", title: "Bathroom", bullets: ["Sanitaryware and fittings", "Showers and drainage falls", "Grouting and silicone", "Waterproofing indicators"] },
      { id: "external", title: "External areas", bullets: ["Balconies and terraces", "External walls and paint", "Railings and balustrades", "Gardens, drainage and boundary walls (villas)"] },
    ],
    related: ["snaggingServices", "thermalImaging", "hvacMep", "moistureDetection"],
  },
  realEstateAgents: {
    metaTitle: "Partnership for Real Estate Agents | Snagging Partner UAE",
    metaDescription: "Partner with Property Inspectors to give your buyers and tenants trusted snagging and inspection reports across the UAE.",
    breadcrumb: "Real estate agents",
    h1: "A snagging partner for real estate agents",
    intro: "Give your clients an independent inspection report that builds trust and helps deals close smoothly.",
    sections: [
      { title: "How the partnership works", bullets: ["Refer a client by WhatsApp or email", "We schedule and inspect quickly", "Your client receives a clear photo report", "You get updates throughout"] },
      { title: "Why agents work with us", paragraphs: ["Fast turnaround, clear reports and professional engineers that reflect well on your brand."] },
    ],
  },
  developers: {
    metaTitle: "Snagging & Quality Audits for Developers | UAE",
    metaDescription: "Pre-handover snagging, building handover inspections and quality audits for developers and contractors across the UAE.",
    breadcrumb: "Developers",
    h1: "Snagging and quality audits for developers",
    intro: "Independent pre-handover inspections that help you deliver defect-free units and fewer post-handover complaints.",
    schema: "service",
    sections: [
      { title: "Services for developers and contractors", bullets: ["Pre-handover snagging for full buildings and communities", "Building handover inspection", "Asset and building condition audits", "Third-party maintenance audits", "Commercial fit-out inspections"] },
      { title: "Reporting built for project teams", paragraphs: ["Structured defect lists with photos, locations and severity, ready for your contractors to action."] },
    ],
  },
  companyProfile: {
    metaTitle: "Company Profile | Property Inspectors UAE",
    metaDescription: "Download the Property Inspectors company profile: our team, certifications, services and coverage across the UAE.",
    breadcrumb: "Company profile",
    h1: "Company profile",
    intro: "Our team, certifications, services and coverage in one PDF.",
    download: { href: site.pdfs.profile },
    sections: [],
  },
  sampleReport: {
    metaTitle: "Sample Snagging Report | See What You Get",
    metaDescription: "Download a sample snagging report from Property Inspectors with defect photos, locations, severity and engineer recommendations.",
    breadcrumb: "Sample report",
    h1: "Sample snagging report",
    intro: "See exactly what you will receive: defect photos, locations, severity and engineer recommendations.",
    image: site.images.report[0],
    download: { href: site.pdfs.sampleReport },
    sections: [],
    related: ["handoverInspection", "scopeOfWork", "snaggingServices"],
  },
  checkList: {
    metaTitle: "Property Snagging Checklist | Free PDF",
    metaDescription: "Download our property snagging checklist to understand what is inspected before handover in the UAE.",
    breadcrumb: "Checklist",
    h1: "Property snagging checklist",
    intro: "The checklist our engineers use, room by room, before handover.",
    download: { href: site.pdfs.checklist },
    sections: [],
  },
  inspectionTools: {
    metaTitle: "Our Inspection Tools | Property Inspectors",
    metaDescription: "The professional tools our engineers use for snagging: thermal cameras, moisture meters, socket testers and more.",
    breadcrumb: "Inspection tools",
    h1: "Inspection tools",
    intro: "Thermal cameras, moisture meters, socket testers and more. The equipment behind every report.",
    download: { href: site.pdfs.tools },
    sections: [],
  },
  downloadBrochure: {
    metaTitle: "Download Brochure | Property Inspectors",
    metaDescription: "Download the Property Inspectors brochure to learn about our snagging and inspection services in the UAE.",
    breadcrumb: "Brochure",
    h1: "Download our brochure",
    intro: "Everything about our snagging and inspection services in one document.",
    download: { href: site.pdfs.profile },
    sections: [],
  },
  privacy: {
    metaTitle: "Privacy Policy",
    metaDescription: "How Property Inspectors collects, uses and protects your personal information.",
    breadcrumb: "Privacy policy",
    h1: "Privacy policy",
    intro: "This policy explains what information we collect when you contact or book with us, and how we use it.",
    sections: [
      { title: "Information we collect", paragraphs: ["Your name, phone number, email and property details when you request a quote or book an inspection."] },
      { title: "How we use it", paragraphs: ["Only to respond to your request, schedule inspections and deliver reports. We do not sell your data."] },
      { title: "Contact", paragraphs: [`For any privacy question, email ${site.email}.`] },
    ],
  },
  terms: {
    metaTitle: "Terms and Conditions",
    metaDescription: "Terms and conditions for Property Inspectors snagging and inspection services.",
    breadcrumb: "Terms and conditions",
    h1: "Terms and conditions",
    intro: "These terms apply to all inspections booked with Property Inspectors.",
    sections: [
      { title: "Scope", paragraphs: ["Inspections are visual and non-destructive, using the tools listed in our scope of work, unless agreed otherwise in writing."] },
      { title: "Reports", paragraphs: ["Reports reflect the property's condition at the time of inspection and are prepared for the client who booked the service."] },
    ],
  },
};
