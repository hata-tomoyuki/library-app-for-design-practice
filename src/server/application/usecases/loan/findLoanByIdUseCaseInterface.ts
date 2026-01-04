import { FindLoanByIdRequestDto } from "../../dtos/loan/findLoanByIdRequestDto";
import { FindLoanByIdResponseDto } from "../../dtos/loan/findLoanByIdResponseDto";

export interface FindLoanByIdUseCaseInterface {
  execute(requestDto: FindLoanByIdRequestDto): Promise<FindLoanByIdResponseDto>;
}
