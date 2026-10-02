"use client";

import { useState } from "react";

const input = "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm";

/** Uploads the file to /api/admin/upload/, then submits URL + ALT + caption to the server action. */
export function GalleryUploader({ action }: { action: (fd: FormData) => Promise<void> }) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload/", { method: "POST", body: fd });
      const j = (await r.json()) as { url?: string; error?: string };
      if (!r.ok || !j.url) throw new Error(j.error || "Upload failed");
      setUrl(j.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form action={async (fd) => { await action(fd); setUrl(""); }} className="grid gap-3 rounded-2xl border border-line bg-white p-5 md:grid-cols-4">
      <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">
        Photo (JPG/PNG/WebP, max 5 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-sm" />
        {busy ? <span className="font-normal text-muted">Uploading…</span> : null}
        {err ? <span className="font-normal text-snag">{err}</span> : null}
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">Image URL<input name="url" value={url} onChange={(e) => setUrl(e.target.value)} required className={input} /></label>
      <label className="flex flex-col gap-1 text-sm font-semibold md:col-span-2">ALT text (required, describe the photo)<input name="alt" required placeholder="Hollow floor tile found during apartment snagging" className={input} /></label>
      <label className="flex flex-col gap-1 text-sm font-semibold">Caption<input name="caption" className={input} /></label>
      <label className="flex flex-col gap-1 text-sm font-semibold">Category
        <select name="category" className={input}>
          <option value="defects">Defects</option>
          <option value="inspection">On site</option>
          <option value="equipment">Equipment</option>
          <option value="reporting">Reporting</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" /> Feature on homepage</label>
      <input type="hidden" name="sortOrder" value="0" />
      <button disabled={!url || busy} className="h-11 rounded-lg bg-ink px-4 text-sm font-semibold text-white disabled:opacity-50 md:col-start-4">Add photo</button>
    </form>
  );
}
