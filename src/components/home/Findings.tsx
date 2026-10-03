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
 * "Real findings" — report-excerpt cards pairing a real inspection photo with the
 * documented defect and its recommendation (copy cleaned from genuine findings).
 * Defect label uses the `snag` red (client rule: red = defects only).
 */
export function Findings({ dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.findings;
  return (
    <section className="border-y border-line bg-mist py-20 md:py-28">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <Kicker>{t.kicker}</Kicker>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
          <p className="text-lg leading-relaxed text-muted">{t.text}</p>
        </Reveal>

        <Reveal as="ul" stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((it, i) => {
            const photo = it.photo as ScopeKey;
            return (
              <li
                key={it.defect}
                style={{ ["--i" as string]: i } as React.CSSProperties}
                className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(10,10,10,0.1)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                  <Image
                    src={site.images.scope[photo]}
                    alt={dict.home.services.photoAlt[photo]}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute start-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold shadow-sm backdrop-blur">{it.category}</span>
                </div>
                <div className="flex flex-1 flex-col gap-3.5 p-5">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-snag">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-snag" />
                      {t.defectLabel}
                    </span>
                    <p className="font-semibold leading-snug">{it.defect}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 border-t border-line pt-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                      <Icon name="check" size={14} />
                      {t.fixLabel}
                    </span>
                    <p className="text-[15px] leading-relaxed text-muted">{it.fix}</p>
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
