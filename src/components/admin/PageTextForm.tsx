"use client";

import { useActionState, useState } from "react";
import { savePageTextAction, type PageTextState } from "@/app/admin/actions";
import type { PageTextFormValues } from "@/lib/page-text";
import type { PageSection } from "@/content/types";

const input = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm";
const label = "flex flex-col gap-1 text-xs font-semibold text-muted";

/** Editor rows: paragraphs separated by a blank line, bullets one per line. `uid` keeps React state per section while moving. */
type Draft = { uid: number; id?: string; title: string; paragraphs: string; bullets: string };
let nextUid = 1;
const toDrafts = (sections: PageSection[]): Draft[] =>
  sections.map((s) => ({ uid: nextUid++, id: s.id, title: s.title, paragraphs: (s.paragraphs ?? []).join("\n\n"), bullets: (s.bullets ?? []).join("\n") }));
const toSections = (drafts: Draft[]) =>
  drafts.map((d) => ({
    id: d.id,
    title: d.title,
    paragraphs: d.paragraphs.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean),
    bullets: d.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
  }));

function Badge({ changed }: { changed: boolean }) {
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${changed ? "bg-ink text-white" : "bg-mist text-muted"}`}>{changed ? "Changed" : "Default"}</span>;
}

/**
 * Admin → Page text for one page + language. Fields show the text the page uses now; saving text that
 * equals the content file stores nothing (the default). Fields are controlled, so a validation error keeps the edits.
 */
export function PageTextForm({ page, locale, isLocation, sectionsHelp, initial }: { page: string; locale: "en" | "ar"; isLocation: boolean; sectionsHelp: string; initial: PageTextFormValues }) {
  const [hook, setHook] = useState(initial.hook);
  const [intro, setIntro] = useState(initial.intro);
  const [drafts, setDrafts] = useState(() => toDrafts(initial.sections));
  const [changed, setChanged] = useState(initial.changed);
  const [state, action, pending] = useActionState<PageTextState, FormData>(async (prev, fd) => {
    const res = await savePageTextAction(prev, fd);
    if (res.values) {
      setHook(res.values.hook);
      setIntro(res.values.intro);
      setDrafts(toDrafts(res.values.sections));
      setChanged(res.values.changed);
    }
    return res;
  }, {});
  const dir = locale === "ar" ? "rtl" : "ltr";
  const anyChanged = changed.hook || changed.intro || changed.sections;

  const update = (uid: number, patch: Partial<Draft>) => setDrafts((ds) => ds.map((d) => (d.uid === uid ? { ...d, ...patch } : d)));
  const move = (i: number, by: number) =>
    setDrafts((ds) => {
      const next = [...ds];
      const [d] = next.splice(i, 1);
      next.splice(i + by, 0, d);
      return next;
    });

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="page" value={page} />
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sections" value={JSON.stringify(toSections(drafts))} />

      <fieldset className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
        <legend className="px-1 text-lg font-bold">Top of the page</legend>
        {isLocation ? (
          <label className={label}>
            <span className="flex items-center gap-2">Hook (the bold line under the H1) <Badge changed={changed.hook} /></span>
            <input name="hook" value={hook} onChange={(e) => setHook(e.target.value)} dir={dir} maxLength={300} className={input} />
          </label>
        ) : null}
        <label className={label}>
          <span className="flex items-center gap-2">Intro paragraph <Badge changed={changed.intro} /></span>
          <textarea name="intro" value={intro} onChange={(e) => setIntro(e.target.value)} dir={dir} maxLength={2000} rows={4} className={input} />
          <span className="font-normal text-subtle">Leave empty to use the default text. The H1, page title and meta description are fixed (SEO).</span>
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
        <legend className="flex items-center gap-2 px-1 text-lg font-bold">Sections <Badge changed={changed.sections} /></legend>
        <p className="-mt-2 text-sm text-muted">{sectionsHelp} Each heading is an H2. Paragraphs: leave a blank line between them. Bullet points: one per line.</p>
        <ol className="flex flex-col gap-3">
          {drafts.map((d, i) => (
            <li key={d.uid} className="flex flex-col gap-3 rounded-xl border border-line bg-mist/50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-subtle">Section {i + 1}</span>
                <span className="ms-auto flex gap-1">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up" className="h-8 rounded-lg border border-line bg-white px-2.5 text-sm disabled:opacity-40">↑</button>
                  <button type="button" disabled={i === drafts.length - 1} onClick={() => move(i, 1)} aria-label="Move down" className="h-8 rounded-lg border border-line bg-white px-2.5 text-sm disabled:opacity-40">↓</button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Remove the section “${d.title || i + 1}”? It disappears from the page when you save.`)) setDrafts((ds) => ds.filter((x) => x.uid !== d.uid));
                    }}
                    className="h-8 px-2 text-sm text-snag"
                  >
                    Remove
                  </button>
                </span>
              </div>
              <label className={label}>Heading *<input value={d.title} onChange={(e) => update(d.uid, { title: e.target.value })} dir={dir} required maxLength={200} className={input} /></label>
              <label className={label}>Paragraphs<textarea value={d.paragraphs} onChange={(e) => update(d.uid, { paragraphs: e.target.value })} dir={dir} rows={4} className={input} /></label>
              <label className={label}>Bullet points<textarea value={d.bullets} onChange={(e) => update(d.uid, { bullets: e.target.value })} dir={dir} rows={3} className={input} /></label>
            </li>
          ))}
        </ol>
        <button
          type="button"
          disabled={drafts.length >= 12}
          onClick={() => setDrafts((ds) => [...ds, { uid: nextUid++, title: "", paragraphs: "", bullets: "" }])}
          className="self-start rounded-lg border border-ink px-3 py-2 text-sm font-semibold hover:bg-ink hover:text-white disabled:opacity-40"
        >
          + Add a section
        </button>
      </fieldset>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-4 border-t border-line bg-paper/95 py-4 backdrop-blur">
        <button disabled={pending} className="h-11 rounded-lg bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving…" : "Save"}</button>
        {anyChanged ? (
          <button
            name="intent"
            value="reset"
            formNoValidate
            disabled={pending}
            onClick={(e) => {
              if (!window.confirm("Go back to the default text for this page and language?")) e.preventDefault();
            }}
            className="h-11 px-2 text-sm text-snag"
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
