import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WhyChoose } from "@/components/home/WhyChoose";
import { Process } from "@/components/home/Process";
import { SampleReportSection } from "@/components/home/SampleReportSection";
import { FinalCta } from "@/components/home/FinalCta";
import { Faq } from "./Faq";
import { RelatedLinks } from "./RelatedLinks";
import { getDictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getPageContent, type PageKey } from "@/content/pages";
import { getLocationItems } from "@/lib/content-db";
import { routePath } from "@/lib/routes";
import { serviceSchema } from "@/lib/schema";
import { getSettings, waLink } from "@/lib/settings";
import { pageImageSlot } from "@/lib/image-slots";
import { siteImage } from "@/lib/site-images";

/**
 * Location page (Dubai, Abu Dhabi … UAQ) built as an organic-search landing page (CRO audit 2026-10):
 * hero with hook, proofs, one copper CTA + WhatsApp and a real photo → key figures →
 * why snagging matters here + defects we find (with report photos) → local tips → communities + areas (Admin → Locations) →
 * why choose us → process → sample report → city FAQ → related links → quote form (#quote).
 * URLs, <title> and meta description are unchanged (legacy SEO). Copy: content/locations.{en,ar}.ts.
 */
export async function LocationPage({ pageKey, locale }: { pageKey: PageKey; locale: Locale }) {
  const cfg = await getSettings();
  const dict = getDictionary(locale);
  const ui = dict.pageUi;
  const c = getPageContent(pageKey, locale);
  const { areas, communities } = await getLocationItems(pageKey, locale, c.communities ?? []);
  // Photos: Admin → Images (hero = "Location page heroes", defect photos = "From our recent reports")
  const slot = pageImageSlot(pageKey);
  const hero = slot ? await siteImage(slot, locale) : c.image ? { src: c.image, alt: c.imageAlt || c.h1 } : null;
  const findingPhotos = await Promise.all(([1, 2, 3, 4] as const).map((n) => siteImage(`finding.${n}`, locale)));
  const path = localePath(locale, routePath(pageKey));
  const city = c.navLabel ?? c.city ?? "";

  return (
    <>
      {/* HERO */}
      <section className="border-b border-line bg-white">
        <Container className="grid items-center gap-10 py-10 md:py-14 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <Breadcrumbs items={[{ name: dict.common.home, url: localePath(locale, "/") }, { name: c.breadcrumb, url: path }]} />
            <h1 className="font-display text-[clamp(2rem,4.2vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-balance">{c.h1}</h1>
            {c.hook ? <p className="font-display text-xl font-bold leading-snug tracking-[-0.01em] text-ink text-balance md:text-2xl">{c.hook}</p> : null}
            <p className="max-w-2xl text-lg leading-relaxed text-muted">{c.intro}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
              {dict.home.hero.highlights.map((h) => (
                <li key={h} className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink">
                  <span aria-hidden="true" className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-dark">
                    <Icon name="check" size={14} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <ButtonLink href="#quote" variant="cta" size="lg" icon="arrow" className="rounded-full [&_svg]:order-last rtl:[&_svg]:rotate-180">
                {dict.home.hero.getQuote}
              </ButtonLink>
              <ButtonLink href={waLink(cfg, ui.waMessage.replace("{city}", city))} variant="whatsapp" icon="whatsapp" size="lg" external className="rounded-full">
                {dict.home.hero.whatsapp}
              </ButtonLink>
            </div>
            <a href={`tel:${cfg.phone}`} data-track="location_hero" className="inline-flex w-fit items-center gap-2 text-[15px] text-muted hover:text-ink">
              <Icon name="phone" size={16} />
              <span>{dict.home.hero.callUs}</span>
              <span dir="ltr" className="font-semibold text-ink underline-offset-4 hover:underline">{cfg.phoneDisplay}</span>
            </a>
          </div>

          {hero ? (
            <div className="relative lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-mist sm:aspect-[16/11] lg:aspect-[4/5]">
                <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      {/* KEY FIGURES (Admin → Settings — same numbers as the homepage) */}
      <section aria-label={dict.home.trust.title} className="border-b border-line bg-mist">
        <Container>
          <ul className="grid grid-cols-2 gap-px py-2 sm:grid-cols-3 lg:grid-cols-5">
            {cfg.stats.map((s) => (
              <li key={s.key} className="flex flex-col items-center gap-1.5 px-3 py-5 text-center max-sm:last:col-span-2">
                <span dir="ltr" className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-extrabold leading-none tracking-[-0.02em] text-ink">{s.value}</span>
                <span className="text-[13px] font-semibold uppercase leading-snug tracking-[0.1em] text-muted">{dict.home.trust.stats[s.key]}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* WHY IT MATTERS HERE + DEFECTS WE FIND */}
      {c.why || c.defects ? (
        <section className="bg-white py-16 md:py-24">
          <Container className="flex flex-col gap-14">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              {c.why ? (
                <Reveal className="flex flex-col gap-5 lg:col-span-5">
                  <h2 className="font-display text-[clamp(1.8rem,3.2vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-balance">{c.why.title}</h2>
                  {c.why.paragraphs?.map((p) => (
                    <p key={p} className="text-[17px] leading-relaxed text-muted">{p}</p>
                  ))}
                </Reveal>
              ) : null}
              {c.defects ? (
                <Reveal className="flex flex-col gap-6 lg:col-span-7">
                  <h2 className="font-display text-2xl font-extrabold leading-tight tracking-[-0.01em]">{c.defects.title}</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {c.defects.groups.map((g) => (
                      <div key={g.title} className="rounded-2xl border border-line bg-white p-5">
                        <h3 className="font-display text-lg font-extrabold">{g.title}</h3>
                        <ul className="mt-3 flex flex-col gap-2">
                          {g.items.map((it) => (
                            <li key={it} className="flex gap-2.5 text-[15px] leading-snug text-muted">
                              {/* red = defects only (design system) */}
                              <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-snag" />
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Reveal>
              ) : null}
            </div>

            <Reveal className="flex flex-col gap-5">
              <Kicker>{ui.findingPhotosTitle}</Kicker>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {findingPhotos.map((photo, i) => {
                  const p = ui.findingPhotos[i];
                  return (
                    <li key={i}>
                      <figure className="flex flex-col gap-2.5">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-mist">
                          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 22vw, 45vw" className="object-cover" />
                        </div>
                        <figcaption className="text-[14px] leading-snug text-muted">{p.caption}</figcaption>
                      </figure>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* LOCAL TIPS, then COMMUNITIES (left) + AREAS (right) — both lists from Admin → Locations
          (areas fall back to content/locations.*.ts; communities are hidden until added) */}
      <section className="border-y border-line bg-mist py-16 md:py-20">
        <Container className="flex flex-col gap-12 md:gap-14">
          {c.sections.length ? (
            <div className="grid gap-10 md:grid-cols-2 md:gap-12">
              {c.sections.map((s) => (
                <Reveal key={s.title} className="flex flex-col gap-3">
                  <h2 className="font-display text-2xl font-extrabold leading-tight">{s.title}</h2>
                  {s.paragraphs?.map((p) => (
                    <p key={p} className="leading-relaxed text-muted">{p}</p>
                  ))}
                  {s.bullets ? (
                    <ul className="flex flex-col gap-2.5">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-3 leading-relaxed">
                          <Icon name="check" size={20} className="mt-0.5 shrink-0 text-brand-dark" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Reveal>
              ))}
            </div>
          ) : null}

          {communities.length || areas.length ? (
            <div className={communities.length && areas.length ? "grid gap-6 lg:grid-cols-2" : "grid gap-6"}>
              {communities.length ? (
                <Reveal className="flex flex-col gap-5 rounded-[22px] border border-line bg-white p-6 md:p-8">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-display text-2xl font-extrabold leading-tight">{ui.communitiesIn.replace("{city}", city)}</h2>
                    <p className="text-[15px] leading-relaxed text-muted">{ui.communitiesNote}</p>
                  </div>
                  <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    {communities.map((x) => (
                      <li key={x.name} className="flex items-start gap-3">
                        <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-brand-line bg-brand-tint text-brand-dark">
                          <Icon name="building" size={17} />
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="font-semibold leading-snug text-ink">{x.name}</span>
                          {x.developer ? <span className="text-[13px] text-subtle">{x.developer}</span> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
              {areas.length ? (
                <Reveal className="flex flex-col gap-5 rounded-[22px] border border-line bg-white p-6 md:p-8">
                  <h2 className="font-display text-2xl font-extrabold leading-tight">{ui.areasIn.replace("{city}", city)}</h2>
                  <ul className="flex flex-wrap gap-2">
                    {areas.map((x) => (
                      <li key={x} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3.5 py-2 text-[15px]">
                        <Icon name="pin" size={15} className="shrink-0 text-brand-dark" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[15px] leading-relaxed text-muted">{ui.areasNote}</p>
                </Reveal>
              ) : null}
            </div>
          ) : null}
        </Container>
      </section>

      <WhyChoose dict={dict} />
      <Process dict={dict} />
      <SampleReportSection locale={locale} dict={dict} quoteHref="#quote" />

      {c.faqs?.length ? <Faq title={dict.common.faqTitle} items={c.faqs} /> : null}

      <RelatedLinks pageKey={pageKey} locale={locale} related={c.related} showEmirates />

      <FinalCta locale={locale} dict={dict} />

      {c.schema === "service" ? <JsonLd data={serviceSchema({ name: c.h1, description: c.metaDescription, url: path, area: c.city })} /> : null}
    </>
  );
}
