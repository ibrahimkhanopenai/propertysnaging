"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizePath, slugify } from "@/lib/utils";
import { staticRoutes } from "@/lib/routes";

async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/admin/login/");
  return s;
}

/* ─────────── Auth ─────────── */

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const user = email ? await prisma.adminUser.findUnique({ where: { email } }) : null;
  if (!user) {
    await bcrypt.hash(password, 12); // keep response time similar to a real check
    return { error: "Email or password is incorrect." };
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Email or password is incorrect." };
  await createSession(user.email);
  redirect("/admin/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login/");
}

/* ─────────── Posts ─────────── */

export type PostState = { error?: string; saved?: boolean };

const reservedSlugs = new Set(["ar", "en", "admin", "api", "uploads", "wp-content", "blog", ...staticRoutes.map((r) => r.path.replace(/\//g, "")).filter(Boolean)]);

const optional = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
};

const postSchema = z.object({
  title: z.string().min(3, "Title is required").max(255),
  slug: z.string().min(1).max(191).regex(/^[a-z0-9\u0600-\u06ff-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
  locale: z.enum(["en", "ar"]),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  content: z.string().min(1, "Content is required"),
  schemaType: z.enum(["BlogPosting", "Article", "HowTo"]),
  type: z.enum(["POST", "DEVELOPER"]),
});

export async function savePostAction(_prev: PostState, fd: FormData): Promise<PostState> {
  await requireAdmin();
  const id = Number(fd.get("id") || 0) || null;
  const title = String(fd.get("title") ?? "").trim();
  const parsed = postSchema.safeParse({
    title,
    slug: slugify(String(fd.get("slug") || "") || title),
    locale: fd.get("locale"),
    status: fd.get("status"),
    content: String(fd.get("content") ?? ""),
    schemaType: fd.get("schemaType") || "BlogPosting",
    type: fd.get("type") || "POST",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  const v = parsed.data;
  if (reservedSlugs.has(v.slug)) return { error: `"${v.slug}" is reserved by a page. Choose another slug.` };

  let faqs: Array<{ q: string; a: string }> = [];
  try {
    faqs = (JSON.parse(String(fd.get("faqs") || "[]")) as Array<{ q: string; a: string }>).filter((f) => f.q?.trim() && f.a?.trim());
  } catch {
    return { error: "FAQ data is invalid." };
  }

  const publishedAtRaw = optional(fd.get("publishedAt"));
  let publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null;
  if (v.status === "PUBLISHED" && !publishedAt) publishedAt = new Date();
  if (v.status === "SCHEDULED" && (!publishedAt || publishedAt <= new Date())) return { error: "Scheduled posts need a future publish date." };

  const categoryId = Number(fd.get("categoryId") || 0) || null;

  const data = {
    type: v.type,
    title: v.title,
    slug: v.slug,
    locale: v.locale,
    status: v.status,
    content: v.content,
    schemaType: v.schemaType,
    excerpt: optional(fd.get("excerpt")),
    featuredImage: optional(fd.get("featuredImage")),
    featuredImageAlt: optional(fd.get("featuredImageAlt")),
    publishedAt,
    authorName: optional(fd.get("authorName")),
    categoryId,
    tags: optional(fd.get("tags")),
    location: optional(fd.get("location")),
    relatedService: optional(fd.get("relatedService")),
    tocEnabled: fd.get("tocEnabled") === "on",
    metaTitle: optional(fd.get("metaTitle")),
    metaDescription: optional(fd.get("metaDescription")),
    focusKeyword: optional(fd.get("focusKeyword")),
    secondaryKeywords: optional(fd.get("secondaryKeywords")),
    canonicalUrl: optional(fd.get("canonicalUrl")),
    ogTitle: optional(fd.get("ogTitle")),
    ogDescription: optional(fd.get("ogDescription")),
    ogImage: optional(fd.get("ogImage")),
    robotsIndex: fd.get("robotsIndex") === "on",
    robotsFollow: fd.get("robotsFollow") === "on",
    breadcrumbTitle: optional(fd.get("breadcrumbTitle")),
    faqs,
  };

  const clash = await prisma.post.findFirst({ where: { locale: v.locale, slug: v.slug, ...(id ? { NOT: { id } } : {}) } });
  if (clash) return { error: "Another post already uses this slug." };

  const prefix = v.locale === "ar" ? "/ar" : "";
  let savedId = id;
  if (id) {
    const before = await prisma.post.findUnique({ where: { id } });
    if (!before) return { error: "Post not found." };
    await prisma.post.update({ where: { id }, data });
    // Slug changed on a live post → automatic 301 so we never lose rankings
    if (before.slug !== v.slug && before.status !== "DRAFT") {
      const from = normalizePath(`${before.locale === "ar" ? "/ar" : ""}/${before.slug}/`);
      await prisma.redirect.upsert({
        where: { fromPath: from },
        update: { toPath: `${prefix}/${v.slug}/`, statusCode: 301 },
        create: { fromPath: from, toPath: `${prefix}/${v.slug}/`, statusCode: 301 },
      });
      revalidatePath(from);
    }
  } else {
    const created = await prisma.post.create({ data });
    savedId = created.id;
  }

  revalidatePath(`${prefix}/${v.slug}/`);
  revalidatePath(`${prefix}/blog/`);
  revalidatePath(`${prefix}/snagging-by-developer/`);
  revalidatePath(`${prefix}/`);
  revalidatePath("/sitemap.xml");

  if (!id) redirect(`/admin/posts/${savedId}/?saved=1`);
  return { saved: true };
}

export async function deletePostAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const post = await prisma.post.delete({ where: { id } });
  const prefix = post.locale === "ar" ? "/ar" : "";
  revalidatePath(`${prefix}/${post.slug}/`);
  revalidatePath(`${prefix}/blog/`);
  revalidatePath("/sitemap.xml");
  redirect("/admin/posts/");
}

/* ─────────── Redirects ─────────── */

export async function createRedirectAction(fd: FormData) {
  await requireAdmin();
  const fromPath = normalizePath(String(fd.get("fromPath") ?? ""));
  const toRaw = String(fd.get("toPath") ?? "").trim();
  const toPath = toRaw.startsWith("http") ? toRaw : normalizePath(toRaw);
  const statusCode = Number(fd.get("statusCode")) === 302 ? 302 : 301;
  if (fromPath === "/" || fromPath === toPath) return;
  await prisma.redirect.upsert({ where: { fromPath }, update: { toPath, statusCode }, create: { fromPath, toPath, statusCode } });
  revalidatePath(fromPath);
  revalidatePath("/admin/redirects/");
}

export async function deleteRedirectAction(fd: FormData) {
  await requireAdmin();
  await prisma.redirect.delete({ where: { id: Number(fd.get("id")) } });
  revalidatePath("/admin/redirects/");
}

/* ─────────── Leads ─────────── */

export async function deleteLeadAction(fd: FormData) {
  await requireAdmin();
  await prisma.lead.delete({ where: { id: Number(fd.get("id")) } });
  revalidatePath("/admin/leads/");
}

/* ─────────── Reviews ─────────── */

const revalidateReviews = () => {
  for (const p of ["/", "/ar/", "/reviews/", "/ar/reviews/", "/admin/reviews/"]) revalidatePath(p);
};

export async function saveReviewAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id") || 0) || null;
  const name = String(fd.get("name") ?? "").trim();
  const text = String(fd.get("text") ?? "").trim();
  if (!name || !text) return;
  const data = {
    name,
    text,
    location: optional(fd.get("location")),
    rating: Math.min(5, Math.max(1, Number(fd.get("rating") || 5))),
    source: String(fd.get("source") || "google"),
    reviewDate: optional(fd.get("reviewDate")) ? new Date(String(fd.get("reviewDate"))) : null,
    published: fd.get("published") === "on",
    sortOrder: Number(fd.get("sortOrder") || 0),
  };
  if (id) await prisma.review.update({ where: { id }, data });
  else await prisma.review.create({ data });
  revalidateReviews();
}

export async function deleteReviewAction(fd: FormData) {
  await requireAdmin();
  await prisma.review.delete({ where: { id: Number(fd.get("id")) } });
  revalidateReviews();
}

/* ─────────── Gallery ─────────── */

const revalidateGallery = () => {
  for (const p of ["/", "/ar/", "/gallery/", "/ar/gallery/", "/admin/gallery/"]) revalidatePath(p);
};

export async function saveGalleryImageAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id") || 0) || null;
  const url = String(fd.get("url") ?? "").trim();
  const alt = String(fd.get("alt") ?? "").trim();
  if (!url || !alt) return; // ALT text is mandatory (client SEO rule)
  const data = {
    url,
    alt,
    caption: optional(fd.get("caption")),
    category: ["defects", "equipment", "reporting", "inspection"].includes(String(fd.get("category"))) ? String(fd.get("category")) : "defects",
    featured: fd.get("featured") === "on",
    sortOrder: Number(fd.get("sortOrder") || 0),
  };
  if (id) await prisma.galleryImage.update({ where: { id }, data });
  else await prisma.galleryImage.create({ data });
  revalidateGallery();
}

export async function deleteGalleryImageAction(fd: FormData) {
  await requireAdmin();
  await prisma.galleryImage.delete({ where: { id: Number(fd.get("id")) } });
  revalidateGallery();
}
