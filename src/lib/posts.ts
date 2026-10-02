import "server-only";
import { prisma } from "@/lib/db";
import type { Locale } from "@/i18n/config";
import { normalizePath } from "@/lib/utils";

const publishedWhere = () => ({
  status: { in: ["PUBLISHED", "SCHEDULED"] as ("PUBLISHED" | "SCHEDULED")[] },
  publishedAt: { lte: new Date() },
});

/** All reads are wrapped so the public site still renders if MySQL is down at build time. */
export async function getPublishedPosts(locale: Locale, take?: number, type: "POST" | "DEVELOPER" = "POST") {
  try {
    return await prisma.post.findMany({
      where: { locale, type, ...publishedWhere() },
      orderBy: { publishedAt: "desc" },
      take,
      include: { category: true },
    });
  } catch (e) {
    console.error("[posts] getPublishedPosts failed", e);
    return [];
  }
}

export async function getPostBySlug(locale: Locale, slug: string) {
  try {
    return await prisma.post.findFirst({
      where: { locale, slug, ...publishedWhere() },
      include: { category: true },
    });
  } catch (e) {
    console.error("[posts] getPostBySlug failed", e);
    return null;
  }
}

export async function getAllPublishedForSitemap() {
  try {
    return await prisma.post.findMany({
      where: { ...publishedWhere(), robotsIndex: true },
      select: { slug: true, locale: true, updatedAt: true },
    });
  } catch {
    return [];
  }
}

export async function findRedirect(path: string) {
  try {
    return await prisma.redirect.findUnique({ where: { fromPath: normalizePath(path) } });
  } catch {
    return null;
  }
}
