import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

const orgId = `${site.url}/#organization`;

/** Sitewide LocalBusiness (ProfessionalService) */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": orgId,
    name: site.name,
    url: `${site.url}/`,
    logo: absoluteUrl(site.images.logo),
    image: absoluteUrl(site.images.og),
    telephone: site.phone,
    email: site.email,
    priceRange: "AED",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: `${site.address.locality}, ${site.address.city}`,
      addressCountry: site.address.country,
    },
    openingHours: site.hours,
    areaServed: site.areaServed.map((name) => ({ "@type": "City", name })),
    ...(site.socialIsPlaceholder ? {} : { sameAs: Object.values(site.social) }),
    // No aggregateRating/Review markup: self-served reviews are not eligible and our rating is not yet verified
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    publisher: { "@id": orgId },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(o: { name: string; description: string; url: string; area?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Property snagging inspection",
    name: o.name,
    description: o.description,
    url: absoluteUrl(o.url),
    provider: { "@id": orgId },
    areaServed: o.area ? { "@type": "City", name: o.area } : site.areaServed.map((name) => ({ "@type": "City", name })),
  };
}

export function articleSchema(o: {
  type: string;
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished?: string;
  dateModified?: string;
  author?: string | null;
  inLanguage: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": o.type || "BlogPosting",
    headline: o.title,
    description: o.description,
    mainEntityOfPage: absoluteUrl(o.url),
    image: o.image ? [absoluteUrl(o.image)] : undefined,
    datePublished: o.datePublished,
    dateModified: o.dateModified,
    inLanguage: o.inLanguage,
    author: { "@type": "Organization", name: o.author || site.name },
    publisher: { "@id": orgId },
  };
}
