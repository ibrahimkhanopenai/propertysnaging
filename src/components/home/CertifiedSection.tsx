import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

/** "Certified by InterNACHI" with the seals + Government of Dubai logo (copy + images from the current site). */
export function CertifiedSection({ dict }: { dict: Dictionary }) {
  const t = dict.home.certified;
  // Same order as the current site: InterNACHI seal, CPI seal, Government of Dubai
  const badges = ["internachi1", "internachi2", "ded"] as const;
  return (
    <section className="py-20 md:py-24">
      <Container className="flex flex-col items-center gap-12 text-center">
        <div className="flex max-w-3xl flex-col items-center gap-4">
          <h2 className="font-display font-extrabold leading-[1.1] tracking-[-0.02em]">
            <span className="block text-base font-semibold tracking-normal text-muted">{t.label}</span>
            <span className="mt-2 block text-[clamp(2.2rem,4vw,3rem)]">{t.title}</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted">{t.text}</p>
        </div>
        <ul className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {badges.map((key) => {
            const c = site.credentials.find((x) => x.key === key);
            if (!c) return null;
            return (
              <li key={key} className="flex items-center justify-center rounded-[22px] border border-line bg-white p-8 transition hover:border-ink">
                <span className="relative block aspect-square w-full max-w-56">
                  <Image src={c.image} alt={t.badges[key]} fill sizes="224px" className="object-contain" />
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
