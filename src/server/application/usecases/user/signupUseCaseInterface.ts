import { SignupRequestDto } from "../../dtos/user/signupRequestDto";
import { SignupResponseDto } from "../../dtos/user/signupResponseDto";

export interface SignupUseCaseInterface {
  execute(requestDto: SignupRequestDto): Promise<SignupResponseDto>;
}
