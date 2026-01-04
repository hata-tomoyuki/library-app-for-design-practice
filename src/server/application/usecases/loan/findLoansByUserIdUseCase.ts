import { LoanRepositoryInterface } from "../../../domain/repositories/loanRepositoryInterface";
import { FindLoansByUserIdRequestDto } from "../../dtos/loan/findLoansByUserIdRequestDto";
import { FindLoansByUserIdResponseDto } from "../../dtos/loan/findLoansByUserIdResponseDto";
import { FindLoansByUserIdUseCaseInterface } from "./findLoansByUserIdUseCaseInterface";

export class FindLoansByUserIdUseCase
  implements FindLoansByUserIdUseCaseInterface
{
  constructor(private readonly loanRepository: LoanRepositoryInterface) {}

  async execute(
    requestDto: FindLoansByUserIdRequestDto,
  ): Promise<FindLoansByUserIdResponseDto[]> {
    const loans = await this.loanRepository.findByUserId(requestDto.userId);

    return loans.map((loan) => ({
      id: loan.id,
      bookId: loan.bookId,
      userId: loan.userId,
      loanDate: loan.loanDate,
      dueDate: loan.dueDate,
      returnDate: loan.returnDate,
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt,
    }));
  }
}
