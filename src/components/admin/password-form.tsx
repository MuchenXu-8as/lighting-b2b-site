"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";

import { ActionState, updatePasswordAction } from "@/app/admin/actions";

const initialState: ActionState = {};

export function PasswordForm() {
  const [state, action, pending] = useActionState(
    updatePasswordAction,
    initialState,
  );

  return (
    <form action={action} className="border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold">修改管理员密码</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700">
          新密码
          <input
            required
            minLength={8}
            type="password"
            name="password"
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700">
          确认新密码
          <input
            required
            minLength={8}
            type="password"
            name="confirm_password"
            className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
          />
        </label>
      </div>
      {state.message ? (
        <p
          className={`mt-3 text-sm ${
            state.ok ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="focus-ring mt-5 inline-flex h-10 items-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60"
      >
        <KeyRound size={16} />
        {pending ? "保存中..." : "更新密码"}
      </button>
    </form>
  );
}
