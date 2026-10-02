import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getPageContent } from "@/content/pages";
import type { PageKey } from "@/content/types";
import { routePath } from "@/lib/routes";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { locationOrder } from "./nav";

const footerServices: PageKey[] = ["handoverInspection", "apartmentSnagging", "villaSnagging", "dlpInspection", "elevenMonth", "prePurchase", "thermalImaging", "hvacMep"];

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const L = (p: string) => localePath(locale, p);
  const pageLink = (k: PageKey) => {
    const c = getPageContent(k, locale);
    return { label: c.navLabel || c.breadcrumb, href: L(routePath(k)) };
  };
  const cols = [
    { title: dict.footer.services, links: [...footerServices.map(pageLink), { label: dict.nav.allServices, href: L("/snagging-services/") }] },
    { title: dict.footer.locations, links: locationOrder.map(pageLink) },
    {
      title: dict.footer.company,
      links: [
        { label: dict.nav.about, href: L("/about-us/") },
        { label: dict.nav.reviews, href: L("/reviews/") },
        { label: dict.nav.gallery, href: L("/gallery/") },
        { label: dict.nav.faqs, href: L("/faqs/") },
        { label: dict.nav.contact, href: L("/contact-us/") },
        { label: dict.nav.agents, href: L("/real-estate-agents/") },
        { label: dict.nav.developers, href: L("/developers/") },
      ],
    },
    {
      title: dict.footer.resources,
      links: [
        { label: dict.nav.blog, href: L("/blog/") },
        { label: dict.nav.developerHub, href: L("/snagging-by-developer/") },
        { label: dict.nav.sampleReport, href: L("/sample-report/") },
        { label: dict.footer.checklist, href: L("/check-list/") },
        { label: dict.footer.companyProfile, href: L("/company-profile/") },
        { label: dict.footer.inspectionTools, href: L("/inspection-tools/") },
      ],
    },
  ];

  return (
    <footer className="bg-ink pb-24 text-zinc-400 md:pb-0">
      <Container className="flex flex-col gap-12 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="flex flex-col gap-4">
            <Logo href={L("/")} inverted />
            <p className="max-w-xs text-sm leading-relaxed">{dict.footer.tagline}</p>
            <address className="text-sm not-italic leading-relaxed">
              {site.address.street}, {site.address.locality}, {site.address.city}, UAE
            </address>
            <a href={`tel:${site.phone}`} data-track="footer" className="text-sm font-semibold text-white" dir="ltr">{site.phoneDisplay}</a>
            <a href={`mailto:${site.email}`} className="text-sm text-white">{site.email}</a>
          </div>
          {cols.map((col) => (
            <div key={col.title} className="flex flex-col gap-2.5 text-sm">
              <p className="mb-1 font-semibold text-white">{col.title}</p>
              {col.links.map((l) => (
                <Link key={l.href + l.label} href={l.href} className="hover:text-white">{l.label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-6 text-[13px]">
          <p>© {new Date().getFullYear()} {site.name}. {dict.common.allRights}</p>
          <div className="flex flex-wrap gap-5">
            <Link href={L("/privacy-policy/")} className="hover:text-white">{dict.common.privacy}</Link>
            <Link href={L("/terms-and-conditions/")} className="hover:text-white">{dict.common.terms}</Link>
            {!site.socialIsPlaceholder ? (
              <>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
                <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
              </>
            ) : null}
          </div>
        </div>
      </Container>
    </footer>
  );
}
