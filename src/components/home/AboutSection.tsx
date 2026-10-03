import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";

/** "About us" block (copy + photo from the current site). Purple frame = client rule for pictures. */
export function AboutSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.about;
  return (
    <section className="border-y border-line bg-mist py-20 md:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="text-[15px] font-semibold text-muted">{t.label}</p>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">{t.title}</h2>
          <p className="text-lg leading-relaxed text-muted">{t.text}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink href="#quote" size="lg">{t.cta}</ButtonLink>
            <ButtonLink href={localePath(locale, "/about-us/")} variant="outline" size="lg">{t.more}</ButtonLink>
          </div>
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute -bottom-3 -end-3 h-full w-full rounded-[22px] bg-brand" />
          <div className="relative aspect-[3/2] overflow-hidden rounded-[22px] bg-white">
            <Image src={site.images.about} alt={t.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}
