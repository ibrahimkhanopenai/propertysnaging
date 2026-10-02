import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const [published, drafts, leads, leads7] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } } }),
  ]);
  const cards = [
    { label: "Published posts", value: published, href: "/admin/posts/" },
    { label: "Drafts", value: drafts, href: "/admin/posts/" },
    { label: "Leads (7 days)", value: leads7, href: "/admin/leads/" },
    { label: "Leads (total)", value: leads, href: "/admin/leads/" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-line bg-white p-5 hover:border-ink">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="text-3xl font-bold">{c.value}</p>
          </Link>
        ))}
      </div>
      <Link href="/admin/posts/new/" className="self-start rounded-xl bg-ink px-5 py-3 font-semibold text-white">Write a new post</Link>
    </div>
  );
}
