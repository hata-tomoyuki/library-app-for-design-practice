import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { PrismaUserRepository } from "@/server/adapter/repositories/prismaUserRepository";
import { VerifyCredentialsUseCase } from "@/server/application/usecases/user/verifyCredentialsUseCase";
import { BcryptPasswordHasher } from "@/server/adapter/utils/bcryptPasswordHasher";
import prisma from "@/lib/prisma";

// UseCaseのインスタンスを作成（外側で依存関係を注入）
const userRepository = new PrismaUserRepository(prisma);
const passwordHasher = new BcryptPasswordHasher();
const verifyCredentialsUseCase = new VerifyCredentialsUseCase(
  userRepository,
  passwordHasher,
);

/**
 * Server ActionからsignInを呼ぶためのヘルパー関数
 * NextAuth v4では、Server Actionから直接signInを呼ぶのは複雑なため、
 * UseCaseを直接呼び出して認証し、JWTトークンを直接作成してクッキーに設定します
 */
export async function signIn(
  provider: string,
  options: { email: string; password: string; redirect: boolean },
): Promise<{ error?: string } | undefined> {
  try {
    // UseCaseを直接呼び出して認証
    const result = await verifyCredentialsUseCase.execute({
      email: options.email,
      password: options.password,
    });

    // JWTトークンを作成（authOptionsのcallbacks.jwtを考慮）
    const token = await encode({
      token: {
        userId: result.userId,
        email: result.email,
        name: result.name,
        role: result.role,
      },
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "",
    });

    // セッションクッキーを設定
    const cookieStore = await cookies();
    cookieStore.set("next-auth.session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30日
    });

    return undefined;
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "メールアドレスまたはパスワードが違います" };
  }
}
