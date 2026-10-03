import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

/** Developer logos from the current site. Logos are white, so the band is black. */
export function DevelopersStrip({ dict }: { dict: Dictionary }) {
  const t = dict.home.developers;
  return (
    <section className="bg-ink py-20 text-white md:py-24">
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
          <p className="text-lg leading-relaxed text-zinc-400">{t.text}</p>
        </div>
        <ul className="flex flex-wrap justify-center gap-4">
          {site.developers.map((d) => (
            <li key={d.name} className="flex h-28 w-[calc(50%-0.5rem)] items-center sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(20%-0.8rem)] justify-center rounded-[18px] border border-white/10 bg-white/5 px-6 transition hover:border-white/40">
              <Image src={d.logo} alt={`${d.name} ${t.logoAlt}`} width={d.width} height={d.height} sizes="200px" className="max-h-14 w-auto max-w-full object-contain" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
