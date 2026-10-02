import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = { title: "Blog posts" };

export default async function PostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" }, include: { category: true } });
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog posts</h1>
        <Link href="/admin/posts/new/" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white">New post</Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-line text-start text-muted">
            <tr>
              <th className="p-3 text-start">Title</th>
              <th className="p-3 text-start">URL</th>
              <th className="p-3 text-start">Type</th>
              <th className="p-3 text-start">Status</th>
              <th className="p-3 text-start">Lang</th>
              <th className="p-3 text-start">Updated</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-muted">No posts yet. Write one, or run <code>npm run wp:import</code> to bring posts from WordPress.</td></tr>
            ) : null}
            {posts.map((p) => {
              const url = `${p.locale === "ar" ? "/ar" : ""}/${p.slug}/`;
              return (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="p-3"><Link href={`/admin/posts/${p.id}/`} className="font-semibold hover:underline">{p.title}</Link></td>
                  <td className="p-3 text-muted"><a href={url} target="_blank" className="hover:underline">{url}</a></td>
                  <td className="p-3 text-muted">{p.type === "DEVELOPER" ? "Developer page" : "Article"}</td>
                  <td className="p-3"><span className={p.status === "PUBLISHED" ? "text-wa-dark" : "text-muted"}>{p.status}</span></td>
                  <td className="p-3 uppercase">{p.locale}</td>
                  <td className="p-3 text-muted">{p.updatedAt.toLocaleDateString("en-GB")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
