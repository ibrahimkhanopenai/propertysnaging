import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/home/CtaBand";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/ui/Container";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localePath } from "@/i18n/config";
import { getPublishedPosts } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return buildMetadata({ locale, path: "/snagging-by-developer/", title: d.developerHub.metaTitle, description: d.developerHub.metaDescription });
}

/**
 * Hub for developer / development pages (Emaar, DAMAC, Sobha…). Pages are created in
 * Admin → Posts with type "Developer page" — only publish them when they have genuine,
 * useful content (client rule: no thin keyword pages).
 */
export default async function DeveloperHubPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const pages = await getPublishedPosts(locale, undefined, "DEVELOPER");
  return (
    <>
      <PageHero h1={d.developerHub.title} intro={d.developerHub.intro} breadcrumbs={[{ name: d.common.home, url: localePath(locale, "/") }, { name: d.developerHub.title, url: localePath(locale, "/snagging-by-developer/") }]} />
      <section className="py-16">
        <Container>
          {pages.length === 0 ? (
            <p className="text-lg text-muted">{d.developerHub.empty}</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((p) => (
                <li key={p.id}><PostCard post={p} locale={locale} readMore={d.developerHub.read} /></li>
              ))}
            </ul>
          )}
        </Container>
      </section>
      <CtaBand dict={d} quoteHref={`${localePath(locale, "/")}#quote`} />
    </>
  );
}
