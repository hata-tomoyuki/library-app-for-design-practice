import { LoanRepositoryInterface } from "../../../domain/repositories/loanRepositoryInterface";
import { FindLoanByIdRequestDto } from "../../dtos/loan/findLoanByIdRequestDto";
import { FindLoanByIdResponseDto } from "../../dtos/loan/findLoanByIdResponseDto";
import { FindLoanByIdUseCaseInterface } from "./findLoanByIdUseCaseInterface";

export class FindLoanByIdUseCase implements FindLoanByIdUseCaseInterface {
  constructor(
    private readonly loanRepository: LoanRepositoryInterface,
  ) {}

  async execute(
    requestDto: FindLoanByIdRequestDto,
  ): Promise<FindLoanByIdResponseDto> {
    const loan = await this.loanRepository.findById(requestDto.id);

    if (!loan) {
      throw new Error("貸出記録が見つかりません");
    }

    return {
      id: loan.id,
      bookId: loan.bookId,
      userId: loan.userId,
      loanDate: loan.loanDate,
      dueDate: loan.dueDate,
      returnDate: loan.returnDate,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    };
  }
}

