import { CreateLoanRequestDto } from "../../dtos/loan/createLoanRequestDto";
import { CreateLoanResponseDto } from "../../dtos/loan/createLoanResponseDto";

export interface CreateLoanUseCaseInterface {
  execute(requestDto: CreateLoanRequestDto): Promise<CreateLoanResponseDto>;
}

