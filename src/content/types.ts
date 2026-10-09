import type { RouteKey } from "@/lib/routes";

export type PageSection = { id?: string; title: string; paragraphs?: string[]; bullets?: string[] };

export type PageContent = {
  metaTitle: string;
  /** true = metaTitle is the full <title> (no "| Property Inspectors UAE" suffix) — used for the old site's ranking titles */
  metaTitleAbsolute?: boolean;
  metaDescription: string;
  breadcrumb: string;
  /** Short name used in menus, cards and related links */
  navLabel?: string;
  /** One-line summary for service/location cards */
  summary?: string;
  h1: string;
  intro: string;
  image?: string;
  /** Adds Service JSON-LD */
  schema?: "service";
  /** For location pages: City in Service JSON-LD */
  city?: string;
  /** Location pages: communities / areas list (location-specific info) */
  communities?: string[];
  /** "What's included" checklist block */
  includes?: string[];
  /** For download pages */
  download?: { href: string };
  sections: PageSection[];
  faqs?: Array<{ q: string; a: string }>;
  /** Internal links shown as "Related services" */
  related?: RouteKey[];
};

/** Every route except home/blog and the custom-built pages has copy in content/ */
export type PageKey = Exclude<RouteKey, "home" | "blog" | "reviews" | "faqs" | "contact" | "gallery" | "developerHub">;
