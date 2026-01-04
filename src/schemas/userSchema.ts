import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "名前を入力してください").optional(),
  email: z.email({ message: "メールアドレスが不正です" }),
  password: z.string().min(8, "パスワードは8文字以上にしてください"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email({ message: "メールアドレスが不正です" }),
  password: z.string().min(1, "パスワードを入力してください"),
});

export type LoginInput = z.infer<typeof loginSchema>;

