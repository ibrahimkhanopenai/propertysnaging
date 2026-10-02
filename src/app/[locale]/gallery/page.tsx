import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/home/CtaBand";
import { Container } from "@/components/ui/Container";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localePath } from "@/i18n/config";
import { getGallery } from "@/lib/content-db";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return buildMetadata({ locale, path: "/gallery/", title: d.galleryPage.metaTitle, description: d.galleryPage.metaDescription });
}

/** Photos are managed in Admin → Gallery (upload, alt text, caption, category). Grouped by category. */
export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const photos = await getGallery();
  const cats = (["defects", "inspection", "equipment", "reporting"] as const).filter((c) => photos.some((p) => p.category === c));
  return (
    <>
      <PageHero h1={d.galleryPage.title} intro={d.galleryPage.intro} breadcrumbs={[{ name: d.common.home, url: localePath(locale, "/") }, { name: d.nav.gallery, url: localePath(locale, "/gallery/") }]} />
      {cats.map((cat) => (
        <section key={cat} className="py-12">
          <Container className="flex flex-col gap-6">
            <h2 className="font-display text-2xl font-extrabold">{d.galleryPage.categories[cat]}</h2>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {photos.filter((p) => p.category === cat).map((p) => (
                <li key={p.id}>
                  <figure className="flex flex-col gap-2">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-tint ring-brand transition hover:ring-4">
                      <Image src={p.url} alt={p.alt} fill sizes="(min-width: 1024px) 290px, (min-width: 768px) 33vw, 50vw" className="object-cover" />
                    </div>
                    {p.caption ? <figcaption className="text-sm text-muted">{p.caption}</figcaption> : null}
                  </figure>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ))}
      <CtaBand dict={d} quoteHref={`${localePath(locale, "/")}#quote`} />
    </>
  );
}
