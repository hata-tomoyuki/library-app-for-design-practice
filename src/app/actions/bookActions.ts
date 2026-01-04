"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { deleteOldImage } from "@/lib/uploadthing-utils";
import { PrismaBookRepository } from "@/server/adapter/repositories/prismaBookRepository";
import { CreateUseCase } from "@/server/application/usecases/book/createUseCase";
import { UuidGenerator } from "@/server/adapter/utils/uuidGenerator";
import { BookController } from "@/server/adapter/controllers/bookController";
import {
  type CreateBookInput,
  type UpdateBookInput,
} from "@/schemas/bookSchema";
import { FindByIdUseCase } from "@/server/application/usecases/book/findByIdUseCase";
import { FindAllUseCase } from "@/server/application/usecases/book/findAllUseCase";
import { FindAllResponseDto } from "@/server/application/dtos/book/findAllResponseDto";
import { FindAllRequestDto } from "@/server/application/dtos/book/findAllRequestDto";
import { FindByIdResponseDto } from "@/server/application/dtos/book/findByIdResponseDto";
import { FindByIdRequestDto } from "@/server/application/dtos/book/findByIdRequestDto";
import { UpdateUseCase } from "@/server/application/usecases/book/updateUseCase";
import { DeleteUseCase } from "@/server/application/usecases/book/deleteUseCase";
import prisma from "@/lib/prisma";

const bookRepository = new PrismaBookRepository(prisma);
const uuidGenerator = new UuidGenerator();
const createUseCase = new CreateUseCase(bookRepository, uuidGenerator);
const findByIdUseCase = new FindByIdUseCase(bookRepository);
const findAllUseCase = new FindAllUseCase(bookRepository);
const updateUseCase = new UpdateUseCase(bookRepository);
const deleteUseCase = new DeleteUseCase(bookRepository);
const bookController = new BookController(
  createUseCase,
  findByIdUseCase,
  findAllUseCase,
  updateUseCase,
  deleteUseCase,
);

function isRedirectError(error: unknown): boolean {
  if (error === null || typeof error !== "object") {
    return false;
  }
  const digest = (error as { digest?: string }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

export async function createBook(input: CreateBookInput) {
  try {
    // 管理者権限チェック
    await requireAdmin();

    await bookController.create(input);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    // Zodのバリデーションエラーを処理
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`バリデーションエラー: ${errorMessages}`);
    }

    console.error("書籍の作成に失敗しました:", error);
    throw new Error(
      error instanceof Error ? error.message : "書籍の作成に失敗しました",
    );
  }
  redirect("/dashboard");
}

export async function findAllBooks(): Promise<FindAllResponseDto[]> {
  try {
    // ログインチェック
    await requireAuth();

    const requestDto: FindAllRequestDto = {};
    return await bookController.findAll(requestDto);
  } catch (error) {
    console.error("書籍一覧の取得に失敗しました:", error);
    throw new Error(
      error instanceof Error ? error.message : "書籍一覧の取得に失敗しました",
    );
  }
}

export async function findBookById(
  id: string,
): Promise<FindByIdResponseDto | null> {
  try {
    // ログインチェック
    await requireAuth();

    const requestDto: FindByIdRequestDto = { id };
    return await bookController.findById(requestDto);
  } catch (error) {
    console.error("書籍の取得に失敗しました:", error);
    throw error;
  }
}

export async function updateBook(input: UpdateBookInput, oldImageUrl?: string) {
  let result;
  try {
    // 管理者権限チェック
    await requireAdmin();

    result = await bookController.update(input);

    if (input.imageUrl && oldImageUrl && input.imageUrl !== oldImageUrl) {
      await deleteOldImage(oldImageUrl);
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof z.ZodError) {
      const msg = error.issues.map((i) => i.message).join(", ");
      throw new Error(`バリデーションエラー: ${msg}`);
    }
    console.error("書籍の更新に失敗しました:", error);
    throw new Error(
      error instanceof Error ? error.message : "書籍の更新に失敗しました",
    );
  }

  redirect(`/dashboard/books/${result.id}`);
}

export async function deleteBook(id: string) {
  try {
    // 管理者権限チェック
    await requireAdmin();

    // 削除前に書籍情報を取得して画像URLを保存
    const book = await bookController.findById({ id });

    if (!book) {
      throw new Error("書籍が見つかりませんでした");
    }

    // 書籍を削除
    await bookController.delete(id);

    // 削除された書籍の画像をUploadThingから削除
    if (book.imageUrl) {
      await deleteOldImage(book.imageUrl);
    }

    redirect("/dashboard");
  } catch (error) {
    // redirect()がthrowするNEXT_REDIRECTエラーは再throwする必要がある
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("書籍の削除に失敗しました:", error);
    throw error;
  }
}
