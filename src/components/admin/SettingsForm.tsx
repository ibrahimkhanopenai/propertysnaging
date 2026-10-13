"use client";

import { useActionState } from "react";
import { saveSettingsAction, type SettingsState } from "@/app/admin/actions";
import { settingGroups } from "@/lib/settings-fields";

const input = "h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm";

/** Admin → Settings form. `values` = current values (saved or default), keyed by setting key. */
export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(saveSettingsAction, {});
  return (
    <form action={action} className="flex flex-col gap-6">
      {settingGroups.map((g) => (
        <fieldset key={g.title} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
          <legend className="px-1 text-lg font-bold">{g.title}</legend>
          {g.text ? <p className="-mt-2 text-sm text-muted">{g.text}</p> : null}
          <div className="grid gap-4 md:grid-cols-2">
            {g.fields.map((f) => (
              <label key={f.key} className="flex flex-col gap-1 text-sm font-semibold">
                {f.label}
                <input
                  name={f.key}
                  defaultValue={values[f.key]}
                  type={f.type === "email" ? "email" : "text"}
                  dir={f.type === "text" ? "auto" : "ltr"}
                  maxLength={f.max ?? 1000}
                  className={input}
                />
                <span className="break-all text-xs font-normal text-subtle">
                  {f.help ? `${f.help} · ` : ""}Leave empty to use the default: {f.defaultValue}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-4 border-t border-line bg-paper/95 py-4 backdrop-blur">
        <button disabled={pending} className="h-11 rounded-lg bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60">
          {pending ? "Saving…" : "Save settings"}
        </button>
        {state.error ? <p role="alert" className="text-sm text-snag">{state.error}</p> : null}
        {state.saved && !pending ? <p className="text-sm text-wa-dark">Saved — the site is updated.</p> : null}
      </div>
    </form>
  );
}
