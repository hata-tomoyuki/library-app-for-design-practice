import { UserRepositoryInterface } from "../../../domain/repositories/userRepositoryInterface";
import { PasswordHasherInterface } from "../../../domain/utils/passwordHasherInterface";
import { InvalidCredentialsError } from "../../../domain/errors/userErrors";
import { VerifyCredentialsRequestDto } from "../../dtos/user/verifyCredentialsRequestDto";
import { VerifyCredentialsResponseDto } from "../../dtos/user/verifyCredentialsResponseDto";
import { VerifyCredentialsUseCaseInterface } from "./verifyCredentialsUseCaseInterface";

export class VerifyCredentialsUseCase
  implements VerifyCredentialsUseCaseInterface
{
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  async execute(
    requestDto: VerifyCredentialsRequestDto,
  ): Promise<VerifyCredentialsResponseDto> {
    // ユーザーを取得
    const user = await this.userRepository.findByEmail(requestDto.email);
    if (!user || !user.passwordHash) {
      throw new InvalidCredentialsError();
    }

    // パスワードを照合
    const isValid = await this.passwordHasher.compare(
      requestDto.password,
      user.passwordHash,
    );
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
