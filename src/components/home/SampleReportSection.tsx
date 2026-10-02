import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";

export function SampleReportSection({ locale, dict, headingLevel = "h2" }: { locale: Locale; dict: Dictionary; headingLevel?: "h2" | "h3" }) {
  const t = dict.home.report;
  const H = headingLevel;
  return (
    <section className="border-y border-line bg-mist py-20 md:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <H className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">{t.title}</H>
          <p className="text-lg leading-relaxed text-muted">{t.text}</p>
          <ol className="grid gap-3 sm:grid-cols-2">
            {t.fields.map((f, i) => (
              <li key={f.title} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white" aria-hidden="true">{i + 1}</span>
                <span>
                  <span className="block font-semibold">{f.title}</span>
                  <span className="text-sm text-muted">{f.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`${localePath(locale, "/")}#quote`} size="lg">{t.book}</ButtonLink>
            <ButtonLink href={localePath(locale, "/sample-report/")} variant="outline" size="lg">{t.view}</ButtonLink>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {site.images.report.map((src, i) => (
            <div key={src} className={`relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-brand bg-white ${i === 1 ? "translate-y-6" : ""}`}>
              <Image src={src} alt={`${t.imageAlt} ${i + 1}`} fill sizes="(min-width: 1024px) 190px, 33vw" className="object-cover object-top" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
