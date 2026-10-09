/**
 * Single source of truth for business details.
 * Items marked DUMMY must be replaced with real data before launch
 * (tracked in docs/assumptions-and-todo.md).
 */
export const site = {
  name: "Property Inspectors",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://propertyinspectors.me").replace(/\/$/, ""),
  phone: "+971581551637",
  phoneDisplay: "+971 58 155 1637",
  whatsapp: "971581551637",
  email: "info@propertyinspectors.me", // DUMMY — confirm real inbox
  address: {
    street: "The Binary Tower by Omniyat, 19th Floor, Office 277, Marasi Drive",
    locality: "Business Bay",
    city: "Dubai",
    country: "AE",
  },
  /** Google Maps link for the office address (footer + contact strip) */
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Binary+Tower+by+Omniyat+Marasi+Drive+Business+Bay+Dubai",
  hours: "Mo-Sa 08:00-20:00", // DUMMY
  dedLicense: "DED-000000", // DUMMY
  googleVerification: "-YIH_uBxgbK6qZ5zg5zQhJkHvjr5wf9zuGE86ieb1sI", // from the old site — keeps Search Console verified
  /** true until the real profile URLs below are confirmed — sameAs is omitted from schema meanwhile */
  socialIsPlaceholder: true,
  social: {
    instagram: "https://www.instagram.com/propertyinspectors", // DUMMY
    linkedin: "https://www.linkedin.com/company/propertyinspectors", // DUMMY
    facebook: "https://www.facebook.com/propertyinspectors", // DUMMY
  },
  /**
   * Trust statistics. Client rule: show GENUINE numbers only.
   * genuine:true = taken from the current company site; false = DUMMY, must be confirmed before launch.
   */
  stats: [
    { key: "inspections", value: "1,500+", genuine: false }, // DUMMY
    { key: "years", value: "10+", genuine: false }, // DUMMY
    { key: "points", value: "300+", genuine: false }, // DUMMY — inspection points per property
    { key: "turnaround", value: "6–24h", genuine: true },
    { key: "hours", value: "10,000+", genuine: true },
  ] as const,
  /** Google Business Profile — DUMMY link, replace with the real "write a review" / profile URL */
  googleReviewUrl: "https://www.google.com/maps/search/?api=1&query=Property+Inspectors+Business+Bay+Dubai",
  /** Placeholder until real reviews are added in Admin → Reviews */
  reviews: { rating: "4.9", count: "100+", isPlaceholder: true },
  /** Credentials shown in the trust section (images from the current site) */
  credentials: [
    { key: "ded", image: "/images/credentials/government-of-dubai.png" },
    { key: "internachi1", image: "/images/credentials/internachi-certificate-1.jpg" },
    { key: "internachi2", image: "/images/credentials/internachi-certificate-2.jpg" },
  ],
  /**
   * Developer logos from the current site's homepage strip (white logos — show on a dark background).
   * "Dubai Properties" is left out: its file only contains the red tick, the wordmark is missing.
   */
  developers: [
    { name: "Atlantis The Royal", logo: "/images/developers/atlantis-the-royal.png", width: 576, height: 223 },
    { name: "DAMAC", logo: "/images/developers/damac.png", width: 400, height: 92 },
    { name: "Danube Properties", logo: "/images/developers/danube-properties.png", width: 340, height: 128 },
    { name: "wasl", logo: "/images/developers/wasl.png", width: 111, height: 84 },
    { name: "Ellington Properties", logo: "/images/developers/ellington-properties.png", width: 499, height: 189 },
    { name: "Emaar", logo: "/images/developers/emaar.png", width: 964, height: 245 },
    { name: "Meraas", logo: "/images/developers/meraas.png", width: 354, height: 142 },
    { name: "Select Group", logo: "/images/developers/select-group.png", width: 202, height: 87 },
    { name: "Sobha Realty", logo: "/images/developers/sobha-realty.png", width: 478, height: 190 },
  ],
  /** Real inspection photos from the current site — used until Admin → Gallery has images */
  defaultGallery: [
    "/images/gallery/external-works-inspection.jpg",
    "/images/gallery/wall-finish-defect.jpg",
    "/images/gallery/wall-level-check.jpg",
    "/images/gallery/wall-surface-check.jpg",
    "/images/gallery/mirror-fixture-check.jpg",
    "/images/gallery/shower-glass-inspection.jpg",
    "/images/gallery/hvac-inspection.jpg",
    "/images/gallery/plumbing-inspection.jpg",
    "/images/gallery/electrical-inspection.jpg",
    "/images/gallery/exterior-inspection.jpg",
    "/images/gallery/tiling-inspection.png",
    "/images/gallery/roof-inspection.png",
  ],
  /**
   * Real testimonials carried over from the current site — shown until Admin → Reviews has entries.
   * DUMMY ratings: the source quotes had no star value, represented here as 5★; confirm before launch.
   */
  defaultReviews: [
    { name: "Norah", location: "Marina, Dubai", rating: 5, text: "Excellent snagging service — they caught issues I wouldn't have noticed. Highly professional and detailed." },
    { name: "Marshal J.", location: "JVT, Dubai", rating: 5, text: "The report was so detailed and clear. It helped us get our developer to fix many issues before handover." },
    { name: "Eldo R.", location: "Al Furjan, Dubai", rating: 5, text: "Professional, responsive and thorough. Their snagging report saved me from expensive repairs later." },
  ],
  areaServed: ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Ajman"],
  pdfs: {
    profile: "/downloads/property-inspectors-company-profile.pdf",
    sampleReport: "/downloads/property-inspectors-sample-snagging-report.pdf",
    checklist: "/downloads/property-inspectors-snagging-checklist.pdf",
    tools: "/downloads/property-inspectors-inspection-tools.pdf",
  },
  /**
   * Images live in /public/images/<section>/ (lowercase-hyphen names). To replace one, overwrite the
   * file with the SAME name. Old site paths 301 here via src/lib/legacy-redirects.ts.
   */
  images: {
    /** Official logo supplied by the client (2026-10-02), transparent PNGs */
    logo: "/images/logo.png",
    logoWhite: "/images/logo-white.png",
    og: "/images/brand/og-image.png",
    /** Hero image supplied by the client (2026-10-02), 1200×919, white background */
    hero: "/images/hero-city-in-hand.jpg",
    about: "/images/about/property-handover.jpg",
    report: [
      "/images/reports/sample-report-page-1.jpg",
      "/images/reports/sample-report-page-2.jpg",
      "/images/reports/sample-report-page-3.jpg",
    ],
    scope: {
      hvac: "/images/scope/hvac.jpg",
      plumbing: "/images/scope/plumbing.jpg",
      electrical: "/images/scope/electrical.jpg",
      paint: "/images/scope/paint-and-walls.jpg",
      windows: "/images/scope/windows-and-doors.png",
      tiling: "/images/scope/tiling.jpg",
      exterior: "/images/scope/exterior.jpg",
      roof: "/images/scope/roof.png",
    },
    /** No Dubai photo yet (the old file was already deleted) — add `dubai` here and in content/locations.*.ts */
    locations: {
      abudhabi: "/images/locations/abu-dhabi.jpg",
      sharjah: "/images/locations/sharjah.jpg",
      rak: "/images/locations/ras-al-khaimah.jpg",
    },
  },
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
