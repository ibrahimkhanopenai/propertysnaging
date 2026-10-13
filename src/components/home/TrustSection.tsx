import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/settings";

/**
 * Trust band directly after the hero (client rule). Redesigned as a "credibility
 * moment": an asymmetric editorial header (statement + company intro) over an
 * OVERSIZED key-figures ledger — full-width rows, huge numerals, copper ordinals
 * and hairline rules — closed by the licensed & certified seals as large plates.
 * Key figures come from Admin → Settings (defaults in site.stats); genuine numbers only (client rule).
 */
export async function TrustSection({ dict }: { dict: Dictionary }) {
  const cfg = await getSettings();
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
          {cfg.stats.map((s, i) => (
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
              <span className="text-[13px] font-semibold uppercase leading-snug tracking-[0.14em] text-muted">
                {t.stats[s.key]}
              </span>
            </li>
          ))}
        </Reveal>

        {/* Licensed & certified — the official seals as large plates (replaces the separate
         * "Certified by InterNACHI" section, removed on client request 2026-10-13). Same full
         * width and hairline-divided panel as the key-figures row above, on mist so the white
         * plates stand out. */}
        <Reveal
          stagger
          as="ul"
          className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
        >
          {site.credentials.map((c, i) => {
            const label = t.credentials[c.key as keyof typeof t.credentials];
            return (
              <li
                key={c.key}
                style={{ ["--i" as string]: i } as React.CSSProperties}
                className="flex flex-col items-center gap-5 bg-mist px-6 py-9 text-center md:py-11"
              >
                <span className="relative flex aspect-[4/3] w-full max-w-[15rem] items-center justify-center rounded-xl border border-line bg-white shadow-[0_8px_24px_rgba(10,10,10,0.06)]">
                  <Image src={c.image} alt={label} fill sizes="(max-width: 640px) 70vw, 240px" className="object-contain p-5" />
                </span>
                <span className="flex items-start gap-2">
                  <Icon name="check" size={15} className="mt-0.5 shrink-0 text-brand" />
                  <span className="max-w-[15rem] text-start text-sm font-medium leading-snug text-ink">{label}</span>
                </span>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
