import Image from "next/image";
import Link from "next/link";
import type { Post, Category } from "@prisma/client";
import { localePath, type Locale } from "@/i18n/config";

export function PostCard({ post, locale, readMore }: { post: Post & { category: Category | null }; locale: Locale; readMore: string }) {
  const href = localePath(locale, `/${post.slug}/`);
  const date = post.publishedAt ?? post.createdAt;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <Link href={href} className="relative block aspect-[16/10] bg-mist" tabIndex={-1} aria-hidden="true">
        {post.featuredImage ? (
          <Image src={post.featuredImage} alt={post.featuredImageAlt || ""} fill sizes="(min-width: 768px) 380px, 100vw" className="object-cover" />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-[13px] text-subtle">
          {post.category ? `${post.category.name} · ` : ""}
          <time dateTime={date.toISOString()}>
            {date.toLocaleDateString(locale === "ar" ? "ar-AE" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </time>
        </p>
        <h3 className="font-display text-lg font-extrabold leading-snug">
          <Link href={href} className="hover:underline underline-offset-4">{post.title}</Link>
        </h3>
        {post.excerpt ? <p className="line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p> : null}
        <span className="mt-auto pt-2 text-sm font-semibold">{readMore}</span>
      </div>
    </article>
  );
}
