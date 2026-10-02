import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { locationOrder } from "@/components/layout/nav";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getPageContent } from "@/content/pages";
import { routePath } from "@/lib/routes";

export function Emirates({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="py-20 md:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading title={dict.home.emirates.title} text={dict.home.emirates.text} />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {locationOrder.map((k) => {
            const c = getPageContent(k, locale);
            return (
              <li key={k}>
                <Link href={localePath(locale, routePath(k))} className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-line p-5 hover:border-ink">
                  <span>
                    <span className="flex items-center gap-2 font-display text-lg font-extrabold"><Icon name="pin" size={18} />{c.navLabel}</span>
                    <span className="mt-1 block text-sm text-muted">{c.summary}</span>
                  </span>
                  <Icon name="arrow" className="mt-1 shrink-0 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
