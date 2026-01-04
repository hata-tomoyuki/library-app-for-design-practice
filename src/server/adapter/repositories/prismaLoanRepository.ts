import { PrismaClient } from "@/generated/prisma/client";
import { Loan } from "../../domain/entities/loan";
import { LoanRepositoryInterface } from "../../domain/repositories/loanRepositoryInterface";
import { TransactionContextInterface } from "../../domain/utils/transactionContextInterface";

export class PrismaLoanRepository implements LoanRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  private getPrismaClient(ctx?: TransactionContextInterface): PrismaClient {
    // トランザクションコンテキストが提供されている場合はそれを使用
    // 将来的にPrismaTransactionClientを実装する場合はここで対応
    // 現時点ではTransactionContextInterfaceが空なので、通常のprismaを使用
    return this.prisma;
  }

  async create(
    loan: Loan,
    ctx?: TransactionContextInterface,
  ): Promise<Loan> {
    const prisma = this.getPrismaClient(ctx);

    const createdLoan = await prisma.loan.create({
      data: {
        id: loan.id,
        bookId: loan.bookId,
        userId: loan.userId,
        loanDate: loan.loanDate,
        dueDate: loan.dueDate,
        returnDate: loan.returnDate,
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt,
      },
    });

    return new Loan(
      createdLoan.id,
      createdLoan.bookId,
      createdLoan.userId,
      createdLoan.loanDate,
      createdLoan.returnDate,
      createdLoan.createdAt,
      createdLoan.updatedAt,
    );
  }

  async findById(
    id: string,
    ctx?: TransactionContextInterface,
  ): Promise<Loan | null> {
    const prisma = this.getPrismaClient(ctx);

    const foundLoan = await prisma.loan.findUnique({
      where: { id },
    });

    if (!foundLoan) return null;

    return new Loan(
      foundLoan.id,
      foundLoan.bookId,
      foundLoan.userId,
      foundLoan.loanDate,
      foundLoan.returnDate,
      foundLoan.createdAt,
      foundLoan.updatedAt,
    );
  }

  async findByUserId(
    userId: string,
    ctx?: TransactionContextInterface,
  ): Promise<Loan[]> {
    const prisma = this.getPrismaClient(ctx);

    const foundLoans = await prisma.loan.findMany({
      where: { userId },
      orderBy: { loanDate: "desc" },
    });

    if (foundLoans.length === 0) {
      return [];
    }

    return foundLoans.map(
      (loan) =>
        new Loan(
          loan.id,
          loan.bookId,
          loan.userId,
          loan.loanDate,
          loan.returnDate,
          loan.createdAt,
          loan.updatedAt,
        ),
    );
  }

  async update(
    loan: Loan,
    ctx?: TransactionContextInterface,
  ): Promise<Loan> {
    const prisma = this.getPrismaClient(ctx);

    const updatedLoan = await prisma.loan.update({
      where: { id: loan.id },
      data: {
        bookId: loan.bookId,
        userId: loan.userId,
        loanDate: loan.loanDate,
        dueDate: loan.dueDate,
        returnDate: loan.returnDate,
        updatedAt: loan.updatedAt,
      },
    });

    return new Loan(
      updatedLoan.id,
      updatedLoan.bookId,
      updatedLoan.userId,
      updatedLoan.loanDate,
      updatedLoan.returnDate,
      updatedLoan.createdAt,
      updatedLoan.updatedAt,
    );
  }
}

