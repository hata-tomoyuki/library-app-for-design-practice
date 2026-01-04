import { VerifyCredentialsRequestDto } from "../../dtos/user/verifyCredentialsRequestDto";
import { VerifyCredentialsResponseDto } from "../../dtos/user/verifyCredentialsResponseDto";

export interface VerifyCredentialsUseCaseInterface {
  execute(
    requestDto: VerifyCredentialsRequestDto,
  ): Promise<VerifyCredentialsResponseDto>;
}
