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

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return buildMetadata({ locale, path: "/faqs/", title: d.faqPage.metaTitle, description: d.faqPage.metaDescription });
}

/** All FAQs: general (homepage set) + one section per service that has FAQs. Single FAQPage schema. */
export default async function FaqsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const serviceFaqs = serviceKeys
    .map((k) => ({ key: k, c: getPageContent(k as PageKey, locale) }))
    .filter((x) => x.c.faqs?.length);
  const all = [...d.home.faq.items, ...serviceFaqs.flatMap((x) => x.c.faqs!)];
  return (
    <>
      <Container className="pt-10">
        <Breadcrumbs items={[{ name: d.common.home, url: localePath(locale, "/") }, { name: d.faqPage.title, url: localePath(locale, "/faqs/") }]} />
      </Container>
      <Faq as="h1" title={d.faqPage.title} text={d.faqPage.intro} items={d.home.faq.items} withSchema={false} />
      {serviceFaqs.map(({ key, c }) => (
        <div key={key} className="border-t border-line">
          <Faq title={c.navLabel || c.breadcrumb} items={c.faqs!} withSchema={false} />
        </div>
      ))}
      <CtaBand dict={d} quoteHref={`${localePath(locale, "/")}#quote`} />
      <JsonLd data={faqSchema(all)} />
    </>
  );
}
