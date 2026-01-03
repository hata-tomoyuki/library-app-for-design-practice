"use client";

import { useState, useTransition, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBook } from "../actions/bookActions";
import { CreateResponseDto } from "@/server/application/dtos/book/createResponseDto";
import {
  createBookSchema,
  type CreateBookInput,
} from "../../schemas/bookSchema";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";

export default function CreateBookForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<CreateResponseDto | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      // アップロード完了時の処理はstartUploadの結果で処理
    },
    onUploadError: (error: Error) => {
      throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
    },
  });

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const defaultValues: CreateBookInput = {
    title: "",
    author: "",
    publishedAt: today,
    isAvailable: false,
    imageUrl: undefined,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
    defaultValues,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // プレビュー用のURLを作成
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValue("imageUrl", undefined);
  };

  const onSubmit = async (data: CreateBookInput) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        let imageUrl: string | undefined = undefined;

        // ファイルが選択されている場合、アップロードを実行
        if (selectedFile) {
          const uploadResult = await startUpload([selectedFile]);
          if (uploadResult && uploadResult[0]) {
            imageUrl = uploadResult[0].url;
          } else {
            throw new Error("画像のアップロードに失敗しました");
          }
        }

        const result = await createBook({
          title: data.title,
          author: data.author,
          publishedAt: data.publishedAt,
          isAvailable: data.isAvailable,
          imageUrl,
        });

        setSuccess(result);
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        reset({
          ...defaultValues,
          publishedAt: today,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "書籍の作成に失敗しました",
        );
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">
        書籍を登録
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
                    : todayStr
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

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            画像
          </label>
          <div className="space-y-4">
            {previewUrl ? (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="選択された画像のプレビュー"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  disabled={isPending || isUploading}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isPending || isUploading}
                  className="block w-full text-sm text-zinc-700 dark:text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-zinc-900 dark:file:bg-zinc-50 file:text-white dark:file:text-black hover:file:bg-zinc-800 dark:hover:file:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  画像は書籍登録時にアップロードされます
                </p>
              </div>
            )}
          </div>
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("isAvailable")}
              disabled={isPending}
              className="w-5 h-5 text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 rounded focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 cursor-pointer"
            />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              貸出可能
            </span>
          </label>
          {errors.isAvailable && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.isAvailable.message}
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              書籍が正常に登録されました！
            </p>
            <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
              <p>ID: {success.id}</p>
              <p>タイトル: {success.title}</p>
              <p>著者: {success.author}</p>
              <p>
                出版日:{" "}
                {new Date(success.publishedAt).toLocaleDateString("ja-JP")}
              </p>
              {success.imageUrl && (
                <div className="mt-2">
                  <p>画像:</p>
                  <Image
                    src={success.imageUrl}
                    alt="アップロードされた画像"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || isUploading}
          className="w-full px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending || isUploading
            ? isUploading
              ? "画像をアップロード中..."
              : "登録中..."
            : "書籍を登録"}
        </button>
      </form>
    </div>
  );
}
