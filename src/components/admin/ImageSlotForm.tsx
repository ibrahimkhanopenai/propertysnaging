"use client";

import { useActionState, useState } from "react";
import { saveSiteImageAction, type ImageSlotState } from "@/app/admin/actions";
import type { SlotFormValues } from "@/lib/site-images";
import { ImageUpload } from "./ImageUpload";

const input = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm";

/**
 * One Admin → Images slot: photo + English/Arabic ALT. Fields are controlled, so a validation error
 * keeps what was typed; after a save or reset they show what the site now uses.
 */
export function ImageSlotForm({
  slotKey,
  label,
  where,
  defaults,
  initial,
}: {
  slotKey: string;
  label: string;
  where: string;
  /** Default photo + English ALT (to warn when a new photo still has the old ALT) */
  defaults: { src: string; alt: string };
  initial: SlotFormValues;
}) {
  const [url, setUrl] = useState(initial.url);
  const [alt, setAlt] = useState(initial.alt);
  const [altAr, setAltAr] = useState(initial.altAr);
  const [changed, setChanged] = useState(initial.changed);
  const [state, action, pending] = useActionState<ImageSlotState, FormData>(async (prev, fd) => {
    const res = await saveSiteImageAction(prev, fd);
    if (res.values) {
      setUrl(res.values.url);
      setAlt(res.values.alt);
      setAltAr(res.values.altAr);
      setChanged(res.values.changed);
    }
    return res;
  }, {});
  const newPhoto = url !== defaults.src;

  return (
    <form action={action} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4">
      <input type="hidden" name="key" value={slotKey} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold leading-snug">{label}</h3>
          <p className="text-xs text-muted">{where}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${changed ? "bg-ink text-white" : "bg-mist text-muted"}`}>{changed ? "Changed" : "Default"}</span>
      </div>

      <ImageUpload name="url" value={url} onChange={setUrl} />

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
        ALT text (English) *
        <textarea name="alt" value={alt} onChange={(e) => setAlt(e.target.value)} required maxLength={255} rows={2} className={input} />
        {newPhoto && alt === defaults.alt ? <span className="font-normal text-snag">This ALT describes the old photo. Describe the new one.</span> : null}
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
        ALT text (Arabic)
        <textarea name="altAr" value={altAr} onChange={(e) => setAltAr(e.target.value)} dir="rtl" maxLength={255} rows={2} className={input} />
        {newPhoto && !altAr ? <span className="font-normal text-subtle">Empty: the Arabic page uses the English ALT.</span> : null}
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button disabled={pending} className="h-9 rounded-lg bg-ink px-4 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving…" : "Save"}</button>
        {changed ? (
          <button
            name="intent"
            value="reset"
            formNoValidate
            disabled={pending}
            onClick={(e) => {
              if (!window.confirm("Go back to the default photo and ALT text?")) e.preventDefault();
            }}
            className="h-9 px-2 text-sm text-snag"
          >
            Reset to default
          </button>
        ) : null}
        {state.error ? <p role="alert" className="text-sm text-snag">{state.error}</p> : null}
        {state.saved && !pending ? <p className="text-sm text-wa-dark">Saved — live on the site.</p> : null}
      </div>
    </form>
  );
}
