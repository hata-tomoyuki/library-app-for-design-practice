"use server";

import { PrismaBookRepository } from "@/server/adapter/repositories/prismaBookRepository";
import { CreateUseCase } from "@/server/application/usecases/book/createUseCase";
import { CreateRequestDto } from "@/server/application/dtos/book/createRequestDto";
import { CreateResponseDto } from "@/server/application/dtos/book/createResponseDto";
import { UuidGenerator } from "@/server/adapter/utils/uuidGenerator";
import prisma from "@/lib/prisma";

const bookRepository = new PrismaBookRepository(prisma);
const uuidGenerator = new UuidGenerator();
const createUseCase = new CreateUseCase(bookRepository, uuidGenerator);

export async function createBook(
  requestDto: CreateRequestDto,
): Promise<CreateResponseDto> {
  try {
    return await createUseCase.execute(requestDto);
  } catch (error) {
    console.error("書籍の作成に失敗しました:", error);
    throw new Error("書籍の作成に失敗しました");
  }
}
