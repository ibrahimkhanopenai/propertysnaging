import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getPageContent } from "@/content/pages";
import type { PageKey } from "@/content/types";
import { routePath } from "@/lib/routes";

export type NavLink = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavLink[]; groups?: Array<{ title: string; items: NavLink[] }> };

const serviceGroups: Array<{ key: "snagging" | "warranty" | "buying" | "specialist"; items: PageKey[] }> = [
  { key: "snagging", items: ["apartmentSnagging", "villaSnagging", "townhouseSnagging", "propertyInspection"] },
  { key: "warranty", items: ["handoverInspection", "preHandover", "dlpInspection", "elevenMonth", "reInspection"] },
  { key: "buying", items: ["prePurchase", "secondaryInspection"] },
  { key: "specialist", items: ["thermalImaging", "moistureDetection", "hvacMep", "scopeOfWork"] },
];

export const locationOrder: PageKey[] = ["dubai", "abudhabi", "sharjah", "ajman", "rak", "fujairah", "uaq"];

const link = (key: PageKey, locale: Locale): NavLink => {
  const c = getPageContent(key, locale);
  return { label: c.navLabel || c.breadcrumb, href: routePath(key) };
};

/**
 * Client-required navigation: Home, Services, Locations, About, Sample Report, Reviews, FAQs, Contact.
 * Paths are locale-free; Header/MobileMenu wrap them with localePath().
 */
export function getNav(dict: Dictionary, locale: Locale): NavItem[] {
  return [
    { label: dict.nav.home, href: "/" },
    {
      label: dict.nav.services,
      href: "/snagging-services/",
      groups: serviceGroups.map((g) => ({ title: dict.nav.serviceGroups[g.key], items: g.items.map((k) => link(k, locale)) })),
    },
    { label: dict.nav.locations, href: "/snagging-services-in-dubai/", children: locationOrder.map((k) => link(k, locale)) },
    { label: dict.nav.about, href: "/about-us/" },
    { label: dict.nav.sampleReport, href: "/sample-report/" },
    { label: dict.nav.reviews, href: "/reviews/" },
    { label: dict.nav.faqs, href: "/faqs/" },
    { label: dict.nav.contact, href: "/contact-us/" },
  ];
}
