import { BookRepositoryInterface } from "../../../domain/repositories/bookRepositoryInterface";
import { Book } from "../../../domain/entities/book";
import { UpdateRequestDto } from "../../dtos/book/updateRequestDto";
import { UpdateResponseDto } from "../../dtos/book/updateResponseDto";
import { UpdateUseCaseInterface } from "./updateUseCaseInterface";

export class UpdateUseCase implements UpdateUseCaseInterface {
  constructor(private readonly bookRepository: BookRepositoryInterface) {}

  async execute(requestDto: UpdateRequestDto): Promise<UpdateResponseDto> {
    const id = requestDto.id;

    const existingBook = await this.bookRepository.findById(id);

    const updatedBook = new Book(
      existingBook ? existingBook.id : id,
      requestDto.title,
      requestDto.author,
      requestDto.publishedAt,
      requestDto.isAvailable,
      requestDto.imageUrl,
      existingBook ? existingBook.createdAt : new Date(),
      new Date(),
    );

    const savedBook = await this.bookRepository.update(updatedBook);

    return {
      id: savedBook.id,
      title: savedBook.title,
      author: savedBook.author,
      publishedAt: savedBook.publishedAt,
      isAvailable: savedBook.isAvailable,
      imageUrl: savedBook.imageUrl,
      createdAt: savedBook.createdAt,
      updatedAt: savedBook.updatedAt,
    };
  }
}
