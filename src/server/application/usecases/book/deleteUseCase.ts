import { BookRepositoryInterface } from "../../../domain/repositories/bookRepositoryInterface";
import { Book } from "../../../domain/entities/book";
import { DeleteRequestDto } from "../../dtos/book/deleteRequestDto";
import { DeleteResponseDto } from "../../dtos/book/deleteResponseDto";
import { DeleteUseCaseInterface } from "./deleteUseCaseInterface";

export class DeleteUseCase implements DeleteUseCaseInterface {
  constructor(private readonly bookRepository: BookRepositoryInterface) {}

  async execute(requestDto: DeleteRequestDto): Promise<DeleteResponseDto> {
    const id = requestDto.id;

    const existingBook: Book | null = await this.bookRepository.findById(id);

    if (!existingBook) {
      throw new Error("書籍が見つかりません");
    }

    await this.bookRepository.delete(id);

    return {
      id: existingBook.id,
      title: existingBook.title,
      author: existingBook.author,
      publishedAt: existingBook.publishedAt,
      isAvailable: existingBook.isAvailable,
      imageUrl: existingBook.imageUrl,
      createdAt: existingBook.createdAt,
      updatedAt: existingBook.updatedAt,
    };
  }
}
