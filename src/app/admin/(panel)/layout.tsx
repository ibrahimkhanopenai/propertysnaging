import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin/", label: "Dashboard" },
  { href: "/admin/posts/", label: "Blog posts" },
  { href: "/admin/posts/new/", label: "New post" },
  { href: "/admin/leads/", label: "Leads" },
  { href: "/admin/reviews/", label: "Reviews" },
  { href: "/admin/gallery/", label: "Gallery" },
  { href: "/admin/redirects/", label: "Redirects" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login/");
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-line bg-white md:w-60 md:border-b-0 md:border-e">
        <div className="p-5 font-bold">Property Inspectors</div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm hover:bg-mist">
              {l.label}
            </Link>
          ))}
          <a href="/" target="_blank" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted hover:bg-mist">View site ↗</a>
        </nav>
        <form action={logoutAction} className="p-3">
          <p className="mb-2 truncate px-3 text-xs text-subtle">{session.email}</p>
          <button className="w-full rounded-lg px-3 py-2 text-start text-sm text-snag hover:bg-mist">Sign out</button>
        </form>
      </aside>
      <main className="flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
