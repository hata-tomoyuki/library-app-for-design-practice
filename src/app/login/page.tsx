import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./_components/LoginForm";

export default async function LoginPage() {
  const session = await auth();

  // 既にログインしている場合はダッシュボードにリダイレクト
  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
