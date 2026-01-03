import CreateBookForm from "@/app/components/CreateBookForm";

export default function CreateBookPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
            書籍登録
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            新しい書籍を登録します
          </p>
        </div>
        <CreateBookForm />
      </div>
    </div>
  );
}
