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
      <Container className="grid items-center gap-10 pb-14 pt-10 md:pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-20">
        <div className="flex flex-col gap-5">
          <p className="text-[15px] font-semibold text-muted">{t.label}</p>
          <h1 className="font-display text-[clamp(2.2rem,4.8vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">{t.title}</h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{t.intro}</p>
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
        <div className="relative">
          {/* Purple frame = client rule for pictures */}
          <div aria-hidden="true" className="absolute -bottom-3 -end-3 h-full w-full rounded-[22px] bg-brand" />
          <div className="relative aspect-[5/4] overflow-hidden rounded-[22px] bg-mist lg:aspect-[4/5]">
            <Image src={site.images.hero} alt={t.imageAlt} fill priority sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}
