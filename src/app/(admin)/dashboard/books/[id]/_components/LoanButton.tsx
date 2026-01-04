"use client";

import { useState } from "react";
import { createLoan } from "@/app/actions/loanActions";
import Button from "@/app/components/Button";

interface LoanButtonProps {
  bookId: string;
  isAvailable: boolean;
}

export default function LoanButton({ bookId, isAvailable }: LoanButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoan = async () => {
    if (!isAvailable) return;

    setPending(true);
    setError(null);

    try {
      await createLoan(bookId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "貸出処理に失敗しました");
      setPending(false);
    }
  };

  if (!isAvailable) {
    return (
      <button
        disabled
        className="px-6 py-3 bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-500 font-medium rounded-lg cursor-not-allowed"
      >
        貸出中
      </button>
    );
  }

  return (
    <div>
      <Button
        onClick={handleLoan}
        disabled={pending}
        className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
      >
        {pending ? "貸出中..." : "📚 この本を借りる"}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
