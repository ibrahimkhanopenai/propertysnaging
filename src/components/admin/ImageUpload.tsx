"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Image picker for admin forms: uploads to /api/admin/upload/ and submits the returned URL as `name`.
 * Uncontrolled (defaultValue) inside server-action forms: follows the form's reset after a save.
 * Controlled when `value` + `onChange` are passed. `dark` = preview on black (white logos).
 */
export function ImageUpload({
  name,
  defaultValue = "",
  value,
  onChange,
  dark,
  required,
  previewClass = "aspect-[4/3]",
}: {
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (url: string) => void;
  dark?: boolean;
  required?: boolean;
  previewClass?: string;
}) {
  // null = follow defaultValue (so a form reset after revalidation shows the saved image)
  const [inner, setInner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const controlled = value !== undefined;
  const url = controlled ? value : (inner ?? defaultValue);
  const set = (v: string) => (controlled ? onChange?.(v) : setInner(v));

  useEffect(() => {
    const form = ref.current?.form;
    if (controlled || !form) return;
    const onReset = () => setInner(null);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [controlled]);

  async function upload(file: File) {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload/", { method: "POST", body: fd });
      const j = (await r.json()) as { url?: string; error?: string };
      if (!r.ok || !j.url) throw new Error(j.error || "Upload failed");
      set(j.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-line ${dark ? "bg-ink p-4" : "bg-mist"} ${previewClass}`}>
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className={dark ? "max-h-full max-w-full object-contain" : "size-full object-cover"} />
        ) : (
          <span className={`text-xs ${dark ? "text-zinc-400" : "text-muted"}`}>No image yet</span>
        )}
        {busy ? <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold">Uploading…</span> : null}
        {/* Carries the URL; a text input (not hidden) so `required` blocks saving without an image */}
        <input
          ref={ref}
          name={name}
          value={url}
          onChange={() => {}}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0"
        />
      </div>
      <label className="flex cursor-pointer flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-muted">
        <span className="rounded-lg border border-ink px-3 py-1.5 text-ink hover:bg-ink hover:text-white">{url ? "Replace" : "Upload"}</span>
        <span className="font-normal">JPG, PNG, WebP or AVIF, max 5 MB</span>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = ""; // allow picking the same file again
            if (f) void upload(f);
          }}
        />
      </label>
      {err ? <p role="alert" className="text-xs text-snag">{err}</p> : null}
      {url ? <p className="break-all text-[11px] text-subtle">{url}</p> : null}
    </div>
  );
}
