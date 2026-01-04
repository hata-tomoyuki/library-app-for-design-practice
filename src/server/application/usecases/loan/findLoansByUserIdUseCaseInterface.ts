import { FindLoansByUserIdRequestDto } from "../../dtos/loan/findLoansByUserIdRequestDto";
import { FindLoansByUserIdResponseDto } from "../../dtos/loan/findLoansByUserIdResponseDto";

export interface FindLoansByUserIdUseCaseInterface {
  execute(
    requestDto: FindLoansByUserIdRequestDto,
  ): Promise<FindLoansByUserIdResponseDto[]>;
}

