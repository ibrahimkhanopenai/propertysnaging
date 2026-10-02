import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getPageContent } from "@/content/pages";
import type { PageKey } from "@/content/types";
import { routePath } from "@/lib/routes";

const featured: PageKey[] = ["handoverInspection", "apartmentSnagging", "villaSnagging", "townhouseSnagging", "dlpInspection", "elevenMonth", "prePurchase", "thermalImaging"];

export function ServicesGrid({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="py-20 md:py-24">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title={dict.home.services.title} text={dict.home.services.text} />
          <Link href={localePath(locale, "/snagging-services/")} className="font-semibold underline-offset-4 hover:underline">{dict.home.services.all}</Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((k, i) => {
            const c = getPageContent(k, locale);
            const dark = i === 0;
            return (
              <li key={k}>
                <Link href={localePath(locale, routePath(k))} className={`group flex h-full flex-col gap-3 rounded-[18px] p-6 transition ${dark ? "bg-ink text-white" : "border border-line bg-white hover:border-ink"}`}>
                  <h3 className="font-display text-lg font-extrabold">{c.navLabel}</h3>
                  <p className={`text-[15px] leading-relaxed ${dark ? "text-zinc-300" : "text-muted"}`}>{c.summary}</p>
                  <Icon name="arrow" className="mt-auto transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
