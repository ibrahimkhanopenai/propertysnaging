import { beforeEach, describe, expect, it, vi } from "vitest";

const { post, redirect } = vi.hoisted(() => ({
  post: { findMany: vi.fn(), findFirst: vi.fn() },
  redirect: { findUnique: vi.fn() },
}));
vi.mock("@/lib/db", () => ({ prisma: { post, redirect } }));

import { findRedirect, getAllPublishedForSitemap, getPostBySlug, getPublishedPosts } from "@/lib/posts";

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("public post reads", () => {
  it("only asks for published/scheduled posts that are already live", async () => {
    post.findMany.mockResolvedValue([]);
    await getPublishedPosts("en", 3);
    const where = post.findMany.mock.calls[0][0].where;
    expect(where).toMatchObject({ locale: "en", type: "POST", status: { in: ["PUBLISHED", "SCHEDULED"] } });
    expect(where.publishedAt.lte).toBeInstanceOf(Date);
  });

  it("excludes noindex posts from the sitemap", async () => {
    post.findMany.mockResolvedValue([]);
    await getAllPublishedForSitemap();
    expect(post.findMany.mock.calls[0][0].where).toMatchObject({ robotsIndex: true });
  });

  it("normalises redirect lookups to /path/", async () => {
    redirect.findUnique.mockResolvedValue(null);
    await findRedirect("old-post");
    expect(redirect.findUnique).toHaveBeenCalledWith({ where: { fromPath: "/old-post/" } });
  });

  it("keeps pages rendering when MySQL is down", async () => {
    const down = new Error("ECONNREFUSED");
    post.findMany.mockRejectedValue(down);
    post.findFirst.mockRejectedValue(down);
    redirect.findUnique.mockRejectedValue(down);
    expect(await getPublishedPosts("ar")).toEqual([]);
    expect(await getPostBySlug("en", "x")).toBeNull();
    expect(await getAllPublishedForSitemap()).toEqual([]);
    expect(await findRedirect("/x/")).toBeNull();
  });
});
