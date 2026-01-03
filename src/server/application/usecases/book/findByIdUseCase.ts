import { BookRepositoryInterface } from "../../../domain/repositories/bookRepositoryInterface";
import { Book } from "../../../domain/entities/book";
import { FindByIdRequestDto } from "../../dtos/book/findByIdRequestDto";
import { FindByIdResponseDto } from "../../dtos/book/findByIdResponseDto";
import { FindByIdUseCaseInterface } from "./findByIdUseCaseInterface";

export class FindByIdUseCase implements FindByIdUseCaseInterface {
  constructor(private readonly bookRepository: BookRepositoryInterface) {}

  async execute(requestDto: FindByIdRequestDto): Promise<FindByIdResponseDto> {
    const id = requestDto.id;

    const foundBook = await this.bookRepository.findById(id);

    if (!foundBook) {
      throw new Error("書籍が見つかりませんでした");
    }

    return {
      id: foundBook.id,
      title: foundBook.title,
      author: foundBook.author,
      publishedAt: foundBook.publishedAt,
      isAvailable: foundBook.isAvailable,
      imageUrl: foundBook.imageUrl,
      createdAt: foundBook.createdAt,
      updatedAt: foundBook.updatedAt,
    };
  }
}
