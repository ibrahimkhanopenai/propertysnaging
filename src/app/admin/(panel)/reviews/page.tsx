import { prisma } from "@/lib/db";
import { deleteReviewAction, saveReviewAction } from "../../actions";

export const metadata = { title: "Reviews" };
const input = "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm";

/** Client rule: only GENUINE reviews (copy them from Google/WhatsApp with permission). */
export default async function ReviewsAdmin() {
  const rows = await prisma.review.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-sm text-muted">Shown in the homepage scrolling strip and on /reviews/. Add genuine reviews only.</p>
      </div>
      <form action={saveReviewAction} className="grid gap-3 rounded-2xl border border-line bg-white p-5 md:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm font-semibold">Name<input name="name" required className={input} /></label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Location<input name="location" placeholder="Dubai Hills" className={input} /></label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Rating<select name="rating" defaultValue="5" className={input}>{[5, 4, 3, 2, 1].map((n) => <option key={n}>{n}</option>)}</select></label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Source<select name="source" className={input}><option value="google">Google</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option></select></label>
        <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-4">Review text<textarea name="text" required rows={3} className={`${input} h-auto py-2`} /></label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Review date<input type="date" name="reviewDate" className={input} /></label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Sort order<input type="number" name="sortOrder" defaultValue={0} className={input} /></label>
        <label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" name="published" defaultChecked /> Published</label>
        <button className="h-11 self-end rounded-lg bg-ink px-4 text-sm font-semibold text-white">Add review</button>
      </form>
      <ul className="grid gap-3 md:grid-cols-2">
        {rows.length === 0 ? <li className="text-muted">No reviews yet — placeholders are shown on the site until you add some.</li> : null}
        {rows.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{r.name} <span className="font-normal text-muted">· {r.location ?? "-"} · {"★".repeat(r.rating)}</span></p>
              <span className={`text-xs ${r.published ? "text-wa-dark" : "text-muted"}`}>{r.published ? "Published" : "Hidden"}</span>
            </div>
            <p className="text-sm text-muted">{r.text}</p>
            <form action={deleteReviewAction} className="self-end"><input type="hidden" name="id" value={r.id} /><button className="text-sm text-snag">Delete</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
