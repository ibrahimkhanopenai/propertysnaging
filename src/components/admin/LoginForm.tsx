"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Email
        <input name="email" type="email" autoComplete="username" required className="h-11 rounded-lg border border-zinc-300 px-3 font-normal" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Password
        <input name="password" type="password" autoComplete="current-password" required className="h-11 rounded-lg border border-zinc-300 px-3 font-normal" />
      </label>
      {state.error ? <p role="alert" className="text-sm text-snag">{state.error}</p> : null}
      <button disabled={pending} className="h-11 rounded-lg bg-ink font-semibold text-white disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
