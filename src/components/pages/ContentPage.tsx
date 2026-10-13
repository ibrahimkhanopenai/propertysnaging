import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/home/CtaBand";
import { Faq } from "./Faq";
import { PageHero } from "./PageHero";
import { RelatedLinks } from "./RelatedLinks";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import type { PageKey } from "@/content/pages";
import { routePath, staticRoutes } from "@/lib/routes";
import { serviceSchema } from "@/lib/schema";
import { getSettings, waLink } from "@/lib/settings";
import { site } from "@/lib/site";
import { pageImageSlot } from "@/lib/image-slots";
import { siteImage } from "@/lib/site-images";
import { getPageContentWithText } from "@/lib/page-text";
import { getFaqs, isFaqPage } from "@/lib/faqs";

/**
 * Generic renderer for every service, location and info page.
 * Copy lives in src/content/{services,locations,pages}.{en,ar}.ts; for service pages the intro, sections
 * (Admin → Page text) and FAQs (Admin → FAQs) can be overridden from the admin.
 */
export async function ContentPage({ pageKey, locale, children }: { pageKey: PageKey; locale: Locale; children?: React.ReactNode }) {
  const cfg = await getSettings();
  const dict = getDictionary(locale);
  const c = await getPageContentWithText(pageKey, locale);
  const faqs = isFaqPage(pageKey) ? await getFaqs(pageKey, locale) : (c.faqs ?? []);
  const path = localePath(locale, routePath(pageKey));
  const home = localePath(locale, "/");
  const isLocation = staticRoutes.find((r) => r.key === pageKey)?.group === "location";
  // The sample report link is set in Admin → Settings (e.g. a Google Drive view-only link)
  const downloadHref = c.download?.href === site.pdfs.sampleReport ? cfg.sampleReportUrl : c.download?.href;
  // About / Sample report hero photo: Admin → Images
  const slot = pageImageSlot(pageKey);
  const photo = slot ? await siteImage(slot, locale) : c.image ? { src: c.image, alt: c.imageAlt || c.h1 } : null;

  return (
    <>
      <PageHero
        h1={c.h1}
        intro={c.intro}
        image={photo?.src}
        imageAlt={photo?.alt}
        breadcrumbs={[
          { name: dict.common.home, url: home },
          { name: c.breadcrumb, url: path },
        ]}
      >
        {downloadHref ? (
          <ButtonLink href={downloadHref} icon="download" size="lg" external>{dict.common.download}</ButtonLink>
        ) : (
          <ButtonLink href={`${home}#quote`} size="lg">{dict.nav.getQuote}</ButtonLink>
        )}
        <ButtonLink href={waLink(cfg, dict.quote.waIntro)} variant="whatsapp" icon="whatsapp" size="lg" external>{dict.nav.whatsapp}</ButtonLink>
      </PageHero>

      {c.includes?.length || c.communities?.length ? (
        <section className="border-b border-line bg-mist py-14">
          <Container>
            <h2 className="mb-6 font-display text-2xl font-extrabold">{c.includes?.length ? dict.pageUi.includes : dict.pageUi.communities}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(c.includes?.length ? c.includes : c.communities!).map((x) => (
                <li key={x} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
                  <Icon name={c.includes?.length ? "check" : "pin"} size={20} className="mt-0.5 shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {c.sections.length > 0 ? (
        <section className="py-16 md:py-20">
          <Container className="grid gap-x-16 gap-y-12 md:grid-cols-2">
            {c.sections.map((s, i) => (
              <div key={i} id={s.id} className="flex scroll-mt-28 flex-col gap-4">
                <h2 className="font-display text-2xl font-extrabold leading-tight">{s.title}</h2>
                {s.paragraphs?.map((p, j) => (
                  <p key={j} className="leading-relaxed text-muted">{p}</p>
                ))}
                {s.bullets ? (
                  <ul className="flex flex-col gap-2.5">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3 leading-relaxed">
                        <Icon name="check" size={20} className="mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </Container>
        </section>
      ) : null}

      {children}


      {faqs.length ? <Faq title={dict.common.faqTitle} items={faqs} /> : null}

      <RelatedLinks pageKey={pageKey} locale={locale} related={c.related} showEmirates={isLocation} />

      <CtaBand dict={dict} quoteHref={`${home}#quote`} />

      {c.schema === "service" ? <JsonLd data={serviceSchema({ name: c.h1, description: c.metaDescription, url: path, area: c.city })} /> : null}
    </>
  );
}
