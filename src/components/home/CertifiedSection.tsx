import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

/** "Certified by InterNACHI" trust band with the seals + Government of Dubai logo. */
export function CertifiedSection({ dict }: { dict: Dictionary }) {
  const t = dict.home.certified;
  // Same order as the current site: InterNACHI seal, CPI seal, Government of Dubai
  const badges = ["internachi1", "internachi2", "ded"] as const;
  return (
    <section className="border-y border-line bg-mist py-20 md:py-28">
      <Container className="flex flex-col items-center gap-12 text-center">
        <Reveal className="flex max-w-3xl flex-col items-center gap-4">
          <Kicker>{t.label}</Kicker>
          <h2 className="font-display text-[clamp(2rem,3.6vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">{t.title}</h2>
          <p className="text-lg leading-relaxed text-muted">{t.text}</p>
        </Reveal>
        <Reveal as="ul" stagger className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {badges.map((key, i) => {
            const c = site.credentials.find((x) => x.key === key);
            if (!c) return null;
            return (
              <li key={key} style={{ ["--i" as string]: i } as React.CSSProperties} className="flex items-center justify-center rounded-[22px] border border-line bg-white p-8 transition hover:border-ink hover:shadow-[0_18px_40px_rgba(10,10,10,0.08)]">
                <span className="relative block aspect-square w-full max-w-48">
                  <Image src={c.image} alt={t.badges[key]} fill sizes="200px" className="object-contain" />
                </span>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
