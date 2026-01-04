"use client";

import { useState } from "react";
import { returnLoan } from "@/app/actions/loanActions";
import Button from "@/app/components/Button";

interface ReturnLoanButtonProps {
  loanId: string;
}

export default function ReturnLoanButton({ loanId }: ReturnLoanButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReturn = async () => {
    setPending(true);
    setError(null);

    try {
      await returnLoan(loanId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "返却処理に失敗しました");
      setPending(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleReturn}
        disabled={pending}
        variant="danger"
        className="px-4 py-2"
      >
        {pending ? "返却中..." : "返却する"}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
