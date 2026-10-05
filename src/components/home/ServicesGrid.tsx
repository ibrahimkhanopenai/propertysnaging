import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getPageContent } from "@/content/pages";
import type { PageKey } from "@/content/types";
import { routePath } from "@/lib/routes";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Photo = keyof typeof site.images.scope;

/**
 * Featured services, each paired with a real inspection photo (site.images.scope)
 * and a small inspection marker icon (decorative accent only).
 */
const featured: Array<{ key: PageKey; photo: Photo; marker: IconName }> = [
  { key: "handoverInspection", photo: "paint", marker: "badge" },
  { key: "apartmentSnagging", photo: "tiling", marker: "building" },
  { key: "villaSnagging", photo: "exterior", marker: "home" },
  { key: "townhouseSnagging", photo: "windows", marker: "wall" },
  { key: "dlpInspection", photo: "plumbing", marker: "shield" },
  { key: "elevenMonth", photo: "electrical", marker: "clock" },
  { key: "prePurchase", photo: "roof", marker: "search" },
  { key: "thermalImaging", photo: "hvac", marker: "thermo" },
];

/** Editorial image crops — kept short and close to the content block's height
 * so no row leaves a tall whitespace band beside the copy. */
const crops = [
  "aspect-[16/9]",
  "aspect-[2/1]",
  "aspect-[16/9]",
  "aspect-[16/10]",
  "aspect-[2/1]",
  "aspect-[16/9]",
  "aspect-[16/10]",
  "aspect-[16/9]",
];

/**
 * Services as an editorial "index" ledger: each service is a wide hairline-ruled
 * row with a ghosted oversized ordinal that ignites copper on hover, an inspection
 * marker + index fraction, the title and summary, and a varied image crop whose
 * side alternates row to row. No uniform card grid.
 */
export function ServicesGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.services;
  const total = `0${featured.length}`;

  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        {/* Editorial masthead: wide heading on the left, standfirst + CTA packed on
         * the right so the row fills across the container (no middle whitespace). */}
        <Reveal className="grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <Kicker>{dict.nav.services}</Kicker>
            <h2 className="font-display text-[clamp(2.1rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
              {t.title}
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-5 lg:pb-1">
            <p className="text-lg leading-relaxed text-muted">{t.text}</p>
            <Link
              href={localePath(locale, "/snagging-services/")}
              className="group inline-flex items-center gap-2.5 self-start rounded-full border border-ink px-5 py-2.5 text-[15px] font-semibold transition-colors hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {t.all}
              <Icon name="arrow" size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <Reveal as="ul" stagger className="mt-10 md:mt-12">
          {featured.map(({ key, photo, marker }, i) => {
            const c = getPageContent(key, locale);
            const imageRight = i % 2 === 0;
            const last = i === featured.length - 1;
            return (
              <li key={key} style={{ ["--i" as string]: i } as React.CSSProperties}>
                <Link
                  href={localePath(locale, routePath(key))}
                  className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                >
                  <div className={cn("relative grid items-center gap-6 border-t border-line py-8 transition-colors duration-500 group-hover:border-brand-line md:grid-cols-2 md:gap-10 md:py-9 lg:gap-14", last && "border-b")}>
                    {/* content: ghost ordinal + text */}
                    <div className={cn("flex items-start gap-5 md:gap-8", imageRight ? "md:order-1" : "md:order-2")}>
                      <span className="font-display text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-[0.85] tabular-nums text-ink/10 transition-colors duration-500 group-hover:text-brand">
                        {`0${i + 1}`}
                      </span>
                      <div className="flex flex-col gap-3 pt-1">
                        <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-subtle">
                          <Icon name={marker} size={16} className="text-brand" />
                          <span className="tabular-nums">{`0${i + 1}`} / {total}</span>
                        </span>
                        <h3 className="font-display text-[clamp(1.4rem,2.4vw,2rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">
                          {c.navLabel}
                        </h3>
                        <p className="max-w-[42ch] leading-relaxed text-muted">{c.summary}</p>
                        <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors group-hover:text-brand">
                          {t.readMore}
                          <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                        </span>
                      </div>
                    </div>

                    {/* media: varied crop, alternating side — capped so the frame
                     * sits close to the copy's height instead of towering over it */}
                    <div className={cn("relative mx-auto w-full max-w-[380px] overflow-hidden rounded-[20px] bg-mist", crops[i], imageRight ? "md:order-2 md:ms-auto" : "md:order-1 md:me-auto")}>
                      <Image
                        src={site.images.scope[photo]}
                        alt={t.photoAlt[photo]}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                      />
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-transparent transition duration-500 group-hover:ring-brand/60" />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
