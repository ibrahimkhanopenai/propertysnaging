import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localePath } from "@/i18n/config";
import { getPricing } from "@/lib/pricing";
import { buildMetadata } from "@/lib/seo";
import { site, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return buildMetadata({ locale, path: "/contact-us/", title: d.contactPage.metaTitle, description: d.contactPage.metaDescription });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const pricing = getPricing();
  const cards = [
    { icon: "phone" as const, title: d.contactPage.callTitle, value: site.phoneDisplay, href: `tel:${site.phone}`, ltr: true },
    { icon: "whatsapp" as const, title: d.contactPage.whatsappTitle, value: site.phoneDisplay, href: whatsappLink(d.quote.waIntro), ltr: true },
    { icon: "mail" as const, title: d.contactPage.emailTitle, value: site.email, href: `mailto:${site.email}`, ltr: true },
    { icon: "pin" as const, title: d.contactPage.officeTitle, value: `${site.address.street}, ${site.address.locality}, ${site.address.city}`, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name} ${site.address.locality} ${site.address.city}`)}`, ltr: false },
  ];
  return (
    <>
      <PageHero h1={d.contactPage.title} intro={d.contactPage.intro} breadcrumbs={[{ name: d.common.home, url: localePath(locale, "/") }, { name: d.nav.contact, url: localePath(locale, "/contact-us/") }]} />
      <section className="py-14 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <ul className="flex flex-col gap-4">
            {cards.map((c) => (
              <li key={c.title}>
                <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" data-track="contact_page" className="flex items-start gap-4 rounded-2xl border border-line p-5 hover:border-ink">
                  <Icon name={c.icon} size={24} className="mt-0.5 shrink-0" />
                  <span>
                    <span className="block font-semibold">{c.title}</span>
                    <span className="text-muted" dir={c.ltr ? "ltr" : undefined}>{c.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div id="quote" className="scroll-mt-24 rounded-[22px] border-t-4 border-brand bg-white p-6 shadow-[0_10px_40px_rgba(10,10,10,0.06)] md:p-9">
            <h2 className="mb-5 font-display text-2xl font-extrabold">{d.quote.title}</h2>
            <QuoteForm t={d.quote} locale={locale} perBedroom={pricing.perBedroom} currency={pricing.currency} whatsapp={site.whatsapp} source="contact_page" />
          </div>
        </Container>
      </section>
    </>
  );
}
