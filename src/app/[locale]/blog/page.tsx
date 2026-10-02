import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/pages/PageHero";
import { PostCard } from "@/components/blog/PostCard";
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
  return buildMetadata({ locale, path: "/blog/", title: d.blog.title, description: d.blog.intro });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  const posts = await getPublishedPosts(locale);
  return (
    <>
      <PageHero
        h1={d.blog.title}
        intro={d.blog.intro}
        breadcrumbs={[
          { name: d.common.home, url: localePath(locale, "/") },
          { name: d.blog.title, url: localePath(locale, "/blog/") },
        ]}
      />
      <section className="py-16 md:py-24">
        <Container>
          {posts.length === 0 ? (
            <p className="text-lg text-muted">{d.blog.empty}</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} locale={locale} readMore={d.blog.readMore} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
