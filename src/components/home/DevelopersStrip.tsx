import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

/** Developer logos (white PNGs → dark band) shown as a slow, continuous logo marquee. */
export function DevelopersStrip({ dict }: { dict: Dictionary }) {
  const t = dict.home.developers;
  const loop = [...site.developers, ...site.developers];
  return (
    <section className="bg-ink py-16 text-white md:py-20">
      <Container>
        <Reveal className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-display text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
          <p className="leading-relaxed text-zinc-400">{t.text}</p>
        </Reveal>
      </Container>
      <div className="logo-marquee mt-10 overflow-hidden" aria-label={t.title}>
        <ul className="logo-track flex items-center gap-4 px-2">
          {loop.map((d, i) => (
            <li
              key={`${d.name}-${i}`}
              aria-hidden={i >= site.developers.length ? true : undefined}
              className="flex h-24 w-44 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/5 px-6 transition hover:border-white/40"
            >
              <Image src={d.logo} alt={`${d.name} ${t.logoAlt}`} width={d.width} height={d.height} sizes="176px" className="max-h-12 w-auto max-w-full object-contain" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
