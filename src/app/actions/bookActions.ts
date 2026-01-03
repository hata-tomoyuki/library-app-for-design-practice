"use server";

import { z } from "zod";
import { deleteOldImage } from "@/lib/uploadthing-utils";
import { PrismaBookRepository } from "@/server/adapter/repositories/prismaBookRepository";
import { CreateUseCase } from "@/server/application/usecases/book/createUseCase";
import { CreateResponseDto } from "@/server/application/dtos/book/createResponseDto";
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
import { UpdateResponseDto } from "@/server/application/dtos/book/updateResponseDto";
import { DeleteUseCase } from "@/server/application/usecases/book/deleteUseCase";
import { DeleteResponseDto } from "@/server/application/dtos/book/deleteResponseDto";
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

export async function createBook(
  input: CreateBookInput,
): Promise<CreateResponseDto> {
  try {
    return await bookController.create(input);
  } catch (error) {
    // Zodのバリデーションエラーを処理
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`バリデーションエラー: ${errorMessages}`);
    }

    console.error("書籍の作成に失敗しました:", error);
    throw new Error("書籍の作成に失敗しました");
  }
}

export async function findAllBooks(): Promise<FindAllResponseDto[]> {
  try {
    const requestDto: FindAllRequestDto = {};
    return await bookController.findAll(requestDto);
  } catch (error) {
    console.error("書籍一覧の取得に失敗しました:", error);
    throw new Error("書籍一覧の取得に失敗しました");
  }
}

export async function findBookById(id: string): Promise<FindByIdResponseDto> {
  try {
    const requestDto: FindByIdRequestDto = { id };
    return await bookController.findById(requestDto);
  } catch (error) {
    console.error("書籍の取得に失敗しました:", error);
    throw error;
  }
}

export async function updateBook(
  input: UpdateBookInput,
  oldImageUrl?: string,
): Promise<UpdateResponseDto> {
  try {
    const result = await bookController.update(input);

    // 新しい画像がアップロードされた場合、古い画像を削除
    if (input.imageUrl && oldImageUrl && input.imageUrl !== oldImageUrl) {
      await deleteOldImage(oldImageUrl);
    }

    return result;
  } catch (error) {
    // Zodのバリデーションエラーを処理
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`バリデーションエラー: ${errorMessages}`);
    }

    console.error("書籍の更新に失敗しました:", error);
    throw new Error("書籍の更新に失敗しました");
  }
}

export async function deleteBook(id: string): Promise<DeleteResponseDto> {
  try {
    // 削除前に書籍情報を取得して画像URLを保存
    const book = await bookController.findById({ id });

    // 書籍を削除
    const result = await bookController.delete(id);

    // 削除された書籍の画像をUploadThingから削除
    if (book.imageUrl) {
      await deleteOldImage(book.imageUrl);
    }

    return result;
  } catch (error) {
    console.error("書籍の削除に失敗しました:", error);
    throw error;
  }
}
