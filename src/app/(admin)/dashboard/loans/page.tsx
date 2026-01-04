import { findLoansByUserId } from "@/app/actions/loanActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ReturnLoanButton from "./_components/ReturnLoanButton";

export default async function LoansPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const loans = await findLoansByUserId();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">
            貸出一覧
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            あなたが借りている書籍の一覧です
          </p>
        </div>

        {loans.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-4">
              現在借りている書籍はありません
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              書籍一覧を見る
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-2">
                      <Link
                        href={`/dashboard/books/${loan.bookId}`}
                        className="text-xl font-bold text-black dark:text-zinc-50 hover:underline"
                      >
                        書籍ID: {loan.bookId}
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-1">
                          貸出日
                        </p>
                        <p className="text-zinc-900 dark:text-zinc-50">
                          {new Date(loan.loanDate).toLocaleDateString("ja-JP")}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-1">
                          返却期限
                        </p>
                        <p className="text-zinc-900 dark:text-zinc-50">
                          {new Date(loan.dueDate).toLocaleDateString("ja-JP")}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-1">
                          返却日
                        </p>
                        <p className="text-zinc-900 dark:text-zinc-50">
                          {loan.returnDate
                            ? new Date(loan.returnDate).toLocaleDateString(
                                "ja-JP",
                              )
                            : "未返却"}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500 dark:text-zinc-400 mb-1">
                          状態
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            loan.returnDate
                              ? "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200"
                              : new Date(loan.dueDate) < new Date()
                                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                          }`}
                        >
                          {loan.returnDate
                            ? "返却済み"
                            : new Date(loan.dueDate) < new Date()
                              ? "期限超過"
                              : "貸出中"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!loan.returnDate && (
                    <div className="ml-4">
                      <ReturnLoanButton loanId={loan.id} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
