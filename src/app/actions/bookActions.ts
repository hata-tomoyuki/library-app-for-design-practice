"use server";

import { z } from "zod";
import { PrismaBookRepository } from "@/server/adapter/repositories/prismaBookRepository";
import { CreateUseCase } from "@/server/application/usecases/book/createUseCase";
import { CreateResponseDto } from "@/server/application/dtos/book/createResponseDto";
import { UuidGenerator } from "@/server/adapter/utils/uuidGenerator";
import { BookController } from "@/server/adapter/controllers/bookController";
import { type CreateBookInput } from "@/schemas/bookSchema";
import { FindByIdUseCase } from "@/server/application/usecases/book/findByIdUseCase";
import { FindAllUseCase } from "@/server/application/usecases/book/findAllUseCase";
import prisma from "@/lib/prisma";

const bookRepository = new PrismaBookRepository(prisma);
const uuidGenerator = new UuidGenerator();
const createUseCase = new CreateUseCase(bookRepository, uuidGenerator);
const findByIdUseCase = new FindByIdUseCase(bookRepository);
const findAllUseCase = new FindAllUseCase(bookRepository);
const bookController = new BookController(
  createUseCase,
  findByIdUseCase,
  findAllUseCase,
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
