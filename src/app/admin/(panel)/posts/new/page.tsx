import { PostForm } from "@/components/admin/PostForm";
import { prisma } from "@/lib/db";
import { staticRoutes } from "@/lib/routes";

export const metadata = { title: "New post" };

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">New post</h1>
      <PostForm categories={categories} services={staticRoutes.map((r) => r.path)} />
    </div>
  );
}
