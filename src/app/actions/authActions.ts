"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth-utils";
import { PrismaUserRepository } from "@/server/adapter/repositories/prismaUserRepository";
import { UuidGenerator } from "@/server/adapter/utils/uuidGenerator";
import { SignupUseCase } from "@/server/application/usecases/user/signupUseCase";
import { EmailAlreadyExistsError } from "@/server/domain/errors/userErrors";
import prisma from "@/lib/prisma";
import { BcryptPasswordHasher } from "@/server/adapter/utils/bcryptPasswordHasher";
import { UserController } from "@/server/adapter/controllers/userController";
import type { SignupInput, LoginInput } from "@/schemas/userSchema";
import { cookies } from "next/headers";

type ActionState =
  | { ok: true; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

function toFieldErrors(err: z.ZodError) {
  return err.flatten().fieldErrors as Record<string, string[]>;
}

// UseCaseのインスタンスを作成（外側で依存関係を注入）
const userRepository = new PrismaUserRepository(prisma);
const passwordHasher = new BcryptPasswordHasher();
const idGenerator = new UuidGenerator();
const signupUseCase = new SignupUseCase(
  userRepository,
  passwordHasher,
  idGenerator,
);
const userController = new UserController(signupUseCase, signIn);

/**
 * Signup: ユーザー作成 → 自動ログイン → /dashboard に遷移
 */
export async function signupAction(
  _: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const raw: SignupInput = {
    name: (formData.get("name") as string | null) ?? undefined,
    email: (formData.get("email") as string | null) ?? "",
    password: (formData.get("password") as string | null) ?? "",
  };

  try {
    await userController.signupAndSignIn(raw);
    redirect("/dashboard");
  } catch (error) {
    // Zodのバリデーションエラーを処理
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        message: "入力内容を確認してください",
        fieldErrors: toFieldErrors(error),
      };
    }
    // Domainエラーを処理
    if (error instanceof EmailAlreadyExistsError) {
      return { ok: false, message: error.message };
    }
    // その他のエラー（signInのエラーも含む）
    console.error("ユーザー登録に失敗しました:", error);
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "登録に失敗しました",
    };
  }
}

/**
 * Login: 認証だけして、成功したら /dashboard に遷移
 * 失敗したら画面にエラーを返す
 */
export async function loginAction(
  _: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const raw: LoginInput = {
    email: (formData.get("email") as string | null) ?? "",
    password: (formData.get("password") as string | null) ?? "",
  };

  try {
    // ✅ Controllerでログイン処理（Controller内でZodバリデーション）
    await userController.login(raw);
    redirect("/dashboard");
  } catch (error) {
    // Zodのバリデーションエラーを処理
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        message: "入力内容を確認してください",
        fieldErrors: toFieldErrors(error),
      };
    }
    // その他のエラー（認証失敗も含む）
    console.error("ログインに失敗しました:", error);
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "メールアドレスまたはパスワードが違います",
    };
  }
}

/**
 * Logout: セッションを削除してログインページにリダイレクト
 */
export async function logoutAction() {
  const cookieStore = await cookies();

  // NextAuthのセッションクッキーを削除
  cookieStore.delete("next-auth.session-token");

  redirect("/login");
}
