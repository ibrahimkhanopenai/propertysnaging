import { prisma } from "@/lib/db";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { deleteGalleryImageAction, saveGalleryImageAction } from "../../actions";

export const metadata = { title: "Gallery" };

/** Real inspection photos only (client rule). ALT text is required for SEO + accessibility. */
export default async function GalleryAdmin() {
  const rows = await prisma.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Gallery</h1>
        <p className="text-sm text-muted">Featured photos (max 8 shown) appear on the homepage. All photos appear on /gallery/. Use genuine inspection photos and descriptive ALT text (no keyword stuffing).</p>
      </div>
      <GalleryUploader action={saveGalleryImageAction} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((g) => (
          <li key={g.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.url} alt={g.alt} className="aspect-[4/5] w-full rounded-xl object-cover" />
            <p className="text-sm font-semibold">{g.alt}</p>
            <p className="text-xs text-muted">{g.category}{g.featured ? " · featured" : ""}{g.caption ? ` · ${g.caption}` : ""}</p>
            <div className="flex justify-between">
              <form action={saveGalleryImageAction}>
                <input type="hidden" name="id" value={g.id} />
                <input type="hidden" name="url" value={g.url} />
                <input type="hidden" name="alt" value={g.alt} />
                <input type="hidden" name="caption" value={g.caption ?? ""} />
                <input type="hidden" name="category" value={g.category} />
                <input type="hidden" name="sortOrder" value={g.sortOrder} />
                {g.featured ? null : <input type="hidden" name="featured" value="on" />}
                <button className="text-sm">{g.featured ? "Unfeature" : "Feature on homepage"}</button>
              </form>
              <form action={deleteGalleryImageAction}><input type="hidden" name="id" value={g.id} /><button className="text-sm text-snag">Delete</button></form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
