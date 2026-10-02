import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/dictionaries";
import { site, whatsappLink } from "@/lib/site";

/** Compact closing CTA used on inner pages (homepage uses FinalCta with the form). */
export function CtaBand({ dict, quoteHref }: { dict: Dictionary; quoteHref: string }) {
  return (
    <section className="pb-20 pt-4">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl bg-ink p-8 md:p-12">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="font-display text-[clamp(1.6rem,2.8vw,2.2rem)] font-extrabold leading-tight text-white text-balance">{dict.home.cta.title}</p>
            <p className="text-lg text-zinc-400">{dict.home.cta.text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={quoteHref} variant="light" size="lg">{dict.nav.getQuote}</ButtonLink>
            <ButtonLink href={whatsappLink(dict.quote.waIntro)} variant="whatsapp" size="lg" icon="whatsapp" external>{dict.home.hero.whatsapp}</ButtonLink>
            <ButtonLink href={`tel:${site.phone}`} variant="ghostLight" size="lg" icon="phone">{dict.nav.call}</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
