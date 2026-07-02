"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";

import { ActionState, loginAction } from "@/app/admin/actions";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="border border-zinc-200 bg-white p-6">
      <h1 className="text-2xl font-semibold text-zinc-950">后台登录</h1>
      <p className="mt-2 text-sm text-zinc-500">
        使用 Supabase Auth 中的管理员账号登录。
      </p>

      {state.message ? (
        <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </div>
      ) : null}

      <label className="mt-6 block text-sm font-medium text-zinc-700">
        邮箱
        <input
          required
          type="email"
          name="email"
          className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
        />
      </label>
      <label className="mt-4 block text-sm font-medium text-zinc-700">
        密码
        <input
          required
          type="password"
          name="password"
          className="focus-ring mt-2 h-11 w-full border border-zinc-300 px-3"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="focus-ring mt-6 inline-flex h-11 w-full items-center justify-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn size={16} />
        {pending ? "登录中..." : "登录"}
      </button>
    </form>
  );
}
