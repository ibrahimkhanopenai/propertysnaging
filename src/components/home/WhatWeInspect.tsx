import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";

const icons: Record<string, IconName> = { structural: "wall", electrical: "bolt", plumbing: "drop", hvac: "snow", moisture: "thermo", kitchen: "kitchen", bathroom: "shower", external: "building" };

/**
 * Inspection scope as a technical schedule: a sticky "system index" legend on the
 * left (reticle + system count + a full-coverage meter) paired with a numbered
 * ledger of inspection systems on the right — each a ruled schedule line with a
 * ghost ordinal that charges copper on hover, an icon marker and its checkpoints.
 */
export function WhatWeInspect({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.inspect;
  const total = String(t.items.length).padStart(2, "0");

  return (
    <section className="border-y border-line bg-mist py-16 md:py-24">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left: sticky system index / legend */}
        <Reveal className="flex flex-col gap-7 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <h2 className="max-w-md font-display text-[clamp(2rem,4.3vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
            {t.title}
          </h2>

          <Link
            href={localePath(locale, "/scope-of-work/")}
            className="group inline-flex w-fit items-center gap-2 font-semibold underline-offset-4 outline-none hover:underline focus-visible:underline"
          >
            {t.link}
            <Icon name="arrow" size={18} className="text-brand transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>

          {/* Legend card: inspection reticle + system count + coverage meter */}
          <div className="relative mt-1 max-w-sm overflow-hidden rounded-2xl border border-line bg-white p-6">
            <span aria-hidden="true" className="absolute start-3 top-3 size-4 border-s-2 border-t-2 border-brand-line" />
            <span aria-hidden="true" className="absolute end-3 top-3 size-4 border-e-2 border-t-2 border-brand-line" />
            <span aria-hidden="true" className="absolute bottom-3 start-3 size-4 border-s-2 border-b-2 border-brand-line" />
            <span aria-hidden="true" className="absolute bottom-3 end-3 size-4 border-e-2 border-b-2 border-brand-line" />

            <div className="flex items-center gap-4">
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl border border-brand-line bg-brand-tint text-brand">
                <Icon name="search" size={26} />
              </span>
              <span className="font-display text-[clamp(2.6rem,7vw,3.6rem)] font-extrabold leading-none tabular-nums text-ink">
                {total}
              </span>
            </div>

            {/* full-coverage meter — one segment per system */}
            <div aria-hidden="true" className="mt-5 flex gap-1.5">
              {t.items.map((it) => (
                <span key={it.key} className="h-1 flex-1 rounded-full bg-brand-line" />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right: numbered inspection schedule */}
        <Reveal as="ol" stagger className="lg:col-span-7 lg:col-start-6">
          {t.items.map((it, i) => {
            const n = String(i + 1).padStart(2, "0");
            return (
              <li
                key={it.key}
                style={{ ["--i" as string]: i } as React.CSSProperties}
                className="group relative border-t border-line first:border-t-0"
              >
                {/* copper edge marker grows on hover/focus-within */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 start-0 w-0.5 origin-top scale-y-0 bg-brand transition-transform duration-300 group-hover:scale-y-100 group-focus-within:scale-y-100"
                />
                <div className="flex items-start gap-4 py-7 ps-5 sm:gap-6 sm:ps-7">
                  <span className="font-display text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold leading-none tabular-nums text-line transition-colors duration-300 group-hover:text-brand group-focus-within:text-brand">
                    {n}
                  </span>
                  <span className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-line text-ink transition-colors duration-300 group-hover:border-brand-line group-hover:bg-brand-tint group-hover:text-brand-dark">
                    <Icon name={icons[it.key] ?? "check"} size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-lg font-extrabold leading-tight sm:text-xl">{it.title}</h3>
                      <span
                        aria-hidden="true"
                        className="shrink-0 font-display text-xs font-bold tabular-nums tracking-[0.1em] text-subtle transition-colors duration-300 group-hover:text-brand"
                      >
                        {n} / {total}
                      </span>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {it.points.map((p) => (
                        <li key={p} className="inline-flex items-center gap-2 text-[13px] leading-snug text-muted sm:text-sm">
                          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand-line transition-colors duration-300 group-hover:bg-brand" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
