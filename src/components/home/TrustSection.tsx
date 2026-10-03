import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

/**
 * Trust band directly after the hero (client rule). Editorial stat row + a compact
 * "licensed & certified" strip, led by the company positioning paragraph.
 * Only genuine stats are flagged in site.stats — numbers are shown as authored.
 */
export function TrustSection({ dict }: { dict: Dictionary }) {
  const t = dict.home.trust;
  return (
    <section aria-labelledby="trust-title" className="border-b border-line bg-white py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <Reveal className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2 id="trust-title" className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">
              {t.title}
            </h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{dict.home.hero.about}</p>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:justify-end">
            {site.credentials.map((c) => (
              <li key={c.key} className="flex items-center gap-2.5">
                <span className="relative block h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                  <Image src={c.image} alt={t.credentials[c.key as keyof typeof t.credentials]} fill sizes="64px" className="object-contain p-1" />
                </span>
                <span className="max-w-32 text-[12px] font-semibold leading-snug text-muted">{t.credentials[c.key as keyof typeof t.credentials]}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal stagger className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 sm:grid-cols-3 lg:grid-cols-5">
          {site.stats.map((s, i) => (
            <div key={s.key} style={{ ["--i" as string]: i } as React.CSSProperties} className="flex flex-col gap-1.5">
              <span className="font-display text-[clamp(2rem,3.4vw,2.7rem)] font-extrabold leading-none tracking-[-0.02em]" dir="ltr">
                {s.value}
              </span>
              <span className="text-sm leading-snug text-muted">{t.stats[s.key]}</span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
