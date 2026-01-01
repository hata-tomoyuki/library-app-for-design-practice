import { CreateUseCaseInterface } from "../../application/usecases/book/createUseCaseInterface";
import { CreateRequestDto } from "../../application/dtos/book/createRequestDto";
import { CreateResponseDto } from "../../application/dtos/book/createResponseDto";
import { createBookSchema, type CreateBookInput } from "@/schemas/bookSchema";

export class BookController {
  constructor(private readonly createUseCase: CreateUseCaseInterface) {}

  /**
   * 書籍作成
   * 外部形式（Server Actions形式）をアプリケーション層の形式（CreateRequestDto）に変換し、
   * Zodスキーマでバリデーションを行う
   */
  async create(input: CreateBookInput): Promise<CreateResponseDto> {
    const validatedData = createBookSchema.parse(input);

    const requestDto: CreateRequestDto = {
      title: validatedData.title,
      author: validatedData.author,
      publishedAt: validatedData.publishedAt,
    };

    return await this.createUseCase.execute(requestDto);
  }
}
