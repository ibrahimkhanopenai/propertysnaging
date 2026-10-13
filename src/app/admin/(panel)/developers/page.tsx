import type { DeveloperLogo } from "@prisma/client";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { deleteDeveloperAction, loadDefaultDevelopersAction, saveDeveloperAction } from "../../actions";

export const metadata = { title: "Developer logos" };
const input = "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm";
const label = "flex flex-col gap-1 text-xs font-semibold text-muted";

/** Admin → Developer logos: the homepage logo strip ("We snag homes by the UAE's leading developers"). */
export default async function DevelopersAdmin() {
  const rows = await prisma.developerLogo.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  const nextOrder = (rows.at(-1)?.sortOrder ?? 0) + 1;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Developer logos</h1>
        <p className="max-w-3xl text-sm text-muted">
          The scrolling logo strip on the homepage, in this order. The strip has a black background: upload <b>white logos on a
          transparent PNG</b>. Only add developers whose projects we inspect. Changes go live as soon as you save.{" "}
          <a href="/#developers" target="_blank" className="font-semibold text-ink underline">View the homepage ↗</a>
        </p>
      </div>

      {/* Add */}
      <form action={saveDeveloperAction} className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-[14rem_minmax(0,1fr)]">
        <ImageUpload name="logo" required dark previewClass="h-28" />
        <div className="grid content-start gap-3 sm:grid-cols-2">
          <label className={label}>Developer name (English) *<input name="name" required maxLength={120} placeholder="e.g. Emaar" className={input} /></label>
          <label className={label}>Name (Arabic)<input name="nameAr" dir="rtl" maxLength={120} className={input} /></label>
          <label className={label}>Order<input type="number" name="sortOrder" defaultValue={nextOrder} className={input} /></label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm"><input type="checkbox" name="published" defaultChecked /> Show on site</label>
          <button className="h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white sm:col-start-2">Add logo</button>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-line p-5 text-sm">
          <p className="text-muted">Nothing saved yet — the homepage shows the {site.developers.length} default logos: {site.developers.map((d) => d.name).join(", ")}.</p>
          <form action={loadDefaultDevelopersAction}>
            <button className="rounded-lg border border-ink px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-white">Load the default logos to edit them</button>
          </form>
        </div>
      ) : (
        <p className="text-xs text-subtle">To hide a logo, untick “Show on site”. Deleting every logo brings back the default list.</p>
      )}

      <ul className="grid gap-4 xl:grid-cols-2">
        {rows.map((r) => (
          <li key={r.id}>
            <DeveloperRow row={r} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeveloperRow({ row: r }: { row: DeveloperLogo }) {
  return (
    <form
      action={saveDeveloperAction}
      className={`grid gap-4 rounded-2xl border p-4 sm:grid-cols-[11rem_minmax(0,1fr)] ${r.published ? "border-line bg-white" : "border-dashed border-line bg-mist/60"}`}
    >
      <input type="hidden" name="id" value={r.id} />
      <ImageUpload name="logo" defaultValue={r.logo} required dark previewClass="h-24" />
      <div className="grid content-start gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_5rem]">
        <label className={label}>English<input name="name" defaultValue={r.name} required maxLength={120} className={input} /></label>
        <label className={label}>Arabic<input name="nameAr" defaultValue={r.nameAr ?? ""} dir="rtl" maxLength={120} className={input} /></label>
        <label className={label}>Order<input type="number" name="sortOrder" defaultValue={r.sortOrder} className={input} /></label>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={r.published} /> Show on site</label>
          <button className="ms-auto h-9 rounded-lg bg-ink px-4 text-sm font-semibold text-white">Save</button>
          <button formAction={deleteDeveloperAction} formNoValidate className="h-9 px-2 text-sm text-snag">Delete</button>
        </div>
      </div>
    </form>
  );
}
