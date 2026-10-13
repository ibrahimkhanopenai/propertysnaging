"use client";

import { useState, useTransition } from "react";
import { deletePostAction, setPostPublishedAction } from "@/app/admin/actions";

/** Blog list controls: publish switch and delete button. Docs: docs/admin-cms.md */

const offlineWarning = "Its URL will show “page not found”. If it ranks on Google, add a 301 in Admin → Redirects.";

export function PublishToggle({ id, title, live, scheduledFor }: { id: number; title: string; live: boolean; scheduledFor?: string }) {
  const [on, setOn] = useState(live);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const change = (next: boolean) => {
    if (!next && !window.confirm(`Unpublish “${title}”?\n\nThe post goes back to Draft. ${offlineWarning}`)) return;
    setError("");
    setOn(next);
    start(async () => {
      const res = await setPostPublishedAction(id, next).catch(() => ({ ok: false, error: "Could not save. Try again." }));
      if (!res.ok) {
        setOn(!next);
        setError(res.error ?? "Could not save.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <label className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap ${pending ? "opacity-60" : ""}`}>
        <input type="checkbox" role="switch" className="peer sr-only" checked={on} disabled={pending} onChange={(e) => change(e.target.checked)} />
        <span className="relative h-5 w-9 rounded-full bg-zinc-300 transition-colors after:absolute after:start-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-wa-dark peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink rtl:peer-checked:after:-translate-x-4" />
        <span className={on ? "font-semibold text-wa-dark" : "text-muted"}>{pending ? "Saving…" : on ? (scheduledFor ? `Scheduled ${scheduledFor}` : "Published") : "Draft"}</span>
      </label>
      {error ? <span role="alert" className="text-xs text-snag">{error}</span> : null}
    </div>
  );
}

export function DeletePostButton({ id, title, live, className }: { id: number; title: string; live: boolean; className?: string }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(e) => {
        if (!window.confirm(`Delete “${title}” permanently?${live ? `\n\nThe post is live. ${offlineWarning}` : ""}`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className={className ?? "whitespace-nowrap rounded-lg border border-snag px-3 py-1.5 text-xs font-semibold text-snag hover:bg-red-50"}>Delete</button>
    </form>
  );
}
