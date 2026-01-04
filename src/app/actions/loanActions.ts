"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PrismaLoanRepository } from "@/server/adapter/repositories/prismaLoanRepository";
import { PrismaBookRepository } from "@/server/adapter/repositories/prismaBookRepository";
import { UuidGenerator } from "@/server/adapter/utils/uuidGenerator";
import { PrismaTransactionManager } from "@/server/adapter/utils/prismaTransactionManager";
import { LoanController } from "@/server/adapter/controllers/loanController";
import { CreateLoanUseCase } from "@/server/application/usecases/loan/createLoanUseCase";
import { ReturnLoanUseCase } from "@/server/application/usecases/loan/returnLoanUseCase";
import { FindLoanByIdUseCase } from "@/server/application/usecases/loan/findLoanByIdUseCase";
import { FindLoansByUserIdUseCase } from "@/server/application/usecases/loan/findLoansByUserIdUseCase";
import { FindLoansByUserIdResponseDto } from "@/server/application/dtos/loan/findLoansByUserIdResponseDto";
import { FindLoanByIdResponseDto } from "@/server/application/dtos/loan/findLoanByIdResponseDto";
import prisma from "@/lib/prisma";

const loanRepository = new PrismaLoanRepository(prisma);
const bookRepository = new PrismaBookRepository(prisma);
const uuidGenerator = new UuidGenerator();
const transactionManager = new PrismaTransactionManager(prisma);
const createLoanUseCase = new CreateLoanUseCase(
  loanRepository,
  bookRepository,
  uuidGenerator,
  transactionManager,
);
const returnLoanUseCase = new ReturnLoanUseCase(
  loanRepository,
  bookRepository,
  transactionManager,
);
const findLoanByIdUseCase = new FindLoanByIdUseCase(loanRepository);
const findLoansByUserIdUseCase = new FindLoansByUserIdUseCase(loanRepository);
const loanController = new LoanController(
  createLoanUseCase,
  returnLoanUseCase,
  findLoanByIdUseCase,
  findLoansByUserIdUseCase,
);

function isRedirectError(error: unknown): boolean {
  if (error === null || typeof error !== "object") {
    return false;
  }
  const digest = (error as { digest?: string }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

/**
 * 貸出作成
 */
export async function createLoan(bookId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("ログインが必要です");
    }

    const userId = (session.user as any).id;
    if (!userId) {
      throw new Error("ログインが必要です");
    }

    await loanController.create({
      bookId,
      userId: userId as string,
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("貸出の作成に失敗しました:", error);
    throw new Error(
      error instanceof Error ? error.message : "貸出の作成に失敗しました",
    );
  }
  redirect(`/dashboard/books/${bookId}`);
}

/**
 * 返却処理
 */
export async function returnLoan(loanId: string) {
  try {
    await loanController.return({ loanId });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("返却処理に失敗しました:", error);
    throw new Error(
      error instanceof Error ? error.message : "返却処理に失敗しました",
    );
  }
  redirect("/dashboard/loans");
}

/**
 * 貸出記録をIDで検索
 */
export async function findLoanById(
  id: string,
): Promise<FindLoanByIdResponseDto | null> {
  try {
    return await loanController.findById({ id });
  } catch (error) {
    console.error("貸出記録の取得に失敗しました:", error);
    throw error;
  }
}

/**
 * ユーザーIDで貸出記録一覧を取得
 */
export async function findLoansByUserId(): Promise<
  FindLoansByUserIdResponseDto[]
> {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("ログインが必要です");
    }

    const userId = (session.user as any).id;
    if (!userId) {
      throw new Error("ログインが必要です");
    }

    return await loanController.findByUserId({
      userId: userId as string,
    });
  } catch (error) {
    console.error("貸出記録一覧の取得に失敗しました:", error);
    throw new Error("貸出記録一覧の取得に失敗しました");
  }
}
