import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/home/CtaBand";
import { locationOrder } from "@/components/layout/nav";
import { Faq } from "./Faq";
import { PageHero } from "./PageHero";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getPageContent, type PageKey } from "@/content/pages";
import { routePath, staticRoutes } from "@/lib/routes";
import { serviceSchema } from "@/lib/schema";
import { whatsappLink } from "@/lib/site";

/**
 * Generic renderer for every service, location and info page.
 * Copy lives in src/content/{services,locations,pages}.{en,ar}.ts
 */
export function ContentPage({ pageKey, locale, children }: { pageKey: PageKey; locale: Locale; children?: React.ReactNode }) {
  const dict = getDictionary(locale);
  const c = getPageContent(pageKey, locale);
  const path = localePath(locale, routePath(pageKey));
  const home = localePath(locale, "/");
  const isLocation = staticRoutes.find((r) => r.key === pageKey)?.group === "location";

  return (
    <>
      <PageHero
        h1={c.h1}
        intro={c.intro}
        image={c.image}
        breadcrumbs={[
          { name: dict.common.home, url: home },
          { name: c.breadcrumb, url: path },
        ]}
      >
        {c.download ? (
          <ButtonLink href={c.download.href} icon="download" size="lg" external>{dict.common.download}</ButtonLink>
        ) : (
          <ButtonLink href={`${home}#quote`} size="lg">{dict.nav.getQuote}</ButtonLink>
        )}
        <ButtonLink href={whatsappLink(dict.quote.waIntro)} variant="whatsapp" icon="whatsapp" size="lg" external>{dict.nav.whatsapp}</ButtonLink>
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
            {c.sections.map((s) => (
              <div key={s.title} id={s.id} className="flex scroll-mt-28 flex-col gap-4">
                <h2 className="font-display text-2xl font-extrabold leading-tight">{s.title}</h2>
                {s.paragraphs?.map((p) => (
                  <p key={p} className="leading-relaxed text-muted">{p}</p>
                ))}
                {s.bullets ? (
                  <ul className="flex flex-col gap-2.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3 leading-relaxed">
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


      {c.faqs?.length ? <Faq title={dict.common.faqTitle} items={c.faqs} /> : null}

      {c.related?.length || isLocation ? (
        <section className="border-t border-line py-16">
          <Container className="grid gap-10 md:grid-cols-2">
            {c.related?.length ? (
              <nav aria-labelledby="related-title">
                <h2 id="related-title" className="mb-4 font-display text-xl font-extrabold">{dict.pageUi.related}</h2>
                <ul className="flex flex-col divide-y divide-line border-y border-line">
                  {c.related.map((k) => {
                    const rc = getPageContent(k as PageKey, locale);
                    return (
                      <li key={k}>
                        <Link href={localePath(locale, routePath(k))} className="flex items-center justify-between gap-4 py-3.5 hover:underline">
                          {rc.navLabel || rc.breadcrumb}
                          <Icon name="arrow" size={18} className="shrink-0 rtl:rotate-180" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : null}
            {isLocation ? (
              <nav aria-labelledby="emirates-title">
                <h2 id="emirates-title" className="mb-4 font-display text-xl font-extrabold">{dict.pageUi.otherEmirates}</h2>
                <ul className="flex flex-wrap gap-2">
                  {locationOrder.filter((k) => k !== pageKey).map((k) => (
                    <li key={k}>
                      <Link href={localePath(locale, routePath(k))} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:border-ink">
                        {getPageContent(k, locale).navLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </Container>
        </section>
      ) : null}

      <CtaBand dict={dict} quoteHref={`${home}#quote`} />

      {c.schema === "service" ? <JsonLd data={serviceSchema({ name: c.h1, description: c.metaDescription, url: path, area: c.city })} /> : null}
    </>
  );
}
