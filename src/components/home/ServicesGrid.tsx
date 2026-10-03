import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
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

/** Light, editorial image-led service cards with oversized index numbers. */
export function ServicesGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.services;
  return (
    <section className="bg-white py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-2xl flex-col gap-3">
            <Kicker>{dict.nav.services}</Kicker>
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
            <p className="text-lg leading-relaxed text-muted">{t.text}</p>
          </div>
          <Link href={localePath(locale, "/snagging-services/")} className="group inline-flex items-center gap-2 font-semibold underline-offset-4 hover:underline">
            {t.all}
            <Icon name="arrow" size={18} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </Reveal>

        <Reveal as="ul" stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ key, photo }, i) => {
            const c = getPageContent(key, locale);
            return (
              <li key={key} style={{ ["--i" as string]: i } as React.CSSProperties}>
                <Link
                  href={localePath(locale, routePath(key))}
                  className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[0_26px_60px_rgba(10,10,10,0.12)]"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-mist">
                    <Image
                      src={site.images.scope[photo]}
                      alt={t.photoAlt[photo]}
                      fill
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent" />
                    <span aria-hidden="true" className="absolute start-4 top-2.5 font-display text-3xl font-extrabold tabular-nums text-white">{`0${i + 1}`}</span>
                  </span>
                  <span className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="font-display text-lg font-extrabold leading-tight">{c.navLabel}</h3>
                    <span className="line-clamp-2 text-[14px] leading-relaxed text-muted">{c.summary}</span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-semibold">
                      {t.readMore}
                      <Icon name="arrow" size={16} className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
