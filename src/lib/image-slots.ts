import "server-only";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPageContent, type PageKey } from "@/content/pages";
import type { LocationKey } from "@/content/locations.en";
import { site } from "@/lib/site";

/**
 * Admin → Images: every site photo the client can replace, with its default file (site.ts) and
 * default ALT (dictionaries / content). Overrides are stored per key in the SiteImage table and
 * read through `siteImage()` (src/lib/site-images.ts). To add a slot: add it here, then read it
 * with `siteImage(key, locale)` where the image is rendered.
 */

type ScopeKey = keyof typeof site.images.scope;
export type ImageSlotKey =
  | "hero"
  | "about"
  | `location.${LocationKey}`
  | `scope.${ScopeKey}`
  | `report.${1 | 2 | 3}`
  | `finding.${1 | 2 | 3 | 4}`;

export type ImageGroup = "home" | "locations" | "scope" | "report" | "findings";

export type ImageSlot = {
  key: ImageSlotKey;
  group: ImageGroup;
  /** Admin label (English only) */
  label: string;
  /** Admin: where the photo appears */
  where: string;
  /** Default file in /public/images */
  src: string;
  /** Default ALT per language */
  alt: (locale: Locale) => string;
};

export const imageGroups: Array<{ key: ImageGroup; title: string; help: string }> = [
  { key: "home", title: "Homepage", help: "Hero photo (the first thing visitors see) and the About us photo." },
  { key: "locations", title: "Location page heroes", help: "The large photo at the top of each emirate page. Use a photo taken in that emirate where possible." },
  { key: "scope", title: "Defects we find", help: "Inspection photos on the homepage service list. \"Real findings\" uses them too until its items are loaded in Admin → Defects we find (then each finding has its own photo)." },
  { key: "report", title: "Sample report", help: "The 3-page report collage (homepage, location pages, /sample-report/). Remove all client personal data first." },
  { key: "findings", title: "Location pages: \"From our recent reports\"", help: "The 4 defect photos on every location page. Captions stay as they are; describe the new photo in the ALT text." },
];

const locationKeys = Object.keys(site.images.locations) as LocationKey[];
const scopeKeys = Object.keys(site.images.scope) as ScopeKey[];

const scopeLabels: Record<ScopeKey, string> = {
  hvac: "HVAC / AC",
  plumbing: "Plumbing",
  electrical: "Electrical",
  paint: "Paint & walls",
  windows: "Windows & doors",
  tiling: "Tiling",
  exterior: "Exterior",
  roof: "Roof",
};

const dict = getDictionary;

export const imageSlots: ImageSlot[] = [
  {
    key: "hero",
    group: "home",
    label: "Homepage hero",
    where: "Homepage, top of the page. Wide landscape photo, at least 1600px wide.",
    src: site.images.hero,
    alt: (l) => dict(l).home.hero.imageAlt,
  },
  {
    key: "about",
    group: "home",
    label: "About us photo",
    where: "Homepage → About us, and the /about-us/ page.",
    src: site.images.about,
    alt: (l) => dict(l).home.about.imageAlt,
  },
  ...locationKeys.map(
    (k): ImageSlot => ({
      key: `location.${k}`,
      group: "locations",
      label: getPageContent(k, "en").navLabel ?? k,
      where: `Top of the ${getPageContent(k, "en").navLabel ?? k} page (also its social share image).`,
      src: site.images.locations[k],
      alt: (l) => getPageContent(k, l).imageAlt || getPageContent(k, l).h1,
    }),
  ),
  ...scopeKeys.map(
    (k): ImageSlot => ({
      key: `scope.${k}`,
      group: "scope",
      label: scopeLabels[k],
      where: "Homepage → services list (and \"Real findings\" while Admin → Defects we find is empty).",
      src: site.images.scope[k],
      alt: (l) => dict(l).home.services.photoAlt[k],
    }),
  ),
  ...site.images.report.map(
    (src, i): ImageSlot => ({
      key: `report.${(i + 1) as 1 | 2 | 3}`,
      group: "report",
      label: `Report page ${i + 1}`,
      where: i === 0 ? "Sample report collage + /sample-report/ (also the top photo of that page)." : "Sample report collage + /sample-report/.",
      src,
      alt: (l) => `${dict(l).home.report.imageAlt} ${i + 1}`,
    }),
  ),
  ...site.images.findingPhotos.map(
    (src, i): ImageSlot => ({
      key: `finding.${(i + 1) as 1 | 2 | 3 | 4}`,
      group: "findings",
      label: `Photo ${i + 1}: ${dict("en").pageUi.findingPhotos[i].caption}`,
      where: "Every location page → \"From our recent reports\".",
      src,
      alt: (l) => dict(l).pageUi.findingPhotos[i].alt,
    }),
  ),
];

const byKey = new Map<string, ImageSlot>(imageSlots.map((s) => [s.key, s]));

export const getImageSlot = (key: string): ImageSlot | undefined => byKey.get(key);

/** Pages whose hero (and OG image) is an Admin → Images slot */
export function pageImageSlot(pageKey: PageKey): ImageSlotKey | null {
  if (pageKey === "about") return "about";
  if (pageKey === "sampleReport") return "report.1";
  if ((locationKeys as string[]).includes(pageKey)) return `location.${pageKey as LocationKey}`;
  return null;
}

/** Only our own files: admin uploads (/uploads/…) or bundled images (/images/…). */
export const isImagePath = (url: string) =>
  /^\/(uploads|images)\/[A-Za-z0-9/_.-]+\.(jpe?g|png|webp|avif|gif)$/i.test(url) && !url.includes("..");
