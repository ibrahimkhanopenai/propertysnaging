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

/**
 * Coverage index — an art-directed emirate directory.
 * A sticky editorial intro column sits beside a numbered hairline directory:
 * oversized index ordinals, copper pin markers, big names that slide out with a
 * copper arrow on hover. Not a card grid, not a flat list.
 */
export function Emirates({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const total = String(locationOrder.length).padStart(2, "0");

  return (
    <section className="bg-white py-16 md:py-24">
      <Container className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        {/* Editorial intro — sticky on desktop */}
        <Reveal className="flex flex-col gap-5 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <Kicker>{dict.nav.locations}</Kicker>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
            {dict.home.emirates.title}
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-muted">{dict.home.emirates.text}</p>
          <div
            aria-hidden="true"
            className="mt-1 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-subtle"
          >
            <span className="h-px w-8 bg-brand-line" />
            <span className="tabular-nums">01 — {total}</span>
          </div>
        </Reveal>

        {/* Directory */}
        <Reveal as="ul" stagger className="border-t border-line lg:col-span-8 lg:col-start-5">
          {locationOrder.map((k, i) => {
            const c = getPageContent(k, locale);
            const index = String(i + 1).padStart(2, "0");
            return (
              <li
                key={k}
                style={{ ["--i" as string]: i } as React.CSSProperties}
                className="border-b border-line"
              >
                <Link
                  href={localePath(locale, routePath(k))}
                  className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-6 transition-colors duration-300 hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:gap-6 sm:py-7"
                >
                  {/* Index ordinal (huge) + running total (tiny) */}
                  <span className="flex shrink-0 flex-col items-start leading-none">
                    <span className="font-display text-[clamp(1.5rem,3.4vw,2.4rem)] font-extrabold tabular-nums text-subtle transition-colors duration-300 group-hover:text-brand">
                      {index}
                    </span>
                    <span className="mt-1.5 text-[11px] font-semibold tracking-[0.2em] text-subtle tabular-nums">
                      / {total}
                    </span>
                  </span>

                  {/* Emirate name + summary */}
                  <span className="min-w-0 flex-1">
                    <h3 className="inline-flex items-center gap-2.5 font-display text-[clamp(1.4rem,3.4vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em]">
                      <Icon name="pin" size={22} className="shrink-0 text-brand" />
                      <span className="transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5">
                        {c.navLabel}
                      </span>
                    </h3>
                    <span className="mt-1.5 block max-w-md ps-8 text-sm leading-relaxed text-muted">
                      {c.summary}
                    </span>
                  </span>

                  {/* Arrow chip */}
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-subtle transition duration-300 group-hover:border-brand group-hover:bg-white group-hover:text-brand">
                    <Icon
                      name="arrow"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    />
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
