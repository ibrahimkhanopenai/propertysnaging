import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq } from "@/components/pages/Faq";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localePath } from "@/i18n/config";
import { renderMarkdown } from "@/lib/markdown";
import { findRedirect, getPostBySlug } from "@/lib/posts";
import { articleSchema, serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { readingMinutes } from "@/lib/utils";

/**
 * Blog posts live at the ROOT (/{slug}/) exactly like the old site.
 * Unknown paths fall back to the Redirect table, then (post only in the other language) the
 * blog/developer listing, then 404.
 */
export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ locale: string; slug: string[] }> };

async function load({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || slug.length !== 1) return { locale: null, post: null, slug } as const;
  const post = await getPostBySlug(locale, decodeURIComponent(slug[0]));
  return { locale, post, slug } as const;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, post } = await load(props);
  if (!locale || !post) return {};
  return buildMetadata({
    locale,
    path: `/${post.slug}/`,
    title: post.metaTitle || post.title,
    absoluteTitle: Boolean(post.metaTitle),
    description: post.metaDescription || post.excerpt || "",
    image: post.ogImage || post.featuredImage,
    hasAlternates: false,
    canonical: post.canonicalUrl,
    robots: { index: post.robotsIndex, follow: post.robotsFollow },
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
  });
}

export default async function PostPage(props: Props) {
  const { locale, post, slug } = await load(props);
  if (!locale || !post) {
    const { locale: rawLocale } = await props.params;
    const prefix = rawLocale === "ar" ? "/ar" : "";
    const r = await findRedirect(`${prefix}/${slug.join("/")}/`);
    if (r) {
      if (r.statusCode === 302 || r.statusCode === 307) redirect(r.toPath);
      permanentRedirect(r.toPath);
    }
    // Post exists only in the other language (language switch link) → this language's listing, not a 404
    if (isLocale(rawLocale) && slug.length === 1) {
      const other = await getPostBySlug(rawLocale === "ar" ? "en" : "ar", decodeURIComponent(slug[0]));
      if (other) redirect(localePath(rawLocale, other.type === "DEVELOPER" ? "/snagging-by-developer/" : "/blog/"));
    }
    notFound();
  }

  const d = getDictionary(locale);
  const isDeveloperPage = post.type === "DEVELOPER";
  const { html, toc } = renderMarkdown(post.content);
  const url = localePath(locale, `/${post.slug}/`);
  const faqs = Array.isArray(post.faqs) ? (post.faqs as unknown as Array<{ q: string; a: string }>).filter((f) => f?.q && f?.a) : [];
  const date = post.publishedAt ?? post.createdAt;
  const fmt = (dt: Date) => dt.toLocaleDateString(locale === "ar" ? "ar-AE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <article>
        <header className="border-b border-line">
          <Container className="flex max-w-4xl flex-col gap-5 py-12 md:py-16">
            <Breadcrumbs
              items={[
                { name: d.common.home, url: localePath(locale, "/") },
                isDeveloperPage
                  ? { name: d.developerHub.title, url: localePath(locale, "/snagging-by-developer/") }
                  : { name: d.blog.title, url: localePath(locale, "/blog/") },
                { name: post.breadcrumbTitle || post.title, url },
              ]}
            />
            <h1 className="font-display text-[clamp(2rem,4.2vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-balance">{post.title}</h1>
            {post.excerpt ? <p className="text-lg leading-relaxed text-muted">{post.excerpt}</p> : null}
            {isDeveloperPage ? null : (
            <p className="text-sm text-subtle">
              {d.blog.published} <time dateTime={date.toISOString()}>{fmt(date)}</time>
              {" · "}
              {d.blog.updated} <time dateTime={post.updatedAt.toISOString()}>{fmt(post.updatedAt)}</time>
              {" · "}
              {readingMinutes(post.content)} {d.blog.minRead}
            </p>
            )}
          </Container>
        </header>

        {post.featuredImage ? (
          <Container className="max-w-5xl pt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] bg-mist">
              <Image src={post.featuredImage} alt={post.featuredImageAlt || post.title} fill priority sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
            </div>
          </Container>
        ) : null}

        <Container className="grid max-w-5xl gap-12 py-12 md:py-16 lg:grid-cols-[1fr_240px]">
          <div className="article-body min-w-0" dangerouslySetInnerHTML={{ __html: html }} />
          {post.tocEnabled && toc.length > 2 ? (
            <aside className="order-first lg:order-last">
              <nav aria-label={d.blog.toc} className="rounded-2xl border border-line p-5 lg:sticky lg:top-28">
                <p className="mb-3 font-semibold">{d.blog.toc}</p>
                <ol className="flex flex-col gap-2 text-sm">
                  {toc.map((t) => (
                    <li key={t.id} className={t.level === 3 ? "ps-4" : ""}>
                      <a href={`#${t.id}`} className="text-muted hover:text-ink">{t.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          ) : null}
        </Container>
      </article>

      {faqs.length ? <Faq title={d.blog.faq} items={faqs} /> : null}

      <section className="pb-20">
        <Container className="max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-8 md:p-12">
            <p className="font-display text-2xl font-extrabold text-white">{d.blog.relatedCta}</p>
            <ButtonLink href={post.relatedService ? localePath(locale, post.relatedService) : `${localePath(locale, "/")}#quote`} variant="light" size="lg">
              {d.blog.relatedCtaButton}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {isDeveloperPage ? (
        <JsonLd data={serviceSchema({ name: post.title, description: post.metaDescription || post.excerpt || "", url })} />
      ) : (
      <JsonLd
        data={articleSchema({
          type: post.schemaType,
          title: post.title,
          description: post.metaDescription || post.excerpt || "",
          url,
          image: post.featuredImage,
          datePublished: date.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          author: post.authorName,
          inLanguage: locale,
        })}
      />
      )}
    </>
  );
}
