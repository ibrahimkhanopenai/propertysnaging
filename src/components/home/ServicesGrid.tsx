import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getPageContent } from "@/content/pages";
import type { PageKey } from "@/content/types";
import { routePath } from "@/lib/routes";
import { site } from "@/lib/site";

type Photo = keyof typeof site.images.scope;

/** Featured services, each paired with a real inspection photo from site.images.scope */
const featured: Array<{ key: PageKey; photo: Photo }> = [
  { key: "handoverInspection", photo: "paint" },
  { key: "apartmentSnagging", photo: "tiling" },
  { key: "villaSnagging", photo: "exterior" },
  { key: "townhouseSnagging", photo: "windows" },
  { key: "dlpInspection", photo: "plumbing" },
  { key: "elevenMonth", photo: "electrical" },
  { key: "prePurchase", photo: "roof" },
  { key: "thermalImaging", photo: "hvac" },
];

/** Image-topped service cards. Purple ring on hover = client rule for pictures. */
export function ServicesGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.services;
  return (
    <section className="py-20 md:py-24">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title={t.title} text={t.text} />
          <Link href={localePath(locale, "/snagging-services/")} className="font-semibold underline-offset-4 hover:underline">{t.all}</Link>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ key, photo }) => {
            const c = getPageContent(key, locale);
            return (
              <li key={key}>
                <Link href={localePath(locale, routePath(key))} className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition hover:border-ink hover:shadow-[0_18px_40px_rgba(10,10,10,0.08)]">
                  <span className="relative block aspect-[4/3] overflow-hidden bg-brand-tint">
                    <Image src={site.images.scope[photo]} alt={t.photoAlt[photo]} fill sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    <span aria-hidden="true" className="absolute inset-0 ring-brand ring-inset transition group-hover:ring-4" />
                  </span>
                  <span className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="font-display text-lg font-extrabold">{c.navLabel}</h3>
                    <span className="text-[15px] leading-relaxed text-muted">{c.summary}</span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[15px] font-semibold">
                      {t.readMore}
                      <Icon name="arrow" size={18} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
