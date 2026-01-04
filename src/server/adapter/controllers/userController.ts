import { SignupUseCaseInterface } from "../../application/usecases/user/signupUseCaseInterface";
import { SignupRequestDto } from "../../application/dtos/user/signupRequestDto";
import { SignupResponseDto } from "../../application/dtos/user/signupResponseDto";
import {
  signupSchema,
  loginSchema,
  type SignupInput,
  type LoginInput,
} from "@/schemas/userSchema";

// NextAuthのsignIn関数の型
type SignInFunction = (
  provider: string,
  options: { email: string; password: string; redirect: boolean }
) => Promise<{ error?: string } | undefined>;

export class UserController {
  constructor(
    private readonly signupUseCase: SignupUseCaseInterface,
    private readonly signIn: SignInFunction,
  ) {}

  /**
   * ユーザー登録
   * 外部形式（Server Actions形式）をアプリケーション層の形式（SignupRequestDto）に変換し、
   * Zodスキーマでバリデーションを行う
   */
  async signup(input: SignupInput): Promise<SignupResponseDto> {
    const validatedData = signupSchema.parse(input);

    const requestDto: SignupRequestDto = {
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
    };

    return await this.signupUseCase.execute(requestDto);
  }

  /**
   * ログイン（認証）
   * 外部形式をバリデーションし、NextAuthのsignInを呼び出してセッションを発行する
   */
  async login(input: LoginInput): Promise<void> {
    const validatedData = loginSchema.parse(input);

    const res = await this.signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    // Auth.js の signIn は戻り値が環境で変わることがあるので、
    // 失敗は try/catch + message で握るのが安全
    // res が取れる場合は res?.error を見る
    // @ts-ignore
    if (res?.error) {
      throw new Error("メールアドレスまたはパスワードが違います");
    }
  }

  /**
   * ユーザー登録と自動ログイン
   * 登録後に自動的にログインセッションを発行する
   */
  async signupAndSignIn(input: SignupInput): Promise<SignupResponseDto> {
    const result = await this.signup(input);

    // 登録後に自動ログイン
    await this.login({
      email: input.email,
      password: input.password,
    });

    return result;
  }
}
