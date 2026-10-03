import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { locationOrder } from "@/components/layout/nav";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getPageContent } from "@/content/pages";
import { routePath } from "@/lib/routes";

/** Locations as an editorial directory list (large names + areas), not a card grid. */
export function Emirates({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <Kicker>{dict.nav.locations}</Kicker>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{dict.home.emirates.title}</h2>
          <p className="text-lg leading-relaxed text-muted">{dict.home.emirates.text}</p>
        </Reveal>

        <Reveal as="ul" stagger className="flex flex-col border-t border-line">
          {locationOrder.map((k, i) => {
            const c = getPageContent(k, locale);
            return (
              <li key={k} style={{ ["--i" as string]: i } as React.CSSProperties}>
                <Link href={localePath(locale, routePath(k))} className="group flex items-center justify-between gap-6 border-b border-line py-5">
                  <span className="flex items-baseline gap-4 transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5">
                    <span className="inline-flex items-center gap-2.5 font-display text-xl font-extrabold md:text-2xl">
                      <Icon name="pin" size={20} className="text-subtle" />
                      {c.navLabel}
                    </span>
                    <span className="hidden text-sm text-muted sm:block">{c.summary}</span>
                  </span>
                  <Icon name="arrow" className="shrink-0 text-subtle transition group-hover:translate-x-1 group-hover:text-ink rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
