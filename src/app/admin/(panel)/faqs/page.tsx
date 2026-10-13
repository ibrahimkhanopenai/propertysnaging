import Link from "next/link";
import type { FaqItem } from "@prisma/client";
import { prisma } from "@/lib/db";
import { defaultFaqs, faqPages } from "@/lib/faqs";
import { SortableList } from "@/components/admin/SortableList";
import { deleteFaqAction, loadDefaultFaqsAction, reorderFaqsAction, saveFaqAction } from "../../actions";

export const metadata = { title: "FAQs" };
const input = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm";
const label = "flex flex-col gap-1 text-xs font-semibold text-muted";
const groups = [
  { key: "home", title: "Homepage" },
  { key: "service", title: "Service pages" },
  { key: "location", title: "Location pages" },
] as const;

/** Admin → FAQs: the FAQ list of the homepage and of each service / location page. */
export default async function FaqsAdmin({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { p } = await searchParams;
  const current = faqPages.find((x) => x.key === p) ?? faqPages[0];
  const [rows, counts] = await Promise.all([
    prisma.faqItem.findMany({ where: { page: current.key }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    prisma.faqItem.groupBy({ by: ["page"], _count: { _all: true } }),
  ]);
  const custom = new Set(counts.map((c) => c.page));
  const defaults = defaultFaqs(current.key, "en");
  const onFaqsPage = current.group !== "location";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">FAQs</h1>
        <p className="max-w-3xl text-sm text-muted">
          Questions and answers shown on each page (and in Google&apos;s FAQ data). Changes go live as soon as you save. Write the
          Arabic version too: a FAQ without an Arabic question and answer is not shown on the Arabic page.
        </p>
      </div>

      <nav className="flex flex-col gap-3">
        {groups.map((g) => (
          <div key={g.key} className="flex flex-wrap items-center gap-2">
            <span className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wide text-subtle">{g.title}</span>
            {faqPages
              .filter((x) => x.group === g.key)
              .map((x) => (
                <Link
                  key={x.key}
                  href={`/admin/faqs/?p=${x.key}`}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${x.key === current.key ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
                >
                  {x.label}
                  {custom.has(x.key) ? <span className="ms-1.5 text-[10px] uppercase opacity-70">edited</span> : null}
                </Link>
              ))}
          </div>
        ))}
      </nav>

      <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
        <div>
          <h2 className="text-lg font-bold">{current.label}</h2>
          <p className="text-sm text-muted">
            <a href={current.path} target="_blank" className="font-semibold text-ink underline">View the page ↗</a>
            {onFaqsPage ? <> · also listed on <a href="/faqs/" target="_blank" className="font-semibold text-ink underline">/faqs/ ↗</a></> : null}
          </p>
        </div>

        {rows.length === 0 && defaults.length ? (
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-line p-4 text-sm">
            <p className="text-muted">Nothing saved yet — the page shows these {defaults.length} FAQs from the code. Load them to edit, reorder, hide or add FAQs:</p>
            <ol className="list-decimal ps-5 text-muted">
              {defaults.map((f) => (
                <li key={f.q}>{f.q}</li>
              ))}
            </ol>
            <form action={loadDefaultFaqsAction}>
              <input type="hidden" name="page" value={current.key} />
              <button className="rounded-lg border border-ink px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-white">Load these FAQs to edit them</button>
            </form>
          </div>
        ) : (
          <>
            {/* Add */}
            <form action={saveFaqAction} className="grid gap-3 rounded-xl bg-mist p-4 lg:grid-cols-2">
              <input type="hidden" name="page" value={current.key} />
              <FaqFields />
              <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked /> Show on site</label>
                <button className="ms-auto h-10 rounded-lg bg-ink px-4 text-sm font-semibold text-white">Add to the end</button>
              </div>
            </form>
            {rows.length ? (
              <p className="text-xs text-subtle">To hide a FAQ, untick “Show on site”. Deleting every FAQ brings back the list from the code.</p>
            ) : (
              <p className="text-sm text-muted">This page has no FAQs yet.</p>
            )}
          </>
        )}

        {/* Existing rows — each is its own edit form; order = drag (SortableList) */}
        <SortableList
          onReorder={reorderFaqsAction}
          items={rows.map((r) => ({ id: r.id, label: r.question, node: <FaqRow row={r} /> }))}
        />
      </section>
    </div>
  );
}

function FaqFields({ row }: { row?: FaqItem }) {
  return (
    <>
      <label className={label}>Question (English) *<input name="question" defaultValue={row?.question} required maxLength={500} className={input} /></label>
      <label className={label}>Question (Arabic)<input name="questionAr" defaultValue={row?.questionAr ?? ""} dir="rtl" maxLength={500} className={input} /></label>
      <label className={label}>Answer (English) *<textarea name="answer" defaultValue={row?.answer} required maxLength={5000} rows={4} className={input} /></label>
      <label className={label}>Answer (Arabic)<textarea name="answerAr" defaultValue={row?.answerAr ?? ""} dir="rtl" maxLength={5000} rows={4} className={input} /></label>
    </>
  );
}

function FaqRow({ row: r }: { row: FaqItem }) {
  const noArabic = !r.questionAr || !r.answerAr;
  return (
    <form action={saveFaqAction} className={`grid gap-3 rounded-xl border p-3 lg:grid-cols-2 ${r.published ? "border-line bg-white" : "border-dashed border-line bg-mist/60"}`}>
      <input type="hidden" name="id" value={r.id} />
      <input type="hidden" name="page" value={r.page} />
      <FaqFields row={r} />
      <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={r.published} /> Show on site</label>
        {noArabic ? <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-muted">Not on the Arabic page (no Arabic text)</span> : null}
        <button className="ms-auto h-9 rounded-lg bg-ink px-4 text-sm font-semibold text-white">Save</button>
        <button formAction={deleteFaqAction} formNoValidate className="h-9 px-2 text-sm text-snag">Delete</button>
      </div>
    </form>
  );
}
