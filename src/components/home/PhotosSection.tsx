import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/i18n/dictionaries";
import { localePath, type Locale } from "@/i18n/config";
import { getGallery } from "@/lib/content-db";

/** Real inspection photos (Admin → Gallery, "featured"). Purple frame on hover = client rule for pictures. */
export async function PhotosSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.home.photos;
  const photos = await getGallery({ featuredOnly: true, take: 12 });
  return (
    <section className="py-20 md:py-24">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title={t.title} text={t.text} />
          <Link href={localePath(locale, "/gallery/")} className="font-semibold underline-offset-4 hover:underline">{t.link}</Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <li key={p.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-brand-tint ring-brand transition hover:ring-4">
              <Image src={p.url} alt={p.alt} fill sizes="(min-width: 1024px) 290px, (min-width: 768px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
              {p.caption ? (
                <span className="absolute inset-x-2 bottom-2 rounded-lg bg-brand/90 px-2.5 py-1.5 text-xs font-semibold text-white">{p.caption}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
