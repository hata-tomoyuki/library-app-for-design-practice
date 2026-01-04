import { auth } from "./auth";

/**
 * ログインチェックを行うヘルパー関数
 * ログインしていない場合はエラーを投げる
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("ログインが必要です");
  }
  return session;
}

/**
 * 管理者権限チェックを行うヘルパー関数
 * ログインしていない、または管理者でない場合はエラーを投げる
 */
export async function requireAdmin() {
  const session = await requireAuth();
  const userRole = (session.user as any).role;
  if (userRole !== "ADMIN") {
    throw new Error("この操作を実行する権限がありません");
  }
  return session;
}
