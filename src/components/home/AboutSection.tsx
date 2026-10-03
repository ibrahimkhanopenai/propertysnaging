import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";

/** "About us" editorial split with a floating credential chip (genuine hours stat). */
export function AboutSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.about;
  return (
    <section className="border-y border-line bg-mist py-20 md:py-28">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col gap-5">
          <Kicker>{t.label}</Kicker>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
          <p className="text-lg leading-relaxed text-muted">{t.text}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink href="#quote" size="lg" className="rounded-full">{t.cta}</ButtonLink>
            <ButtonLink href={localePath(locale, "/about-us/")} variant="outline" size="lg" className="rounded-full">{t.more}</ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] border border-line bg-white">
            <Image src={site.images.about} alt={t.imageAlt} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-6 start-6 hidden items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 shadow-[0_20px_50px_rgba(10,10,10,0.14)] sm:flex">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white">
              <Icon name="shield" size={20} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg font-extrabold" dir="ltr">10,000+</span>
              <span className="text-xs text-muted">{dict.home.trust.stats.hours}</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
