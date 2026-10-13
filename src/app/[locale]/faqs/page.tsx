import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/pages/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localePath } from "@/i18n/config";
import { getPageContent } from "@/content/pages";
import { serviceKeys } from "@/lib/routes";
import type { PageKey } from "@/content/types";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";
import { getFaqs } from "@/lib/faqs";

// FAQs come from Admin → FAQs (saves revalidate at once; this is a safety net)
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return buildMetadata({ locale, path: "/faqs/", title: d.faqPage.metaTitle, description: d.faqPage.metaDescription });
}

/** All FAQs: general (homepage set) + one section per service that has FAQs (Admin → FAQs, else content files). Single FAQPage schema. */
export default async function FaqsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const general = await getFaqs("home", locale);
  const serviceFaqs = (
    await Promise.all(serviceKeys.map(async (k) => ({ key: k, c: getPageContent(k as PageKey, locale), faqs: await getFaqs(k as PageKey, locale) })))
  ).filter((x) => x.faqs.length);
  const all = [...general, ...serviceFaqs.flatMap((x) => x.faqs)];
  return (
    <>
      <Container className="pt-10">
        <Breadcrumbs items={[{ name: d.common.home, url: localePath(locale, "/") }, { name: d.faqPage.title, url: localePath(locale, "/faqs/") }]} />
      </Container>
      {general.length ? (
        <Faq as="h1" title={d.faqPage.title} text={d.faqPage.intro} items={general} withSchema={false} />
      ) : (
        // Every general FAQ hidden in the admin: keep the page's one H1
        <Container className="flex flex-col gap-4 py-12">
          <h1 className="font-display text-[clamp(2.1rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-ink">{d.faqPage.title}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">{d.faqPage.intro}</p>
        </Container>
      )}
      {serviceFaqs.map(({ key, c, faqs }) => (
        <div key={key} className="border-t border-line">
          <Faq title={c.navLabel || c.breadcrumb} items={faqs} withSchema={false} />
        </div>
      ))}
      <CtaBand dict={d} quoteHref={`${localePath(locale, "/")}#quote`} />
      <JsonLd data={faqSchema(all)} />
    </>
  );
}
