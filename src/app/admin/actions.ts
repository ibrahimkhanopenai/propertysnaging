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
import { slotFormValues, type SlotFormValues } from "@/lib/site-images";
import { site } from "@/lib/site";

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
