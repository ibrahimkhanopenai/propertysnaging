import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { prisma } from "@/lib/db";
import { staticRoutes } from "@/lib/routes";
import { deletePostAction } from "../../../actions";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const { saved } = await searchParams;
  const [post, categories] = await Promise.all([
    prisma.post.findUnique({ where: { id: Number(id) } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!post) notFound();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Edit post</h1>
        <form action={deletePostAction}>
          <input type="hidden" name="id" value={post.id} />
          <button className="rounded-xl border border-snag px-4 py-2 text-sm font-semibold text-snag">Delete post</button>
        </form>
      </div>
      {saved ? <p className="rounded-xl bg-white p-3 text-sm text-wa-dark">Post created.</p> : null}
      <PostForm post={post} categories={categories} services={staticRoutes.map((r) => r.path)} />
    </div>
  );
}
