import Image from "next/image";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/pages/ContentPage";
import { pageMetadata } from "@/components/pages/pageMetadata";
import { SampleReportSection } from "@/components/home/SampleReportSection";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localePath } from "@/i18n/config";
import { getSettings } from "@/lib/settings";
import { siteImage } from "@/lib/site-images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return pageMetadata("sampleReport", (await params).locale);
}

/** Client requirement §6: real report examples (personal data removed) + how defects are documented + "Book Your Inspection". */
export default async function SampleReportPage({ params }: Props) {
  const cfg = await getSettings();
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const pages = await Promise.all(([1, 2, 3] as const).map((n) => siteImage(`report.${n}`, locale))); // Admin → Images
  return (
    <ContentPage pageKey="sampleReport" locale={locale}>
      <SampleReportSection locale={locale} dict={dict} />
      <section className="py-16 md:py-20">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-extrabold">{dict.sampleReportPage.examplesTitle}</h2>
            <p className="text-sm text-muted">{dict.sampleReportPage.note}</p>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {pages.map((p) => (
              <li key={p.src} className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-brand bg-white">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 380px, 100vw" className="object-contain" />
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`${localePath(locale, "/")}#quote`} size="lg">{dict.home.report.book}</ButtonLink>
            <ButtonLink href={cfg.sampleReportUrl} variant="outline" icon="download" size="lg" external>{dict.home.report.download}</ButtonLink>
          </div>
        </Container>
      </section>
    </ContentPage>
  );
}
