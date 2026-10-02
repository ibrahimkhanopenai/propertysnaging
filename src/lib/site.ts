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
  googleVerification: "-YIH_uBxgbK6qZ5zg5zQhJkHvjr5wf9zuGE86ieb1sI", // from current WordPress site
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
    { key: "ded", image: "/wp-content/uploads/2025/11/Untitled-Photoroom.png" },
    { key: "internachi1", image: "/wp-content/uploads/2025/11/snagging-certificate-1.jpg" },
    { key: "internachi2", image: "/wp-content/uploads/2025/11/snagging-certificate-2.jpg" },
  ],
  /** Real inspection photos from the current site — used until Admin → Gallery has images */
  defaultGallery: [
    "/wp-content/uploads/2025/11/20251024_123029-rotated-e1762517560680-400x500.jpg",
    "/wp-content/uploads/2025/11/20251024_112841-400x500.jpg",
    "/wp-content/uploads/2025/11/20251024_105721-400x500.jpg",
    "/wp-content/uploads/2025/11/20251024_103650-400x500.jpg",
    "/wp-content/uploads/2025/11/20251024_103511-rotated-e1762517524996-400x500.jpg",
    "/wp-content/uploads/2025/11/20251024_103456-rotated-e1762517575117-400x500.jpg",
    "/wp-content/uploads/2025/12/HVAC_2-768x1024.jpg",
    "/wp-content/uploads/2025/12/Plumbing_2-768x1024.jpg",
    "/wp-content/uploads/2025/12/Elect_2-768x1024.jpg",
    "/wp-content/uploads/2025/12/Exterior_2-461x1024.jpg",
    "/wp-content/uploads/2025/12/Tiling_2.png",
    "/wp-content/uploads/2025/12/Roof_2.png",
  ],
  areaServed: ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Ajman"],
  pdfs: {
    profile: "/wp-content/uploads/2026/02/PROFILE-Property-Inspectors.pdf",
    sampleReport: "/wp-content/uploads/2026/02/Sample-Report-PropertyInspectors.pdf",
    checklist: "/wp-content/uploads/2026/02/CHECKLIST-Property-Inspector.pdf",
    tools: "/wp-content/uploads/2026/02/INSPECTION-TOOLS-PropertyInspectors.pdf",
  },
  /** Real photos from the current site (downloaded by `npm run assets:download`) */
  images: {
    logo: "/wp-content/uploads/2025/11/cropped-Black-Logo-scaled-1-e1766401717246.png",
    og: "/wp-content/uploads/2025/11/4963222-removebg-preview-1.png",
    hero: "/wp-content/uploads/2025/11/20251122_142826-scaled.jpg",
    about: "/wp-content/uploads/2025/11/premium_photo-1661604355750-2074610af15d-1024x683.jpg",
    report: [
      "/wp-content/uploads/2025/11/report-1.jpg",
      "/wp-content/uploads/2025/11/report-2.jpg",
      "/wp-content/uploads/2025/11/report-3.jpg",
    ],
    scope: {
      hvac: "/wp-content/uploads/2025/12/HVAC__1-768x1024.jpg",
      plumbing: "/wp-content/uploads/2025/12/Plumbing_1-768x1024.jpg",
      electrical: "/wp-content/uploads/2025/12/Elect__1-768x1024.jpg",
      paint: "/wp-content/uploads/2025/12/Paint___Wall_1-768x1024.jpg",
      windows: "/wp-content/uploads/2025/12/Windows.png",
      tiling: "/wp-content/uploads/2025/12/Tiling_1-1024x768.jpg",
      exterior: "/wp-content/uploads/2025/12/Exterior_1-461x1024.jpg",
      roof: "/wp-content/uploads/2025/12/Roof_1.png",
    },
    locations: {
      dubai: "/wp-content/uploads/2026/03/Dubai-Image-for-Blog-Landscape.png",
      abudhabi: "/wp-content/uploads/2025/11/20251122_151424-scaled.jpg",
      sharjah: "/wp-content/uploads/2025/11/20251122_141146-scaled.jpg",
      rak: "/wp-content/uploads/2025/11/20251122_165807-scaled.jpg",
    },
  },
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
