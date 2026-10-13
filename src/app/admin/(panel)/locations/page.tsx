import Link from "next/link";
import type { LocationItem } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getPageContent } from "@/content/pages";
import { defaultAreas, isLocationKey } from "@/content/location-defaults";
import { staticRoutes } from "@/lib/routes";
import { deleteLocationItemAction, loadLocationDefaultsAction, saveLocationItemAction } from "../../actions";

export const metadata = { title: "Locations" };
const input = "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm";
const label = "flex flex-col gap-1 text-xs font-semibold text-muted";
const emirates = staticRoutes.filter((r) => r.group === "location");

/** Admin → Locations: per emirate, the "Communities we inspect" list (left on the page) and "Areas we cover" (right). */
export default async function LocationsAdmin({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  const current = emirates.find((r) => r.key === e) ?? emirates[0];
  const key = current.key;
  const city = getPageContent(key, "en").navLabel ?? key;
  const rows = await prisma.locationItem.findMany({ where: { emirate: key }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Locations</h1>
        <p className="text-sm text-muted">
          Lists shown on each location page. Changes go live as soon as you save.{" "}
          <a href={current.path} target="_blank" className="font-semibold text-ink underline">View the {city} page ↗</a>
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {emirates.map((r) => (
          <Link
            key={r.key}
            href={`/admin/locations/?e=${r.key}`}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${r.key === key ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
          >
            {getPageContent(r.key, "en").navLabel ?? r.key}
          </Link>
        ))}
      </nav>

      <div className="grid gap-6 xl:grid-cols-2">
        <ItemList
          emirate={key}
          kind="COMMUNITY"
          title={`Communities we inspect in ${city}`}
          help="Projects / developments. Shown left of the areas list. Hidden on the site while this list is empty."
          rows={rows.filter((r) => r.kind === "COMMUNITY")}
        />
        <ItemList
          emirate={key}
          kind="AREA"
          title={`Areas we cover in ${city}`}
          help="Area chips. While this list is empty the site shows the default list below."
          rows={rows.filter((r) => r.kind === "AREA")}
          fallback={isLocationKey(key) ? defaultAreas(key).map((a) => a.name) : []}
        />
      </div>
    </div>
  );
}

function ItemList({ emirate, kind, title, help, rows, fallback }: { emirate: string; kind: "AREA" | "COMMUNITY"; title: string; help: string; rows: LocationItem[]; fallback?: string[] }) {
  const nextOrder = (rows.at(-1)?.sortOrder ?? 0) + 1;
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm text-muted">{help}</p>
      </div>

      {/* Add */}
      <form action={saveLocationItemAction} className="grid gap-3 rounded-xl bg-mist p-4 sm:grid-cols-2">
        <input type="hidden" name="emirate" value={emirate} />
        <input type="hidden" name="kind" value={kind} />
        <label className={label}>Name (English) *<input name="name" required maxLength={160} className={input} /></label>
        <label className={label}>Name (Arabic)<input name="nameAr" dir="rtl" maxLength={160} className={input} /></label>
        {kind === "COMMUNITY" ? <label className={label}>Developer<input name="developer" placeholder="e.g. Emaar" maxLength={120} className={input} /></label> : null}
        <label className={label}>Order<input type="number" name="sortOrder" defaultValue={nextOrder} className={input} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked /> Show on site</label>
        <button className="h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white sm:col-start-2">Add</button>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-line p-4 text-sm">
          {fallback?.length ? (
            <p className="text-muted">Nothing saved yet — the site shows the default list: {fallback.join(", ")}.</p>
          ) : (
            <p className="text-muted">Nothing saved yet.</p>
          )}
          <form action={loadLocationDefaultsAction}>
            <input type="hidden" name="emirate" value={emirate} />
            <input type="hidden" name="kind" value={kind} />
            <button className="rounded-lg border border-ink px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-white">
              {kind === "AREA" ? "Load the default list to edit it" : "Load suggested communities"}
            </button>
          </form>
        </div>
      ) : null}

      {/* Existing rows — each is its own edit form */}
      <ul className="flex flex-col gap-2">
        {rows.map((r) => (
          <li key={r.id}>
            <form action={saveLocationItemAction} className={`grid items-end gap-2 rounded-xl border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_5rem] ${r.published ? "border-line" : "border-dashed border-line bg-mist/60"}`}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="emirate" value={emirate} />
              <input type="hidden" name="kind" value={kind} />
              <label className={label}>English<input name="name" defaultValue={r.name} required maxLength={160} className={input} /></label>
              <label className={label}>Arabic<input name="nameAr" defaultValue={r.nameAr ?? ""} dir="rtl" maxLength={160} className={input} /></label>
              <label className={label}>Order<input type="number" name="sortOrder" defaultValue={r.sortOrder} className={input} /></label>
              {kind === "COMMUNITY" ? <label className={`${label} sm:col-span-2`}>Developer<input name="developer" defaultValue={r.developer ?? ""} maxLength={120} className={input} /></label> : null}
              <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={r.published} /> Show on site</label>
                <button className="ms-auto h-9 rounded-lg bg-ink px-4 text-sm font-semibold text-white">Save</button>
                <button formAction={deleteLocationItemAction} className="h-9 px-2 text-sm text-snag">Delete</button>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
