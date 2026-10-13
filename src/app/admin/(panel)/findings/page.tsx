import type { Finding } from "@prisma/client";
import { prisma } from "@/lib/db";
import { defaultFindings } from "@/lib/findings";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SortableList } from "@/components/admin/SortableList";
import { deleteFindingAction, loadDefaultFindingsAction, reorderFindingsAction, saveFindingAction } from "../../actions";

export const metadata = { title: "Defects we find" };
const input = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm";
const label = "flex flex-col gap-1 text-xs font-semibold text-muted";

/** Admin → Defects we find: the homepage "Real findings" section (photo, category, defect, recommendation; EN/AR). */
export default async function FindingsAdmin() {
  const rows = await prisma.finding.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
  const defaults = rows.length ? [] : await defaultFindings("en");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Defects we find</h1>
        <p className="max-w-3xl text-sm text-muted">
          The homepage section “Defects we find — and what we recommend”: one featured photo with a list of findings next to it.
          Use real defects from our reports (no client personal data in the photos). Changes go live as soon as you save.
          A finding without Arabic category, defect and recommendation is not shown on the Arabic page.{" "}
          <a href="/" target="_blank" className="font-semibold text-ink underline">View the homepage ↗</a>
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-line bg-white p-5 text-sm">
          <p className="text-muted">
            Nothing saved yet — the homepage shows these {defaults.length} findings from the code, with the photos from Admin → Images →
            “Defects we find”. Load them to edit, reorder, hide or add findings (each finding then has its own photo):
          </p>
          <ol className="list-decimal ps-5 text-muted">
            {defaults.map((f) => (
              <li key={f.defect}>
                <b className="text-ink">{f.category}:</b> {f.defect}
              </li>
            ))}
          </ol>
          <form action={loadDefaultFindingsAction}>
            <button className="rounded-lg border border-ink px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-white">Load these findings to edit them</button>
          </form>
        </div>
      ) : (
        <>
          {/* Add */}
          <form action={saveFindingAction} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Add a finding</h2>
            <FindingFields />
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked /> Show on site</label>
              <button className="ms-auto h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white">Add to the end</button>
            </div>
          </form>
          <p className="text-xs text-subtle">
            The first finding is featured when the page opens. To hide a finding, untick “Show on site”. Deleting every finding brings back the list from the code.
          </p>
        </>
      )}

      <SortableList
        onReorder={reorderFindingsAction}
        items={rows.map((r) => ({ id: r.id, label: r.defect, node: <FindingRow row={r} /> }))}
      />
    </div>
  );
}

function FindingFields({ row }: { row?: Finding }) {
  return (
    <div className="grid gap-4 md:grid-cols-[13rem_minmax(0,1fr)]">
      <div className="flex flex-col gap-2">
        <ImageUpload name="photo" defaultValue={row?.photo} required />
      </div>
      <div className="grid content-start gap-3 lg:grid-cols-2">
        <label className={label}>Category (English) *<input name="category" defaultValue={row?.category} required maxLength={80} placeholder="e.g. Plumbing" className={input} /></label>
        <label className={label}>Category (Arabic)<input name="categoryAr" defaultValue={row?.categoryAr ?? ""} dir="rtl" maxLength={80} className={input} /></label>
        <label className={label}>Defect identified (English) *<textarea name="defect" defaultValue={row?.defect} required maxLength={500} rows={2} className={input} /></label>
        <label className={label}>Defect identified (Arabic)<textarea name="defectAr" defaultValue={row?.defectAr ?? ""} dir="rtl" maxLength={500} rows={2} className={input} /></label>
        <label className={label}>Recommendation (English) *<textarea name="fix" defaultValue={row?.fix} required maxLength={500} rows={2} className={input} /></label>
        <label className={label}>Recommendation (Arabic)<textarea name="fixAr" defaultValue={row?.fixAr ?? ""} dir="rtl" maxLength={500} rows={2} className={input} /></label>
        <label className={label}>
          Photo ALT text (English) *
          <input name="alt" defaultValue={row?.alt} required maxLength={255} className={input} />
          <span className="font-normal text-subtle">Describe what the photo shows. Update it when you replace the photo.</span>
        </label>
        <label className={label}>
          Photo ALT text (Arabic)
          <input name="altAr" defaultValue={row?.altAr ?? ""} dir="rtl" maxLength={255} className={input} />
          <span className="font-normal text-subtle">Empty: the Arabic page uses the English ALT.</span>
        </label>
      </div>
    </div>
  );
}

function FindingRow({ row: r }: { row: Finding }) {
  const noArabic = !r.categoryAr || !r.defectAr || !r.fixAr;
  return (
    <form action={saveFindingAction} className={`flex flex-col gap-3 rounded-2xl border p-4 ${r.published ? "border-line bg-white" : "border-dashed border-line bg-mist/60"}`}>
      <input type="hidden" name="id" value={r.id} />
      <FindingFields row={r} />
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={r.published} /> Show on site</label>
        {noArabic ? <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-muted">Not on the Arabic page (no Arabic text)</span> : null}
        <button className="ms-auto h-9 rounded-lg bg-ink px-4 text-sm font-semibold text-white">Save</button>
        <button formAction={deleteFindingAction} formNoValidate className="h-9 px-2 text-sm text-snag">Delete</button>
      </div>
    </form>
  );
}
