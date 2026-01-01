import { CreateUseCaseInterface } from "../../application/usecases/book/createUseCaseInterface";
import { CreateRequestDto } from "../../application/dtos/book/createRequestDto";
import { CreateResponseDto } from "../../application/dtos/book/createResponseDto";

// Server Actionsから受け取る外部形式の型定義
export type CreateBookServerActionInput = {
  title: string;
  author: string;
  publishedAt: string | Date;
};

export class BookController {
  constructor(private readonly createUseCase: CreateUseCaseInterface) {}

  async create(
    input: CreateBookServerActionInput,
  ): Promise<CreateResponseDto> {
    const requestDto: CreateRequestDto = {
      title: input.title,
      author: input.author,
      publishedAt:
        input.publishedAt instanceof Date
          ? input.publishedAt
          : new Date(input.publishedAt),
    };

    return await this.createUseCase.execute(requestDto);
  }

}
