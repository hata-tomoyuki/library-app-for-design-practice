"use server";

import { z } from "zod";
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
import prisma from "@/lib/prisma";

const bookRepository = new PrismaBookRepository(prisma);
const uuidGenerator = new UuidGenerator();
const createUseCase = new CreateUseCase(bookRepository, uuidGenerator);
const findByIdUseCase = new FindByIdUseCase(bookRepository);
const findAllUseCase = new FindAllUseCase(bookRepository);
const updateUseCase = new UpdateUseCase(bookRepository);
const bookController = new BookController(
  createUseCase,
  findByIdUseCase,
  findAllUseCase,
  updateUseCase,
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
): Promise<UpdateResponseDto> {
  try {
    return await bookController.update(input);
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
