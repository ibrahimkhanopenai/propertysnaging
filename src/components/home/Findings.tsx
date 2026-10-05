import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";
import { site } from "@/lib/site";

type ScopeKey = keyof typeof site.images.scope;

/**
 * "Real findings" — an annotated inspection-report moment, not a card grid.
 * One dominant featured finding (photo with a copper annotation marker + an
 * overlapping report-card caption) sits beside an asymmetric "defect log" of
 * the supporting findings. Severity uses `snag` red (client rule: red = defects
 * only); copper `brand` tokens carry the inspection markers and ordinals.
 */
export function Findings({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.findings;
  const [featured, ...rest] = t.items;
  const featPhoto = featured.photo as ScopeKey;

  return (
    <section className="border-y border-line bg-white py-16 md:py-24">
      <Container>
        {/* Header — editorial split: statement on the left, intro on the right */}
        <Reveal className="mb-10 grid gap-5 md:mb-12 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <Kicker>{t.kicker}</Kicker>
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">
              {t.title}
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted lg:col-span-5 lg:pb-1">{t.text}</p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* FEATURED finding — annotated photo with an overlapping report card */}
          <Reveal className="lg:col-span-7">
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ink sm:aspect-[16/11]">
                <Image
                  src={site.images.scope[featPhoto]}
                  alt={dict.home.services.photoAlt[featPhoto]}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
                {/* legibility wash for the top overlays */}
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/55 to-transparent" />

                {/* severity tag (real defect semantics → snag red) */}
                <span className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-snag shadow-sm backdrop-blur">
                  <span aria-hidden="true" className="size-2 rounded-full bg-snag" />
                  {t.defectLabel}
                </span>

                {/* finding ordinal */}
                <span aria-hidden="true" className="absolute end-4 top-3 font-display text-[clamp(2.4rem,5vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em] text-brand-light/90">
                  01
                </span>

                {/* copper annotation marker + leader line + category callout (md+) */}
                <div aria-hidden="true" className="absolute start-[24%] top-[42%] hidden items-center md:flex">
                  <span className="relative flex size-7 items-center justify-center rounded-full border-2 border-brand bg-brand/15 backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-brand" />
                  </span>
                  <span className="h-px w-10 bg-brand/80" />
                  <span className="whitespace-nowrap rounded-full border border-brand-line bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-dark shadow-sm">
                    {featured.category}
                  </span>
                </div>

                {/* viewfinder corner ticks */}
                <span aria-hidden="true" className="absolute bottom-4 start-4 hidden size-5 border-b-2 border-s-2 border-white/70 md:block" />
                <span aria-hidden="true" className="absolute top-4 end-4 hidden size-5 border-t-2 border-e-2 border-white/40 md:block" />
              </div>

              {/* overlapping report card */}
              <figcaption className="relative z-10 -mt-12 me-4 ms-4 rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_rgba(10,10,10,0.12)] sm:-mt-16 sm:me-8 sm:ms-8 sm:p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-brand-tint px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-dark">
                  <Icon name="search" size={13} />
                  {featured.category}
                </span>
                <h3 className="mt-3 font-display text-xl font-extrabold leading-snug tracking-[-0.02em] text-ink text-balance sm:text-2xl">
                  {featured.defect}
                </h3>
                <div className="mt-4 flex gap-3 border-t border-line pt-4">
                  <span aria-hidden="true" className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                    <Icon name="check" size={15} />
                  </span>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{t.fixLabel}</span>
                    <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{featured.fix}</p>
                  </div>
                </div>
              </figcaption>
            </figure>
          </Reveal>

          {/* SUPPORTING findings — a scannable defect log */}
          <Reveal
            as="ul"
            stagger
            className="divide-y divide-line overflow-hidden rounded-[22px] border border-line bg-white lg:col-span-5"
          >
            {rest.map((it, i) => {
              const photo = it.photo as ScopeKey;
              const n = String(i + 2).padStart(2, "0");
              return (
                <li
                  key={it.defect}
                  style={{ ["--i" as string]: i } as React.CSSProperties}
                  className="group flex items-start gap-4 p-4 transition-colors hover:bg-mist/60 sm:gap-5 sm:px-5"
                >
                  <span
                    aria-hidden="true"
                    className="w-6 shrink-0 pt-1 font-display text-sm font-extrabold tabular-nums text-brand transition-colors group-hover:text-brand-dark"
                  >
                    {n}
                  </span>

                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-mist sm:size-[72px]">
                    <Image
                      src={site.images.scope[photo]}
                      alt={dict.home.services.photoAlt[photo]}
                      fill
                      sizes="72px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* severity marker (red = defects only) */}
                    <span aria-hidden="true" className="absolute end-1 top-1 size-2 rounded-full bg-snag ring-2 ring-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">{it.category}</span>
                    <h3 className="mt-1 text-[15px] font-semibold leading-snug text-ink">{it.defect}</h3>
                    <p className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-relaxed text-muted">
                      <Icon name="check" size={14} className="mt-0.5 shrink-0 text-brand" />
                      <span className="min-w-0">{it.fix}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
