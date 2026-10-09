/**
 * 301 redirects from the OLD site's image/PDF URLs to their new home in /public.
 * Those URLs are indexed (Google Images) and linked from other sites and chats, so they must keep working.
 * Loaded by next.config.ts. Rules:
 *  - Never delete an entry.
 *  - Moved or renamed a file? Update its new path here (and in src/lib/site.ts).
 * Old SEO values (reference only): docs/legacy-seo.json
 */
const OLD = "/wp-content/uploads/";

/** [old path under OLD, new public path] */
const moved: Array<[string, string]> = [
  // downloads
  ["2026/02/PROFILE-Property-Inspectors.pdf", "/downloads/property-inspectors-company-profile.pdf"],
  ["2026/02/INSPECTION-TOOLS-PropertyInspectors.pdf", "/downloads/property-inspectors-inspection-tools.pdf"],
  ["2026/02/Sample-Report-PropertyInspectors.pdf", "/downloads/property-inspectors-sample-snagging-report.pdf"],
  ["2026/02/CHECKLIST-Property-Inspector.pdf", "/downloads/property-inspectors-snagging-checklist.pdf"],
  // brand
  ["2025/12/cropped-property-inspectors-fav-icon-270x270.jpg", "/icon.jpg"],
  ["2025/12/cropped-property-inspectors-fav-icon.jpg", "/icon.jpg"],
  ["2025/11/4963222-removebg-preview-1.png", "/images/brand/og-image.png"],
  ["2025/11/cropped-Black-Logo-scaled-1-1024x500.png", "/images/logo.png"],
  ["2025/11/cropped-Black-Logo-scaled-1-e1766401717246.png", "/images/logo.png"],
  // credentials
  ["2025/11/Untitled-Photoroom.png", "/images/credentials/government-of-dubai.png"],
  ["2025/11/snagging-certificate-1.jpg", "/images/credentials/internachi-certificate-1.jpg"],
  ["2025/11/snagging-certificate-2.jpg", "/images/credentials/internachi-certificate-2.jpg"],
  // developers
  ["2025/11/Atlantis-Photoroom.png", "/images/developers/atlantis-the-royal.png"],
  ["2025/11/Damac-Photoroom.png", "/images/developers/damac.png"],
  ["2025/11/Danube-Photoroom.png", "/images/developers/danube-properties.png"],
  ["2025/11/ellington-Photoroom.png", "/images/developers/ellington-properties.png"],
  ["2025/11/EMAAR-Photoroom.png", "/images/developers/emaar.png"],
  ["2025/11/Meraas-Photoroom.png", "/images/developers/meraas.png"],
  ["2025/11/Select-Group-Photoroom.png", "/images/developers/select-group.png"],
  ["2025/11/Sobha-Photoroom.png", "/images/developers/sobha-realty.png"],
  ["2025/11/da-Photoroom.png", "/images/developers/wasl.png"],
  // gallery
  ["2025/12/Elect_2-768x1024.jpg", "/images/gallery/electrical-inspection.jpg"],
  ["2025/12/Elect_2-scaled.jpg", "/images/gallery/electrical-inspection.jpg"],
  ["2025/12/Exterior_2-461x1024.jpg", "/images/gallery/exterior-inspection.jpg"],
  ["2025/12/Exterior_2-scaled.jpg", "/images/gallery/exterior-inspection.jpg"],
  ["2025/11/20251024_123029-rotated-e1762517560680-400x500.jpg", "/images/gallery/external-works-inspection.jpg"],
  ["2025/11/20251024_123029-rotated-e1762517560680.jpg", "/images/gallery/external-works-inspection.jpg"],
  ["2025/12/HVAC_2-768x1024.jpg", "/images/gallery/hvac-inspection.jpg"],
  ["2025/12/HVAC_2-scaled.jpg", "/images/gallery/hvac-inspection.jpg"],
  ["2025/11/20251024_103511-rotated-e1762517524996-400x500.jpg", "/images/gallery/mirror-fixture-check.jpg"],
  ["2025/11/20251024_103511-rotated-e1762517524996.jpg", "/images/gallery/mirror-fixture-check.jpg"],
  ["2025/12/Plumbing_2-768x1024.jpg", "/images/gallery/plumbing-inspection.jpg"],
  ["2025/12/Plumbing_2-scaled.jpg", "/images/gallery/plumbing-inspection.jpg"],
  ["2025/12/Roof_2.png", "/images/gallery/roof-inspection.png"],
  ["2025/11/20251024_103456-rotated-e1762517575117-400x500.jpg", "/images/gallery/shower-glass-inspection.jpg"],
  ["2025/11/20251024_103456-rotated-e1762517575117.jpg", "/images/gallery/shower-glass-inspection.jpg"],
  ["2025/12/Tiling_2.png", "/images/gallery/tiling-inspection.png"],
  ["2025/11/20251024_112841-400x500.jpg", "/images/gallery/wall-finish-defect.jpg"],
  ["2025/11/20251024_112841.jpg", "/images/gallery/wall-finish-defect.jpg"],
  ["2025/11/20251024_105721-400x500.jpg", "/images/gallery/wall-level-check.jpg"],
  ["2025/11/20251024_105721.jpg", "/images/gallery/wall-level-check.jpg"],
  ["2025/11/20251024_103650-400x500.jpg", "/images/gallery/wall-surface-check.jpg"],
  ["2025/11/20251024_103650.jpg", "/images/gallery/wall-surface-check.jpg"],
  // scope
  ["2025/12/Elect__1-768x1024.jpg", "/images/scope/electrical.jpg"],
  ["2025/12/Elect__1-scaled.jpg", "/images/scope/electrical.jpg"],
  ["2025/12/Exterior_1-461x1024.jpg", "/images/scope/exterior.jpg"],
  ["2025/12/Exterior_1-scaled.jpg", "/images/scope/exterior.jpg"],
  ["2025/12/HVAC__1-768x1024.jpg", "/images/scope/hvac.jpg"],
  ["2025/12/HVAC__1-scaled.jpg", "/images/scope/hvac.jpg"],
  ["2025/12/Paint___Wall_1-768x1024.jpg", "/images/scope/paint-and-walls.jpg"],
  ["2025/12/Paint___Wall_1-scaled.jpg", "/images/scope/paint-and-walls.jpg"],
  ["2025/12/Plumbing_1-768x1024.jpg", "/images/scope/plumbing.jpg"],
  ["2025/12/Plumbing_1-scaled.jpg", "/images/scope/plumbing.jpg"],
  ["2025/12/Roof_1.png", "/images/scope/roof.png"],
  ["2025/12/Tiling_1-1024x768.jpg", "/images/scope/tiling.jpg"],
  ["2025/12/Tiling_1-scaled.jpg", "/images/scope/tiling.jpg"],
  ["2025/12/Windows.png", "/images/scope/windows-and-doors.png"],
  // reports
  ["2025/11/report-1.jpg", "/images/reports/sample-report-page-1.jpg"],
  ["2025/11/report-2.jpg", "/images/reports/sample-report-page-2.jpg"],
  ["2025/11/report-3.jpg", "/images/reports/sample-report-page-3.jpg"],
  // about
  ["2025/11/premium_photo-1661604355750-2074610af15d-1024x683.jpg", "/images/about/property-handover.jpg"],
  ["2025/11/premium_photo-1661604355750-2074610af15d.jpg", "/images/about/property-handover.jpg"],
  // locations
  ["2025/11/20251122_151424-scaled.jpg", "/images/locations/abu-dhabi.jpg"],
  ["2025/11/20251122_165807-scaled.jpg", "/images/locations/ras-al-khaimah.jpg"],
  ["2025/11/20251122_141146-scaled.jpg", "/images/locations/sharjah.jpg"],
];

export const legacyAssetRedirects = moved.map(([from, to]) => ({ source: OLD + from, destination: to, statusCode: 301 as const }));
