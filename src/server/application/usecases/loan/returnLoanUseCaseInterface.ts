import { ReturnLoanRequestDto } from "../../dtos/loan/returnLoanRequestDto";
import { ReturnLoanResponseDto } from "../../dtos/loan/returnLoanResponseDto";

export interface ReturnLoanUseCaseInterface {
  execute(requestDto: ReturnLoanRequestDto): Promise<ReturnLoanResponseDto>;
}
