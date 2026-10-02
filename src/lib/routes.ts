/**
 * Registry of every static page. Legacy WordPress paths are IDENTICAL to the old site
 * (see docs/seo-migration.md). Used by sitemap, nav, footer, related links and hreflang.
 * NEVER rename a path — add a redirect instead.
 */
export type RouteGroup = "home" | "service" | "location" | "info" | "download" | "legal" | "blog";

export const staticRoutes = [
  { key: "home", path: "/", group: "home", priority: 1.0, changeFrequency: "weekly", legacy: true },
  // ── Services (hub = legacy) ──
  { key: "snaggingServices", path: "/snagging-services/", group: "service", priority: 0.9, changeFrequency: "monthly", legacy: true },
  { key: "propertyInspection", path: "/property-inspection-dubai/", group: "service", priority: 0.9, changeFrequency: "monthly", legacy: false },
  { key: "villaSnagging", path: "/villa-snagging-dubai/", group: "service", priority: 0.9, changeFrequency: "monthly", legacy: false },
  { key: "apartmentSnagging", path: "/apartment-snagging-dubai/", group: "service", priority: 0.9, changeFrequency: "monthly", legacy: false },
  { key: "townhouseSnagging", path: "/townhouse-snagging-dubai/", group: "service", priority: 0.8, changeFrequency: "monthly", legacy: false },
  { key: "handoverInspection", path: "/handover-inspection-dubai/", group: "service", priority: 0.9, changeFrequency: "monthly", legacy: false },
  { key: "preHandover", path: "/pre-handover-inspection/", group: "service", priority: 0.8, changeFrequency: "monthly", legacy: false },
  { key: "dlpInspection", path: "/dlp-inspection/", group: "service", priority: 0.9, changeFrequency: "monthly", legacy: false },
  { key: "elevenMonth", path: "/11-month-inspection/", group: "service", priority: 0.8, changeFrequency: "monthly", legacy: false },
  { key: "reInspection", path: "/property-re-inspection/", group: "service", priority: 0.7, changeFrequency: "monthly", legacy: false },
  { key: "prePurchase", path: "/pre-purchase-property-inspection/", group: "service", priority: 0.8, changeFrequency: "monthly", legacy: false },
  { key: "secondaryInspection", path: "/secondary-property-inspection/", group: "service", priority: 0.7, changeFrequency: "monthly", legacy: false },
  { key: "thermalImaging", path: "/thermal-imaging-inspection/", group: "service", priority: 0.7, changeFrequency: "monthly", legacy: false },
  { key: "moistureDetection", path: "/moisture-detection-inspection/", group: "service", priority: 0.7, changeFrequency: "monthly", legacy: false },
  { key: "hvacMep", path: "/hvac-mep-inspection/", group: "service", priority: 0.7, changeFrequency: "monthly", legacy: false },
  { key: "scopeOfWork", path: "/scope-of-work/", group: "info", priority: 0.8, changeFrequency: "monthly", legacy: true },
  // ── Locations (Dubai/Abu Dhabi/Sharjah are legacy URLs) ──
  { key: "dubai", path: "/snagging-services-in-dubai/", group: "location", priority: 0.9, changeFrequency: "monthly", legacy: true },
  { key: "abudhabi", path: "/snagging-services-in-abudhabi/", group: "location", priority: 0.9, changeFrequency: "monthly", legacy: true },
  { key: "sharjah", path: "/snagging-services-in-sharjah/", group: "location", priority: 0.9, changeFrequency: "monthly", legacy: true },
  { key: "ajman", path: "/snagging-services-in-ajman/", group: "location", priority: 0.8, changeFrequency: "monthly", legacy: false },
  { key: "rak", path: "/snagging-services-in-ras-al-khaimah/", group: "location", priority: 0.8, changeFrequency: "monthly", legacy: false },
  { key: "fujairah", path: "/snagging-services-in-fujairah/", group: "location", priority: 0.7, changeFrequency: "monthly", legacy: false },
  { key: "uaq", path: "/snagging-services-in-umm-al-quwain/", group: "location", priority: 0.7, changeFrequency: "monthly", legacy: false },
  // ── Company / info ──
  { key: "about", path: "/about-us/", group: "info", priority: 0.7, changeFrequency: "monthly", legacy: true },
  { key: "reviews", path: "/reviews/", group: "info", priority: 0.7, changeFrequency: "weekly", legacy: false },
  { key: "faqs", path: "/faqs/", group: "info", priority: 0.7, changeFrequency: "monthly", legacy: false },
  { key: "contact", path: "/contact-us/", group: "info", priority: 0.8, changeFrequency: "yearly", legacy: false },
  { key: "gallery", path: "/gallery/", group: "info", priority: 0.6, changeFrequency: "weekly", legacy: false },
  { key: "developerHub", path: "/snagging-by-developer/", group: "info", priority: 0.7, changeFrequency: "weekly", legacy: false },
  { key: "realEstateAgents", path: "/real-estate-agents/", group: "info", priority: 0.6, changeFrequency: "monthly", legacy: true },
  { key: "developers", path: "/developers/", group: "info", priority: 0.6, changeFrequency: "monthly", legacy: true },
  { key: "blog", path: "/blog/", group: "blog", priority: 0.8, changeFrequency: "weekly", legacy: true },
  // ── Downloads (legacy) ──
  { key: "sampleReport", path: "/sample-report/", group: "info", priority: 0.8, changeFrequency: "monthly", legacy: true },
  { key: "companyProfile", path: "/company-profile/", group: "download", priority: 0.4, changeFrequency: "yearly", legacy: true },
  { key: "checkList", path: "/check-list/", group: "download", priority: 0.6, changeFrequency: "yearly", legacy: true },
  { key: "inspectionTools", path: "/inspection-tools/", group: "download", priority: 0.4, changeFrequency: "yearly", legacy: true },
  { key: "downloadBrochure", path: "/download-brochure/", group: "download", priority: 0.4, changeFrequency: "yearly", legacy: true },
  // ── Legal ──
  { key: "privacy", path: "/privacy-policy/", group: "legal", priority: 0.2, changeFrequency: "yearly", legacy: false },
  { key: "terms", path: "/terms-and-conditions/", group: "legal", priority: 0.2, changeFrequency: "yearly", legacy: false },
] as const satisfies ReadonlyArray<{ key: string; path: string; group: RouteGroup; priority: number; changeFrequency: string; legacy: boolean }>;

export type RouteKey = (typeof staticRoutes)[number]["key"];

export const routePath = (key: RouteKey): string => {
  const r = staticRoutes.find((x) => x.key === key);
  if (!r) throw new Error(`Unknown route ${key}`);
  return r.path;
};

export const serviceKeys = staticRoutes.filter((r) => r.group === "service").map((r) => r.key as RouteKey);
export const locationKeys = staticRoutes.filter((r) => r.group === "location").map((r) => r.key as RouteKey);
