import { CreateLoanUseCaseInterface } from "../../application/usecases/loan/createLoanUseCaseInterface";
import { CreateLoanRequestDto } from "../../application/dtos/loan/createLoanRequestDto";
import { CreateLoanResponseDto } from "../../application/dtos/loan/createLoanResponseDto";
import { ReturnLoanUseCaseInterface } from "../../application/usecases/loan/returnLoanUseCaseInterface";
import { ReturnLoanRequestDto } from "../../application/dtos/loan/returnLoanRequestDto";
import { ReturnLoanResponseDto } from "../../application/dtos/loan/returnLoanResponseDto";
import { FindLoanByIdUseCaseInterface } from "../../application/usecases/loan/findLoanByIdUseCaseInterface";
import { FindLoanByIdRequestDto } from "../../application/dtos/loan/findLoanByIdRequestDto";
import { FindLoanByIdResponseDto } from "../../application/dtos/loan/findLoanByIdResponseDto";
import { FindLoansByUserIdUseCaseInterface } from "../../application/usecases/loan/findLoansByUserIdUseCaseInterface";
import { FindLoansByUserIdRequestDto } from "../../application/dtos/loan/findLoansByUserIdRequestDto";
import { FindLoansByUserIdResponseDto } from "../../application/dtos/loan/findLoansByUserIdResponseDto";

export class LoanController {
  constructor(
    private readonly createLoanUseCase: CreateLoanUseCaseInterface,
    private readonly returnLoanUseCase: ReturnLoanUseCaseInterface,
    private readonly findLoanByIdUseCase: FindLoanByIdUseCaseInterface,
    private readonly findLoansByUserIdUseCase: FindLoansByUserIdUseCaseInterface,
  ) {}

  /**
   * 貸出作成
   * 外部形式をアプリケーション層の形式（CreateLoanRequestDto）に変換する
   */
  async create(input: {
    bookId: string;
    userId: string;
  }): Promise<CreateLoanResponseDto> {
    const requestDto: CreateLoanRequestDto = {
      bookId: input.bookId,
      userId: input.userId,
    };

    return await this.createLoanUseCase.execute(requestDto);
  }

  /**
   * 返却処理
   * 外部形式をアプリケーション層の形式（ReturnLoanRequestDto）に変換する
   */
  async return(input: { loanId: string }): Promise<ReturnLoanResponseDto> {
    const requestDto: ReturnLoanRequestDto = {
      loanId: input.loanId,
    };

    return await this.returnLoanUseCase.execute(requestDto);
  }

  /**
   * 貸出記録をIDで検索
   */
  async findById(
    input: FindLoanByIdRequestDto,
  ): Promise<FindLoanByIdResponseDto> {
    return await this.findLoanByIdUseCase.execute(input);
  }

  /**
   * ユーザーIDで貸出記録一覧を取得
   */
  async findByUserId(
    input: FindLoansByUserIdRequestDto,
  ): Promise<FindLoansByUserIdResponseDto[]> {
    return await this.findLoansByUserIdUseCase.execute(input);
  }
}
