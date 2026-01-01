import CreateBookForm from "./components/CreateBookForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black py-12 px-4">
      <main className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            図書館管理システム
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            書籍を登録して管理しましょう
          </p>
        </div>
        <CreateBookForm />
      </main>
    </div>
  );
}
