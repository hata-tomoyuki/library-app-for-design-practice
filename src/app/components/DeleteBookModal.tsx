"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteBook } from "../actions/bookActions";
import { FindByIdResponseDto } from "@/server/application/dtos/book/findByIdResponseDto";

interface DeleteBookModalProps {
  book: FindByIdResponseDto;
}

export default function DeleteBookModal({ book }: DeleteBookModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const requiredText = book.title;
  const isConfirmed = confirmationText === requiredText;

  const handleCancel = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setError(null);
    setIsDeleting(true);

    startTransition(async () => {
      try {
        await deleteBook(book.id);
        // 削除成功後、一覧ページにリダイレクト
        router.push("/dashboard");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "書籍の削除に失敗しました",
        );
        setIsDeleting(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-zinc-900 rounded-lg shadow-xl">
        {/* 閉じるボタン */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          disabled={isPending || isDeleting}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-8">
          {/* 警告アイコンとタイトル */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
                書籍を削除
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                この操作は取り消せません。書籍を削除すると、すべての情報が永久に削除されます。
              </p>
            </div>
          </div>

          {/* 削除対象の詳細情報 */}
          <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
              削除対象の書籍情報
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  タイトル:
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {book.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">著者:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {book.author}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  出版日:
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {new Date(book.publishedAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  登録日:
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {new Date(book.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          </div>

          {/* 注意文 */}
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>注意:</strong>{" "}
              この書籍を削除すると、関連するすべてのデータが失われます。
              この操作は元に戻すことができません。
            </p>
          </div>

          {/* 確認入力 */}
          <div className="mb-6">
            <label
              htmlFor="confirmation"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              削除を確認するには、書籍のタイトル「
              <span className="font-bold text-zinc-900 dark:text-zinc-50">
                {requiredText}
              </span>
              」を入力してください:
            </label>
            <input
              type="text"
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              disabled={isPending || isDeleting}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              placeholder={requiredText}
            />
            {confirmationText && !isConfirmed && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                タイトルが一致しません
              </p>
            )}
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending || isDeleting}
              className="flex-1 px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!isConfirmed || isPending || isDeleting}
              className="flex-1 px-6 py-3 bg-red-600 dark:bg-red-700 text-white font-medium rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "削除中..." : "削除する"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
