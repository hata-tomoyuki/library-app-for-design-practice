import { BookRepositoryInterface } from "../../../domain/repositories/bookRepositoryInterface";
import { Book } from "../../../domain/entities/book";
import { CreateRequestDto } from "../../dtos/book/createRequestDto";
import { CreateResponseDto } from "../../dtos/book/createResponseDto";
import { CreateUseCaseInterface } from "./createUseCaseInterface";
import { IdGeneratorInterface } from "@/domain/utils/idGeneratorInterface";

export class CreateUseCase implements CreateUseCaseInterface {
  constructor(
    private readonly bookRepository: BookRepositoryInterface,
    private idGenerator: IdGeneratorInterface,
  ) {}

  async execute(requestDto: CreateRequestDto): Promise<CreateResponseDto> {
    const id = this.idGenerator.generate();
    const newBook = new Book(
      id,
      requestDto.title,
      requestDto.author,
      requestDto.publishedAt,
    );

    const createdBook = await this.bookRepository.create(newBook);

    return {
      id: createdBook.id,
      title: createdBook.title,
      author: createdBook.author,
      publishedAt: createdBook.publishedAt,
      createdAt: createdBook.createdAt,
      updatedAt: createdBook.updatedAt,
    };
  }
}
