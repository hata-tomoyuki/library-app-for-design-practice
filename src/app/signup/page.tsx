import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignupForm from "./_components/SignupForm";

export default async function SignupPage() {
  const session = await auth();

  // 既にログインしている場合はダッシュボードにリダイレクト
  if (session) {
    redirect("/dashboard");
  }

  return <SignupForm />;
}
