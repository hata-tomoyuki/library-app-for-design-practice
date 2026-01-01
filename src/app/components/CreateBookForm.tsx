"use client";

import { useState, useTransition } from "react";
import { createBook } from "../actions/bookActions";
import { CreateResponseDto } from "@/server/application/dtos/book/createResponseDto";

export default function CreateBookForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<CreateResponseDto | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const title = formData.get("title") as string;
        const author = formData.get("author") as string;
        const publishedAtStr = formData.get("publishedAt") as string;

        if (!title || !author || !publishedAtStr) {
          setError("すべてのフィールドを入力してください");
          return;
        }

        const publishedAt = new Date(publishedAtStr);
        if (isNaN(publishedAt.getTime())) {
          setError("有効な日付を入力してください");
          return;
        }

        const result = await createBook({
          title,
          author,
          publishedAt,
        });

        setSuccess(result);
        // フォームをリセット
        const form = document.getElementById("book-form") as HTMLFormElement;
        form?.reset();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "書籍の作成に失敗しました",
        );
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">
        書籍を登録
      </h2>

      <form id="book-form" action={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
            placeholder="書籍のタイトルを入力"
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            著者
          </label>
          <input
            type="text"
            id="author"
            name="author"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
            placeholder="著者名を入力"
          />
        </div>

        <div>
          <label
            htmlFor="publishedAt"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            出版日
          </label>
          <input
            type="date"
            id="publishedAt"
            name="publishedAt"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              書籍が正常に登録されました！
            </p>
            <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
              <p>ID: {success.id}</p>
              <p>タイトル: {success.title}</p>
              <p>著者: {success.author}</p>
              <p>
                出版日:{" "}
                {new Date(success.publishedAt).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "登録中..." : "書籍を登録"}
        </button>
      </form>
    </div>
  );
}
