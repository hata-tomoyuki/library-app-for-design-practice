import { CreateUseCaseInterface } from "../../application/usecases/book/createUseCaseInterface";
import { CreateRequestDto } from "../../application/dtos/book/createRequestDto";
import { CreateResponseDto } from "../../application/dtos/book/createResponseDto";
import {
  createBookSchema,
  type CreateBookInput,
  updateBookSchema,
  type UpdateBookInput,
} from "@/schemas/bookSchema";
import { FindByIdResponseDto } from "@/server/application/dtos/book/findByIdResponseDto";
import { FindByIdRequestDto } from "@/server/application/dtos/book/findByIdRequestDto";
import { FindByIdUseCaseInterface } from "../../application/usecases/book/findByIdUseCaseInterface";
import { FindAllResponseDto } from "@/server/application/dtos/book/findAllResponseDto";
import { FindAllRequestDto } from "@/server/application/dtos/book/findAllRequestDto";
import { FindAllUseCaseInterface } from "../../application/usecases/book/findAllUseCaseInterface";
import { UpdateUseCaseInterface } from "@/server/application/usecases/book/updateUseCaseInterface";
import { UpdateResponseDto } from "@/server/application/dtos/book/updateResponseDto";
import { UpdateRequestDto } from "@/server/application/dtos/book/updateRequestDto";
import { DeleteUseCaseInterface } from "@/server/application/usecases/book/deleteUseCaseInterface";

export class BookController {
  constructor(
    private readonly createUseCase: CreateUseCaseInterface,
    private readonly findByIdUseCase: FindByIdUseCaseInterface,
    private readonly findAllUseCase: FindAllUseCaseInterface,
    private readonly updateUseCase: UpdateUseCaseInterface,
    private readonly deleteUseCase: DeleteUseCaseInterface,
  ) {}

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

  /**
   * 書籍をidで検索
   */
  async findById(input: FindByIdRequestDto): Promise<FindByIdResponseDto> {
    return await this.findByIdUseCase.execute(input);
  }

  /**
   * 全ての書籍を取得
   */
  async findAll(input: FindAllRequestDto): Promise<FindAllResponseDto[]> {
    return await this.findAllUseCase.execute(input);
  }

  /**
   * 書籍を更新
   * 外部形式（Server Actions形式）をアプリケーション層の形式（UpdateRequestDto）に変換し、
   * Zodスキーマでバリデーションを行う
   */
  async update(input: UpdateBookInput): Promise<UpdateResponseDto> {
    const validatedData = updateBookSchema.parse(input);

    const requestDto: UpdateRequestDto = {
      id: validatedData.id,
      title: validatedData.title,
      author: validatedData.author,
      publishedAt: validatedData.publishedAt,
      updatedAt: new Date(),
    };

    return await this.updateUseCase.execute(requestDto);
  }

  /**
   * 書籍を削除
   */
  async delete(id: string) {
    return await this.deleteUseCase.execute({ id });
  }
}
