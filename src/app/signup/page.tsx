"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction } from "@/app/actions/authActions";
import Button from "@/app/components/Button";
import ErrorMessage from "@/app/components/ErrorMessage";

type State =
  | { ok: true; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> }
  | undefined;

export default function SignupPage() {
  const [state, action, pending] = useActionState<State, FormData>(
    signupAction,
    undefined,
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">
          新規登録
        </h1>
        <form action={action} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              名前（任意）
            </label>
            <input
              id="name"
              name="name"
              type="text"
              disabled={pending}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
              placeholder="お名前を入力"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              disabled={pending}
              required
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
              placeholder="email@example.com"
            />
            {state?.ok === false && state.fieldErrors?.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              disabled={pending}
              required
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
              placeholder="パスワードを入力（8文字以上）"
            />
            {state?.ok === false && state.fieldErrors?.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>
          {state?.ok === false && state.message && (
            <ErrorMessage message={state.message} />
          )}
          <Button type="submit" fullWidth disabled={pending}>
            {pending ? "登録中..." : "登録してログイン"}
          </Button>
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/login"
              className="text-zinc-900 dark:text-zinc-50 hover:underline"
            >
              既にアカウントをお持ちの方はこちら
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
