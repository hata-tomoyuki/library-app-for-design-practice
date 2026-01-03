"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { updateBook } from "@/app/actions/bookActions";
import { updateBookSchema, type UpdateBookInput } from "@/schemas/bookSchema";
import { FindByIdResponseDto } from "@/server/application/dtos/book/findByIdResponseDto";
import Button from "@/app/components/Button";

interface UpdateBookFormProps {
  book: FindByIdResponseDto;
}

export default function UpdateBookForm({ book }: UpdateBookFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const publishedAtDate = new Date(book.publishedAt);
  const publishedAtStr = publishedAtDate.toISOString().slice(0, 10);

  const defaultValues: UpdateBookInput = {
    id: book.id,
    title: book.title,
    author: book.author,
    publishedAt: publishedAtDate,
    isAvailable: book.isAvailable,
    imageUrl: book.imageUrl,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateBookInput>({
    resolver: zodResolver(updateBookSchema),
    defaultValues,
  });

  const onSubmit = async (data: UpdateBookInput) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await updateBook({
          id: data.id,
          title: data.title,
          author: data.author,
          publishedAt: data.publishedAt,
          isAvailable: data.isAvailable,
          imageUrl: data.imageUrl,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "書籍の更新に失敗しました",
        );
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">
        書籍を更新
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            タイトル
          </label>
          <input
            type="text"
            id="title"
            {...register("title")}
            disabled={isPending}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
            placeholder="書籍のタイトルを入力"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            著者
          </label>
          <input
            type="text"
            id="author"
            {...register("author")}
            disabled={isPending}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
            placeholder="著者名を入力"
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.author.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="publishedAt"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            出版日
          </label>
          <Controller
            name="publishedAt"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                id="publishedAt"
                value={
                  field.value
                    ? field.value.toISOString().slice(0, 10)
                    : publishedAtStr
                }
                onChange={(e) => {
                  field.onChange(
                    e.target.value ? new Date(e.target.value) : undefined,
                  );
                }}
                disabled={isPending}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
              />
            )}
          />
          {errors.publishedAt && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.publishedAt.message}
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={isPending}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "更新中..." : "書籍を更新"}
          </Button>
        </div>
      </form>
    </div>
  );
}
