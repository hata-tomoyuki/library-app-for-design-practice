import { findBookById } from "@/app/actions/bookActions";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  let book;
  try {
    book = await findBookById(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-6 transition-colors"
        >
          ← 書籍一覧に戻る
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-6">
            {book.title}
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                著者
              </h2>
              <p className="text-lg text-zinc-900 dark:text-zinc-50">
                {book.author}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                出版日
              </h2>
              <p className="text-lg text-zinc-900 dark:text-zinc-50">
                {new Date(book.publishedAt).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    登録日
                  </h2>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {new Date(book.createdAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    更新日
                  </h2>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {new Date(book.updatedAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                >
                  一覧に戻る
                </Link>
                <Link
                  href="/dashboard/create"
                  className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  新規登録
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
