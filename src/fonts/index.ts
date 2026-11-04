import localFont from "next/font/local";

/**
 * Self-hosted fonts (woff2 in this folder), replacing `next/font/google`.
 * next/font/google fetches the font CSS from Google at BUILD time, which fails
 * intermittently in CI (vercel/next.js#99114: the loader crashes on an extensionless
 * Google Fonts URL / empty response). Shipping the woff2 files removes that network
 * step, so the build is deterministic on CI and on the self-hosted server.
 *
 * Variable names + weights match the previous Google setup exactly, so globals.css
 * (`--font-dmsans`, `--font-manrope`, `--font-plex-ar`) needs no changes.
 * To change weights/subsets, re-run scripts/download-fonts.mjs.
 */

// Body font (LTR) — latin subset, weights 400/500/600/700
export const dmSans = localFont({
  src: [
    { path: "./dm-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./dm-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./dm-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./dm-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-dmsans",
  display: "swap",
});

// Display / heading font (LTR) — latin subset, weights 600/700/800
export const manrope = localFont({
  src: [
    { path: "./manrope-600.woff2", weight: "600", style: "normal" },
    { path: "./manrope-700.woff2", weight: "700", style: "normal" },
    { path: "./manrope-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
});

// Arabic body + headings (RTL) — arabic subset, weights 400/500/600/700
export const plexArabic = localFont({
  src: [
    { path: "./ibm-plex-arabic-400.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-arabic-500.woff2", weight: "500", style: "normal" },
    { path: "./ibm-plex-arabic-600.woff2", weight: "600", style: "normal" },
    { path: "./ibm-plex-arabic-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-plex-ar",
  display: "swap",
});
