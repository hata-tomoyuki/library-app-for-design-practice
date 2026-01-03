import { BookRepositoryInterface } from "../../../domain/repositories/bookRepositoryInterface";
import { FindAllRequestDto } from "../../dtos/book/findAllRequestDto";
import { FindAllResponseDto } from "../../dtos/book/findAllResponseDto";
import { FindAllUseCaseInterface } from "./findAllUseCaseInterface";

export class FindAllUseCase implements FindAllUseCaseInterface {
  constructor(private readonly bookRepository: BookRepositoryInterface) {}

  async execute(requestDto: FindAllRequestDto): Promise<FindAllResponseDto[]> {
    const foundBooks = await this.bookRepository.findAll();

    if (foundBooks.length === 0) {
      return [];
    }

    return foundBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      publishedAt: book.publishedAt,
      isAvailable: book.isAvailable,
      imageUrl: book.imageUrl,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    }));
  }
}
