import { prisma } from "@/lib/db";
import { createRedirectAction, deleteRedirectAction } from "../../actions";

export const metadata = { title: "Redirects" };

const input = "h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm";

export default async function RedirectsPage() {
  const rows = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Redirects</h1>
        <p className="text-sm text-muted">Used when a URL has no page. Slug changes on live posts add a 301 here automatically.</p>
      </div>
      <form action={createRedirectAction} className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-4">
        <label className="flex flex-col gap-1 text-sm">From path<input name="fromPath" required placeholder="/old-post-slug/" className={input} /></label>
        <label className="flex flex-col gap-1 text-sm">To path or URL<input name="toPath" required placeholder="/new-post-slug/" className={input} /></label>
        <label className="flex flex-col gap-1 text-sm">Type
          <select name="statusCode" className={input}><option value="301">301 permanent</option><option value="302">302 temporary</option></select>
        </label>
        <button className="h-11 rounded-lg bg-ink px-4 text-sm font-semibold text-white">Add redirect</button>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-line text-muted"><tr><th className="p-3 text-start">From</th><th className="p-3 text-start">To</th><th className="p-3 text-start">Code</th><th /></tr></thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={4} className="p-6 text-muted">No redirects.</td></tr> : null}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="p-3">{r.fromPath}</td><td className="p-3">{r.toPath}</td><td className="p-3">{r.statusCode}</td>
                <td className="p-3"><form action={deleteRedirectAction}><input type="hidden" name="id" value={r.id} /><button className="text-snag">Delete</button></form></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
