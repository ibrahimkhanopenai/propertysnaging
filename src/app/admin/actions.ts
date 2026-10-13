"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { normalizePath, slugify } from "@/lib/utils";
import { staticRoutes } from "@/lib/routes";
import { settingFields, validateSetting } from "@/lib/settings-fields";
import { defaultAreas, isLocationKey, suggestedCommunities } from "@/content/location-defaults";
import { getImageSlot, isImagePath } from "@/lib/image-slots";
import { siteImage, slotFormValues, type SlotFormValues } from "@/lib/site-images";
import { site } from "@/lib/site";
import { Prisma } from "@prisma/client";
import { getPageContent } from "@/content/pages";
import { getEditablePage } from "@/lib/admin-pages";
import { defaultFaqs, faqPages, isFaqPage, type FaqPageKey } from "@/lib/faqs";
import { cleanSections, pageTextFormValues, pageTextLimits, sameSections, type PageTextFormValues } from "@/lib/page-text";
import en from "@/i18n/dictionaries/en";
import ar from "@/i18n/dictionaries/ar";

async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect("/admin/login/");
  return s;
}

/* ─────────── Auth ─────────── */

export type LoginState = { error?: string };

// Brute-force guard: 10 failed attempts / 15 min per IP, and per email from any IP
const loginByIp = createRateLimiter({ limit: 10, windowMs: 15 * 60_000 });
const loginByEmail = createRateLimiter({ limit: 10, windowMs: 15 * 60_000 });

export async function loginAction(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const ip = clientIp(await headers());
  // Count the attempt up front; a successful login clears both counters below
  const ipBlocked = loginByIp.hit(ip);
  const emailBlocked = email ? loginByEmail.hit(email) : false;
  if (ipBlocked || emailBlocked) return { error: "Too many login attempts. Try again in 15 minutes." };
  const user = email ? await prisma.adminUser.findUnique({ where: { email } }) : null;
  if (!user) {
    await bcrypt.hash(password, 12); // keep response time similar to a real check
    return { error: "Email or password is incorrect." };
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Email or password is incorrect." };
  loginByIp.reset(ip);
  loginByEmail.reset(email);
  await createSession(user.email);
  redirect("/admin/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login/");
}

/* ─────────── Posts ─────────── */

export type PostState = { error?: string; saved?: boolean };

const reservedSlugs = new Set(["ar", "en", "admin", "api", "uploads", "images", "downloads", "blog", ...staticRoutes.map((r) => r.path.replace(/\//g, "")).filter(Boolean)]);

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

/** Drops the cached pages that show a post. EN is served from /en/... internally (middleware rewrite), so the route patterns are revalidated too. */
function revalidatePost(locale: string, slug: string) {
  const prefix = locale === "ar" ? "/ar" : "";
  for (const p of [`${prefix}/${slug}/`, `${prefix}/blog/`, `${prefix}/snagging-by-developer/`, `${prefix}/`, "/sitemap.xml", "/admin/posts/"]) revalidatePath(p);
  for (const r of ["/[locale]/[...slug]", "/[locale]/blog", "/[locale]/snagging-by-developer", "/[locale]"]) revalidatePath(r, "page");
}

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

  revalidatePost(v.locale, v.slug);

  if (!id) redirect(`/admin/posts/${savedId}/?saved=1`);
  return { saved: true };
}

export async function deletePostAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const post = await prisma.post.delete({ where: { id } });
  revalidatePost(post.locale, post.slug);
  redirect("/admin/posts/");
}

/** Blog list toggle. Publish = live now (keeps an earlier publish date); unpublish = back to Draft. */
export async function setPostPublishedAction(id: number, published: boolean): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "Invalid post." };
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { ok: false, error: "Post not found." };
  const now = new Date();
  await prisma.post.update({
    where: { id },
    data: published ? { status: "PUBLISHED", publishedAt: post.publishedAt && post.publishedAt <= now ? post.publishedAt : now } : { status: "DRAFT" },
  });
  revalidatePost(post.locale, post.slug);
  return { ok: true };
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

/* ─────────── Locations: areas + communities ─────────── */

const locationPaths = (emirate: string) => {
  const path = staticRoutes.find((r) => r.key === emirate && r.group === "location")?.path;
  return path ? [path, `/ar${path}`] : [];
};

const revalidateLocation = (emirate: string) => {
  const [path] = locationPaths(emirate);
  if (path) revalidatePath(`/[locale]${path.replace(/\/$/, "")}`, "page"); // EN is served from /en/... internally (middleware rewrite)
  for (const p of [...locationPaths(emirate), "/admin/locations/"]) revalidatePath(p);
};

export async function saveLocationItemAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id") || 0) || null;
  const emirate = String(fd.get("emirate") ?? "");
  const kind = fd.get("kind") === "COMMUNITY" ? "COMMUNITY" : "AREA";
  const name = String(fd.get("name") ?? "").trim().slice(0, 160);
  if (!locationPaths(emirate).length || !name) return;
  const data = {
    emirate,
    kind,
    name,
    nameAr: optional(fd.get("nameAr"))?.slice(0, 160) ?? null,
    developer: kind === "COMMUNITY" ? (optional(fd.get("developer"))?.slice(0, 120) ?? null) : null,
    published: fd.get("published") === "on",
  } as const;
  // Order is set by dragging (reorderLocationItemsAction); a new row goes to the end of its list
  if (id) await prisma.locationItem.update({ where: { id }, data });
  else {
    const { _max } = await prisma.locationItem.aggregate({ where: { emirate, kind }, _max: { sortOrder: true } });
    await prisma.locationItem.create({ data: { ...data, sortOrder: (_max.sortOrder ?? 0) + 1 } });
  }
  revalidateLocation(emirate);
}

/** Drag-to-reorder: `ids` = one emirate's AREA or COMMUNITY list in its new order → sortOrder 1…n. */
export async function reorderLocationItemsAction(ids: number[]): Promise<{ ok: boolean }> {
  await requireAdmin();
  if (!Array.isArray(ids) || !ids.length || !ids.every(Number.isInteger) || new Set(ids).size !== ids.length) return { ok: false };
  const rows = await prisma.locationItem.findMany({ where: { id: { in: ids } }, select: { emirate: true, kind: true } });
  // All rows must exist and belong to the same list
  if (rows.length !== ids.length || new Set(rows.map((r) => `${r.emirate}|${r.kind}`)).size !== 1) return { ok: false };
  await prisma.$transaction(ids.map((id, i) => prisma.locationItem.update({ where: { id }, data: { sortOrder: i + 1 } })));
  revalidateLocation(rows[0].emirate);
  return { ok: true };
}

export async function deleteLocationItemAction(fd: FormData) {
  await requireAdmin();
  const item = await prisma.locationItem.delete({ where: { id: Number(fd.get("id")) } });
  revalidateLocation(item.emirate);
}

/* ─────────── Settings ─────────── */

export type SettingsState = { error?: string; saved?: boolean };

export async function saveSettingsAction(_prev: SettingsState, fd: FormData): Promise<SettingsState> {
  await requireAdmin();
  const errors: string[] = [];
  const upserts: Array<{ key: string; value: string }> = [];
  const resets: string[] = [];
  for (const f of settingFields) {
    const value = String(fd.get(f.key) ?? "").trim();
    // Empty or equal to the default → no row, so the site.ts default applies (and future default changes flow through)
    if (value === "" || value === f.defaultValue) {
      resets.push(f.key);
      continue;
    }
    const err = validateSetting(f, value);
    if (err) errors.push(err);
    else upserts.push({ key: f.key, value });
  }
  if (errors.length) return { error: errors.join(" ") };
  await prisma.$transaction([
    prisma.setting.deleteMany({ where: { key: { in: resets } } }),
    ...upserts.map((u) => prisma.setting.upsert({ where: { key: u.key }, update: { value: u.value }, create: u })),
  ]);
  // Contact details and key figures appear on every page (header, footer, schema) → regenerate all
  revalidatePath("/", "layout");
  return { saved: true };
}

/** Fills an empty list with the defaults (content/location-defaults.ts). Never touches a list that has rows. */
export async function loadLocationDefaultsAction(fd: FormData) {
  await requireAdmin();
  const emirate = String(fd.get("emirate") ?? "");
  const kind = fd.get("kind") === "COMMUNITY" ? "COMMUNITY" : "AREA";
  if (!isLocationKey(emirate)) return;
  if (await prisma.locationItem.count({ where: { emirate, kind } })) return;
  const items =
    kind === "AREA"
      ? defaultAreas(emirate).map((a) => ({ name: a.name, nameAr: a.nameAr, developer: null }))
      : suggestedCommunities[emirate];
  await prisma.locationItem.createMany({ data: items.map((x, i) => ({ ...x, emirate, kind, sortOrder: i + 1 })) });
  revalidateLocation(emirate);
}

/* ─────────── Images (photo + ALT per slot, src/lib/image-slots.ts) ─────────── */

export type ImageSlotState = { error?: string; saved?: boolean; values?: SlotFormValues };

/** Saves one slot. Values equal to the default store nothing; intent=reset deletes the row (back to the default photo + ALT). */
export async function saveSiteImageAction(_prev: ImageSlotState, fd: FormData): Promise<ImageSlotState> {
  await requireAdmin();
  const slot = getImageSlot(String(fd.get("key") ?? ""));
  if (!slot) return { error: "Unknown image." };

  if (fd.get("intent") === "reset") {
    await prisma.siteImage.deleteMany({ where: { key: slot.key } });
    revalidatePath("/", "layout");
    return { saved: true, values: slotFormValues(slot, undefined) };
  }

  const url = String(fd.get("url") ?? "").trim();
  const alt = String(fd.get("alt") ?? "").trim().slice(0, 255);
  const altAr = String(fd.get("altAr") ?? "").trim().slice(0, 255);
  if (url && !isImagePath(url)) return { error: "Upload a JPG, PNG, WebP or AVIF image." };
  const data = {
    url: url && url !== slot.src ? url : null,
    alt: alt && alt !== slot.alt("en") ? alt : null,
    altAr: altAr && altAr !== slot.alt("ar") ? altAr : null,
  };
  // The default ALT describes the default photo (client rule: descriptive ALT for every image)
  if (data.url && !data.alt) return { error: "New photo: write an English ALT text that describes it." };

  const row = data.url || data.alt || data.altAr ? { key: slot.key, ...data } : undefined;
  if (row) await prisma.siteImage.upsert({ where: { key: slot.key }, update: data, create: row });
  else await prisma.siteImage.deleteMany({ where: { key: slot.key } });
  // Slots appear on many pages (sample report on every location page, OG images) → regenerate all
  revalidatePath("/", "layout");
  return { saved: true, values: slotFormValues(slot, row) };
}

/* ─────────── Developer logos (homepage strip) ─────────── */

const revalidateDevelopers = () => {
  revalidatePath("/[locale]", "page"); // homepage, EN (/en internally) + AR
  revalidatePath("/admin/developers/");
};

export async function saveDeveloperAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id") || 0) || null;
  const name = String(fd.get("name") ?? "").trim().slice(0, 120);
  const logo = String(fd.get("logo") ?? "").trim();
  if (!name || !isImagePath(logo)) return;
  const data = {
    name,
    nameAr: optional(fd.get("nameAr"))?.slice(0, 120) ?? null,
    logo,
    published: fd.get("published") === "on",
    sortOrder: Number(fd.get("sortOrder") || 0) || 0,
  };
  if (id) await prisma.developerLogo.update({ where: { id }, data });
  else await prisma.developerLogo.create({ data });
  revalidateDevelopers();
}

export async function deleteDeveloperAction(fd: FormData) {
  await requireAdmin();
  await prisma.developerLogo.delete({ where: { id: Number(fd.get("id")) } });
  revalidateDevelopers();
}

/** Copies the default logos (site.developers) into the empty list so they can be edited. */
export async function loadDefaultDevelopersAction() {
  await requireAdmin();
  if (await prisma.developerLogo.count()) return;
  await prisma.developerLogo.createMany({ data: site.developers.map((d, i) => ({ name: d.name, logo: d.logo, sortOrder: i + 1 })) });
  revalidateDevelopers();
}

/* ─────────── Phase 3: FAQs, "Defects we find", page text ─────────── */

/** Regenerates one public page (EN + AR). EN is served from /en/... internally (middleware rewrite), so the route pattern is revalidated too. */
function revalidatePublicPage(path: string) {
  revalidatePath(path === "/" ? "/[locale]" : `/[locale]${path.replace(/\/$/, "")}`, "page");
  revalidatePath(path);
  revalidatePath(`/ar${path}`);
}

/** Same checks as the Locations drag order: integer ids, no duplicates. */
const validIds = (ids: unknown): ids is number[] =>
  Array.isArray(ids) && ids.length > 0 && ids.every(Number.isInteger) && new Set(ids).size === ids.length;

const text = (fd: FormData, key: string, max: number) => String(fd.get(key) ?? "").trim().slice(0, max);

/* FAQs (homepage + service/location pages) */

const revalidateFaqs = (page: FaqPageKey) => {
  const p = faqPages.find((x) => x.key === page)!;
  revalidatePublicPage(p.path);
  if (p.group !== "location") revalidatePublicPage("/faqs/"); // /faqs/ lists the homepage + service FAQs
  revalidatePath("/admin/faqs/");
};

export async function saveFaqAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id") || 0) || null;
  const page = String(fd.get("page") ?? "");
  const question = text(fd, "question", 500);
  const answer = text(fd, "answer", 5000);
  if (!isFaqPage(page) || !question || !answer) return;
  const data = {
    page,
    question,
    answer,
    questionAr: text(fd, "questionAr", 500) || null,
    answerAr: text(fd, "answerAr", 5000) || null,
    published: fd.get("published") === "on",
  };
  // Order is set by dragging (reorderFaqsAction); a new FAQ goes to the end of its page
  if (id) await prisma.faqItem.update({ where: { id }, data });
  else {
    const { _max } = await prisma.faqItem.aggregate({ where: { page }, _max: { sortOrder: true } });
    await prisma.faqItem.create({ data: { ...data, sortOrder: (_max.sortOrder ?? 0) + 1 } });
  }
  revalidateFaqs(page);
}

export async function reorderFaqsAction(ids: number[]): Promise<{ ok: boolean }> {
  await requireAdmin();
  if (!validIds(ids)) return { ok: false };
  const rows = await prisma.faqItem.findMany({ where: { id: { in: ids } }, select: { page: true } });
  if (rows.length !== ids.length || new Set(rows.map((r) => r.page)).size !== 1 || !isFaqPage(rows[0].page)) return { ok: false };
  await prisma.$transaction(ids.map((id, i) => prisma.faqItem.update({ where: { id }, data: { sortOrder: i + 1 } })));
  revalidateFaqs(rows[0].page);
  return { ok: true };
}

export async function deleteFaqAction(fd: FormData) {
  await requireAdmin();
  const item = await prisma.faqItem.delete({ where: { id: Number(fd.get("id")) } });
  if (isFaqPage(item.page)) revalidateFaqs(item.page);
}

/** Copies a page's FAQs from the code (dictionaries / content files, EN + AR paired by position) into the empty list. */
export async function loadDefaultFaqsAction(fd: FormData) {
  await requireAdmin();
  const page = String(fd.get("page") ?? "");
  if (!isFaqPage(page) || (await prisma.faqItem.count({ where: { page } }))) return;
  const arFaqs = defaultFaqs(page, "ar");
  await prisma.faqItem.createMany({
    data: defaultFaqs(page, "en").map((f, i) => ({ page, question: f.q, answer: f.a, questionAr: arFaqs[i]?.q ?? null, answerAr: arFaqs[i]?.a ?? null, sortOrder: i + 1 })),
  });
  revalidateFaqs(page);
}

/* "Defects we find" (homepage Real findings) */

const revalidateFindings = () => {
  revalidatePublicPage("/");
  revalidatePath("/admin/findings/");
};

export async function saveFindingAction(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id") || 0) || null;
  const data = {
    category: text(fd, "category", 80),
    categoryAr: text(fd, "categoryAr", 80) || null,
    defect: text(fd, "defect", 500),
    defectAr: text(fd, "defectAr", 500) || null,
    fix: text(fd, "fix", 500),
    fixAr: text(fd, "fixAr", 500) || null,
    photo: text(fd, "photo", 500),
    alt: text(fd, "alt", 255),
    altAr: text(fd, "altAr", 255) || null,
    published: fd.get("published") === "on",
  };
  // Photo + English ALT are required (client rule: descriptive ALT on every image)
  if (!data.category || !data.defect || !data.fix || !data.alt || !isImagePath(data.photo)) return;
  if (id) await prisma.finding.update({ where: { id }, data });
  else {
    const { _max } = await prisma.finding.aggregate({ _max: { sortOrder: true } });
    await prisma.finding.create({ data: { ...data, sortOrder: (_max.sortOrder ?? 0) + 1 } });
  }
  revalidateFindings();
}

export async function reorderFindingsAction(ids: number[]): Promise<{ ok: boolean }> {
  await requireAdmin();
  if (!validIds(ids) || (await prisma.finding.count({ where: { id: { in: ids } } })) !== ids.length) return { ok: false };
  await prisma.$transaction(ids.map((id, i) => prisma.finding.update({ where: { id }, data: { sortOrder: i + 1 } })));
  revalidateFindings();
  return { ok: true };
}

export async function deleteFindingAction(fd: FormData) {
  await requireAdmin();
  await prisma.finding.delete({ where: { id: Number(fd.get("id")) } });
  revalidateFindings();
}

/** Copies the current list (dictionaries + the Admin → Images "Defects we find" photos) into the empty table. */
export async function loadDefaultFindingsAction() {
  await requireAdmin();
  if (await prisma.finding.count()) return;
  type ScopeKey = keyof typeof site.images.scope;
  const data = await Promise.all(
    en.home.findings.items.map(async (it, i) => {
      const a = ar.home.findings.items[i];
      const photoEn = await siteImage(`scope.${it.photo as ScopeKey}`, "en");
      const photoAr = await siteImage(`scope.${it.photo as ScopeKey}`, "ar");
      return {
        category: it.category,
        categoryAr: a?.category ?? null,
        defect: it.defect,
        defectAr: a?.defect ?? null,
        fix: it.fix,
        fixAr: a?.fix ?? null,
        photo: photoEn.src,
        alt: photoEn.alt,
        altAr: photoAr.alt !== photoEn.alt ? photoAr.alt : null,
        sortOrder: i + 1,
      };
    }),
  );
  await prisma.finding.createMany({ data });
  revalidateFindings();
}

/* Page text (service + location pages: hook, intro, sections) */

export type PageTextState = { error?: string; saved?: boolean; values?: PageTextFormValues };

/** Saves one page + language. A field equal to the content file stores null (so later code edits flow through); intent=reset deletes the row. */
export async function savePageTextAction(_prev: PageTextState, fd: FormData): Promise<PageTextState> {
  await requireAdmin();
  const page = getEditablePage(String(fd.get("page") ?? ""));
  if (!page) return { error: "Unknown page." };
  const locale = fd.get("locale") === "ar" ? "ar" : "en";
  const c = getPageContent(page.key, locale);

  if (fd.get("intent") === "reset") {
    await prisma.pageText.deleteMany({ where: { page: page.key, locale } });
    revalidatePublicPage(page.path);
    return { saved: true, values: pageTextFormValues(c, null) };
  }

  const L = pageTextLimits;
  const hook = page.group === "location" ? String(fd.get("hook") ?? "").trim() : "";
  const intro = String(fd.get("intro") ?? "").trim();
  if (hook.length > L.hook) return { error: `The hook is too long (max ${L.hook} characters).` };
  if (intro.length > L.intro) return { error: `The intro is too long (max ${L.intro} characters).` };
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(fd.get("sections") ?? ""));
  } catch {
    return { error: "Section data is invalid." };
  }
  const cleaned = cleanSections(parsed);
  if ("error" in cleaned) return { error: cleaned.error };

  // Empty or equal to the content file → null = the default
  const data = {
    hook: hook && hook !== (c.hook ?? "") ? hook : null,
    intro: intro && intro !== c.intro ? intro : null,
    sections: sameSections(cleaned.sections, c.sections) ? null : cleaned.sections,
  };
  if (data.hook === null && data.intro === null && data.sections === null) await prisma.pageText.deleteMany({ where: { page: page.key, locale } });
  else {
    const row = { hook: data.hook, intro: data.intro, sections: data.sections ?? Prisma.DbNull };
    await prisma.pageText.upsert({ where: { page_locale: { page: page.key, locale } }, update: row, create: { page: page.key, locale, ...row } });
  }
  revalidatePublicPage(page.path);
  return { saved: true, values: pageTextFormValues(c, data) };
}
