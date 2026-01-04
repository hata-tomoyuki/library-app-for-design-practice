import { LoanRepositoryInterface } from "../../../domain/repositories/loanRepositoryInterface";
import { BookRepositoryInterface } from "../../../domain/repositories/bookRepositoryInterface";
import { Loan } from "../../../domain/entities/loan";
import { Book } from "../../../domain/entities/book";
import { CreateLoanRequestDto } from "../../dtos/loan/createLoanRequestDto";
import { CreateLoanResponseDto } from "../../dtos/loan/createLoanResponseDto";
import { CreateLoanUseCaseInterface } from "./createLoanUseCaseInterface";
import { IdGeneratorInterface } from "../../../domain/utils/idGeneratorInterface";
import { TransactionManagerInterface } from "../../utils/transactionManagerInterface";

export class CreateLoanUseCase implements CreateLoanUseCaseInterface {
  constructor(
    private readonly loanRepository: LoanRepositoryInterface,
    private readonly bookRepository: BookRepositoryInterface,
    private readonly idGenerator: IdGeneratorInterface,
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  async execute(requestDto: CreateLoanRequestDto): Promise<CreateLoanResponseDto> {
    return await this.transactionManager.run(async (ctx) => {
      // 書籍の存在確認と利用可能チェック
      const book = await this.bookRepository.findById(requestDto.bookId);
      if (!book) {
        throw new Error("書籍が見つかりません");
      }
      if (!book.isAvailable) {
        throw new Error("この書籍は現在貸出中です");
      }

      // 貸出エンティティを作成
      const id = this.idGenerator.generate();
      const now = new Date();
      const newLoan = new Loan(
        id,
        requestDto.bookId,
        requestDto.userId,
        now,
        null,
        now,
        now,
      );

      // 貸出を作成
      const createdLoan = await this.loanRepository.create(newLoan, ctx);

      // 書籍の利用可能フラグをfalseに更新
      // 注意: BookRepositoryInterfaceはトランザクションコンテキストを受け取らないため、
      // トランザクション内で実行しても実際のトランザクションは効かない可能性がある
      const updatedBook = new Book(
        book.id,
        book.title,
        book.author,
        book.publishedAt,
        false, // isAvailableをfalseに
        book.imageUrl,
        book.createdAt,
        new Date(), // updatedAtを更新
      );
      await this.bookRepository.update(updatedBook);

      return {
        id: createdLoan.id,
        bookId: createdLoan.bookId,
        userId: createdLoan.userId,
        loanDate: createdLoan.loanDate,
        dueDate: createdLoan.dueDate,
        createdAt: createdLoan.createdAt,
        updatedAt: createdLoan.updatedAt,
      };
    });
  }
}

