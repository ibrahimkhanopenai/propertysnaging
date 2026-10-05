import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

/**
 * Trust band directly after the hero (client rule). Redesigned as a "credibility
 * moment": an asymmetric editorial header (statement + company intro) over an
 * OVERSIZED key-figures ledger — full-width rows, huge numerals, copper ordinals
 * and hairline rules — closed by a refined licensed-&-certified line.
 * Only genuine stats are flagged in site.stats; numbers are shown as authored.
 */
export function TrustSection({ dict }: { dict: Dictionary }) {
  const t = dict.home.trust;
  return (
    <section aria-labelledby="trust-title" className="border-b border-line bg-white py-16 md:py-24">
      <Container>
        {/* Centred masthead — title and paragraph stacked on the same axis */}
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <span aria-hidden="true" className="block h-0.5 w-12 bg-brand" />
          <h2
            id="trust-title"
            className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance text-ink"
          >
            {t.title}
          </h2>
          <p className="text-[15px] leading-relaxed text-muted sm:text-base">
            {dict.home.hero.about}
          </p>
        </Reveal>

        {/* Key-figures row — five compact tiles on one baseline, split by hairlines.
         * `gap-px` on a `bg-line` wrapper paints a single-pixel divider between
         * tiles whatever the column count wraps to. */}
        <Reveal
          stagger
          as="ul"
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 md:mt-16 lg:grid-cols-5"
        >
          {site.stats.map((s, i) => (
            <li
              key={s.key}
              style={{ ["--i" as string]: i } as React.CSSProperties}
              className="flex flex-col items-center gap-3 bg-white px-5 py-7 text-center last:col-span-2 sm:last:col-span-2 md:py-9 lg:last:col-span-1"
            >
              <span aria-hidden="true" className="font-display text-[11px] font-semibold tabular-nums tracking-[0.22em] text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                dir="ltr"
                className="font-display text-[clamp(2rem,3.4vw,2.8rem)] font-extrabold leading-[0.9] tracking-[-0.03em] text-ink"
              >
                {s.value}
              </span>
              <span className="text-[11px] font-semibold uppercase leading-snug tracking-[0.18em] text-muted sm:text-[12px]">
                {t.stats[s.key]}
              </span>
            </li>
          ))}
        </Reveal>

        {/* Licensed & certified — refined footer line */}
        <Reveal className="mt-10 flex flex-col gap-x-10 gap-y-6 border-t border-line pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <span aria-hidden="true" className="hidden h-6 w-0.5 shrink-0 bg-brand sm:block" />
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-5">
            {site.credentials.map((c) => {
              const label = t.credentials[c.key as keyof typeof t.credentials];
              return (
                <li key={c.key} className="flex items-center gap-3">
                  <span className="relative block h-11 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-white">
                    <Image src={c.image} alt={label} fill sizes="56px" className="object-contain p-1" />
                  </span>
                  <span className="max-w-[13rem] text-[12px] font-medium leading-snug text-muted">{label}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
