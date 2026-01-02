import { PrismaClient } from "@/generated/prisma/client";
import { Book } from "../../domain/entities/book";
import { BookRepositoryInterface } from "../../domain/repositories/bookRepositoryInterface";

export class PrismaBookRepository implements BookRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async create(book: Book): Promise<Book> {
    const createdBook = await this.prisma.book.create({
      data: {
        id: book.id,
        title: book.title,
        author: book.author,
        publishedAt: book.publishedAt,
        isAvailable: false,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
    });

    return new Book(
      createdBook.id,
      createdBook.title,
      createdBook.author,
      createdBook.publishedAt,
      createdBook.createdAt,
      createdBook.updatedAt,
    );
  }

  async findById(id: string): Promise<Book | null> {
    const foundBook = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!foundBook) return null;

    return new Book(
      foundBook.id,
      foundBook.title,
      foundBook.author,
      foundBook.publishedAt,
      foundBook.createdAt,
      foundBook.updatedAt,
    );
  }

  async findAll(): Promise<Book[]> {
    const foundBooks = await this.prisma.book.findMany();

    if (foundBooks.length === 0) {
      return [];
    }

    return foundBooks.map(
      (book) =>
        new Book(
          book.id,
          book.title,
          book.author,
          book.publishedAt,
          book.createdAt,
          book.updatedAt,
        ),
    );
  }
}

