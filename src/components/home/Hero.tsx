import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { site, whatsappLink } from "@/lib/site";

/** Client rule: the visitor must understand the service without scrolling (H1 + statement + 3 CTAs + phone). */
export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.hero;
  return (
    <section className="bg-white">
      <Container className="grid items-center gap-10 pb-14 pt-10 md:pt-14 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:pb-20">
        <div className="flex flex-col gap-5">
          <p className="text-[15px] font-semibold text-muted">{t.label}</p>
          <h1 className="font-display text-[clamp(2.2rem,4.8vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">{t.title}</h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{t.intro}</p>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{t.about}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink href="#quote" size="lg">{t.getQuote}</ButtonLink>
            <ButtonLink href={localePath(locale, "/contact-us/")} variant="outline" size="lg">{t.book}</ButtonLink>
            <ButtonLink href={whatsappLink(dict.quote.waIntro)} variant="whatsapp" icon="whatsapp" size="lg" external>{t.whatsapp}</ButtonLink>
          </div>
          <a href={`tel:${site.phone}`} data-track="hero" className="inline-flex items-center gap-2 self-start text-lg font-semibold underline-offset-4 hover:underline">
            <Icon name="phone" size={20} />
            <span>{t.callUs}:</span>
            <span dir="ltr">{site.phoneDisplay}</span>
          </a>
        </div>
        {/* Cut-out image on white: no frame, kept compact so the hero stays short */}
        <div className="relative mx-auto aspect-[1200/919] w-full max-w-md lg:max-w-lg">
          <Image src={site.images.hero} alt={t.imageAlt} fill priority sizes="(min-width: 1024px) 512px, (min-width: 640px) 448px, 90vw" className="object-contain" />
        </div>
      </Container>
    </section>
  );
}
