import { findAllBooks } from "@/app/actions/bookActions";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardPage() {
  const books = await findAllBooks();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
              書籍一覧
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              登録されている書籍の一覧です
            </p>
          </div>
          <Link
            href="/dashboard/books/create"
            className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            ➕ 新規登録
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-4">
              まだ書籍が登録されていません
            </p>
            <Link
              href="/dashboard/books/create"
              className="inline-block px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              最初の書籍を登録する
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/dashboard/books/${book.id}`}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative w-full h-48 bg-zinc-200 dark:bg-zinc-800">
                  <Image
                    src={book.imageUrl || "/image/no-image.png"}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-black dark:text-zinc-50 mb-2 line-clamp-2">
                    {book.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    著者: {book.author}
                  </p>
                  <div className="text-sm text-zinc-500 dark:text-zinc-500 space-y-1">
                    <p>
                      出版日:{" "}
                      {new Date(book.publishedAt).toLocaleDateString("ja-JP")}
                    </p>
                    <p>
                      登録日:{" "}
                      {new Date(book.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                    <p className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          book.isAvailable
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                        }`}
                      >
                        {book.isAvailable ? "貸出可能" : "貸出中"}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
