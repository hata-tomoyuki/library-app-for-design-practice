import { z } from "zod";

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(200, "タイトルは200文字以内で入力してください"),
  author: z
    .string()
    .min(1, "著者名は必須です")
    .max(100, "著者名は100文字以内で入力してください"),
  publishedAt: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "有効な日付を入力してください",
  }),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;

export const updateBookSchema = z.object({
  id: z.string().min(1, "IDは必須です"),
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(200, "タイトルは200文字以内で入力してください"),
  author: z
    .string()
    .min(1, "著者名は必須です")
    .max(100, "著者名は100文字以内で入力してください"),
  publishedAt: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "有効な日付を入力してください",
  }),
});

export type UpdateBookInput = z.infer<typeof updateBookSchema>;
