import { LoanRepositoryInterface } from "../../../domain/repositories/loanRepositoryInterface";
import { BookRepositoryInterface } from "../../../domain/repositories/bookRepositoryInterface";
import { Book } from "../../../domain/entities/book";
import { ReturnLoanRequestDto } from "../../dtos/loan/returnLoanRequestDto";
import { ReturnLoanResponseDto } from "../../dtos/loan/returnLoanResponseDto";
import { ReturnLoanUseCaseInterface } from "./returnLoanUseCaseInterface";
import { TransactionManagerInterface } from "../../utils/transactionManagerInterface";

export class ReturnLoanUseCase implements ReturnLoanUseCaseInterface {
  constructor(
    private readonly loanRepository: LoanRepositoryInterface,
    private readonly bookRepository: BookRepositoryInterface,
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  async execute(
    requestDto: ReturnLoanRequestDto,
  ): Promise<ReturnLoanResponseDto> {
    return await this.transactionManager.run(async (ctx) => {
      // 貸出を取得
      const loan = await this.loanRepository.findById(requestDto.loanId, ctx);
      if (!loan) {
        throw new Error("貸出記録が見つかりません");
      }

      // 既に返却済みかチェック
      if (loan.returnDate) {
        throw new Error("この書籍は既に返却されています");
      }

      // 返却処理
      loan.return();
      const updatedLoan = await this.loanRepository.update(loan, ctx);

      // 書籍の利用可能フラグをtrueに更新
      // 注意: BookRepositoryInterfaceはトランザクションコンテキストを受け取らないため、
      // トランザクション内で実行しても実際のトランザクションは効かない可能性がある
      const book = await this.bookRepository.findById(loan.bookId);
      if (!book) {
        throw new Error("書籍が見つかりません");
      }
      const updatedBook = new Book(
        book.id,
        book.title,
        book.author,
        book.publishedAt,
        true, // isAvailableをtrueに
        book.imageUrl,
        book.createdAt,
        new Date(), // updatedAtを更新
      );
      await this.bookRepository.update(updatedBook);

      return {
        id: updatedLoan.id,
        bookId: updatedLoan.bookId,
        userId: updatedLoan.userId,
        loanDate: updatedLoan.loanDate,
        returnDate: updatedLoan.returnDate!,
        createdAt: updatedLoan.createdAt,
        updatedAt: updatedLoan.updatedAt,
      };
    });
  }
}
