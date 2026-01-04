import { UserRepositoryInterface } from "../../../domain/repositories/userRepositoryInterface";
import { PasswordHasherInterface } from "../../../domain/utils/passwordHasherInterface";
import { IdGeneratorInterface } from "../../../domain/utils/idGeneratorInterface";
import { User } from "../../../domain/entities/user";
import { EmailAlreadyExistsError } from "../../../domain/errors/userErrors";
import { SignupRequestDto } from "../../dtos/user/signupRequestDto";
import { SignupResponseDto } from "../../dtos/user/signupResponseDto";
import { SignupUseCaseInterface } from "./signupUseCaseInterface";

export class SignupUseCase implements SignupUseCaseInterface {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly idGenerator: IdGeneratorInterface,
  ) {}

  async execute(requestDto: SignupRequestDto): Promise<SignupResponseDto> {
    // メールアドレスの重複チェック
    const existingUser = await this.userRepository.findByEmail(
      requestDto.email,
    );
    if (existingUser) {
      throw new EmailAlreadyExistsError(requestDto.email);
    }

    // パスワードをハッシュ化
    const passwordHash = await this.passwordHasher.hash(requestDto.password);

    // ユーザーエンティティを作成（デフォルトでUSERロール）
    const id = this.idGenerator.generate();
    const now = new Date();
    const newUser = new User(
      id,
      requestDto.email,
      requestDto.name ?? null,
      passwordHash,
      "USER", // 新規登録時は常にUSERロール
      now,
      now,
    );

    // ユーザーを保存
    const createdUser = await this.userRepository.create(newUser);

    return {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
    };
  }
}
