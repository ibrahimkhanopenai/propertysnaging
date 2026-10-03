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
    <section aria-labelledby="trust-title" className="border-b border-line bg-white py-20 md:py-28">
      <Container>
        {/* Header — asymmetric: oversized statement beside the company intro */}
        <Reveal className="grid gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-16">
          <div className="lg:col-span-7">
            <span aria-hidden="true" className="mb-6 block h-0.5 w-12 bg-brand" />
            <h2
              id="trust-title"
              className="max-w-[18ch] font-display text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance text-ink"
            >
              {t.title}
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-muted lg:col-span-5 lg:border-s lg:border-brand-line lg:ps-10">
            {dict.home.hero.about}
          </p>
        </Reveal>

        {/* Key-figures ledger — numbers dominate; divided by hairlines, first rule copper */}
        <Reveal stagger as="ul" className="mt-16 md:mt-24">
          {site.stats.map((s, i) => (
            <li
              key={s.key}
              style={{ ["--i" as string]: i } as React.CSSProperties}
              className="grid grid-cols-1 gap-x-10 gap-y-3 border-t border-line py-7 first:border-t-2 first:border-brand md:grid-cols-[auto_1fr] md:items-baseline md:py-9"
            >
              <div className="flex items-baseline gap-4 md:gap-7">
                <span aria-hidden="true" className="w-7 shrink-0 font-display text-[13px] font-semibold tabular-nums tracking-[0.2em] text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  dir="ltr"
                  className="font-display text-[clamp(2.8rem,7vw,5rem)] font-extrabold leading-[0.85] tracking-[-0.03em] text-ink"
                >
                  {s.value}
                </span>
              </div>
              <span className="ps-11 text-[13px] font-semibold uppercase leading-snug tracking-[0.18em] text-muted md:ps-0 md:self-center md:text-end">
                {t.stats[s.key]}
              </span>
            </li>
          ))}
        </Reveal>

        {/* Licensed & certified — refined footer line */}
        <Reveal className="mt-14 flex flex-col gap-x-10 gap-y-6 border-t border-line pt-10 sm:flex-row sm:flex-wrap sm:items-center">
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
