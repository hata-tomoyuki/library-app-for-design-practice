import { findBookById } from "@/app/actions/bookActions";
import UpdateBookForm from "@/app/components/UpdateBookForm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;

  let book;
  try {
    book = await findBookById(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/dashboard/${id}`}
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-6 transition-colors"
        >
          ← 書籍詳細に戻る
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
            書籍を更新
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            書籍情報を編集します
          </p>
        </div>

        <UpdateBookForm book={book} />
      </div>
    </div>
  );
}
