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
        isAvailable: true,
        imageUrl: book.imageUrl ?? "/image/no-image.png",
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
    });

    return new Book(
      createdBook.id,
      createdBook.title,
      createdBook.author,
      createdBook.publishedAt,
      createdBook.isAvailable,
      createdBook.imageUrl ?? "/image/no-image.png",
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
      foundBook.isAvailable,
      foundBook.imageUrl ?? "/image/no-image.png",
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
          book.isAvailable,
          book.imageUrl ?? "/image/no-image.png",
          book.createdAt,
          book.updatedAt,
        ),
    );
  }

  async update(book: Book): Promise<Book> {
    const updatedBook = await this.prisma.book.update({
      where: { id: book.id },
      data: {
        title: book.title,
        author: book.author,
        publishedAt: book.publishedAt,
        isAvailable: book.isAvailable,
        imageUrl: book.imageUrl ?? "/image/no-image.png",
        updatedAt: book.updatedAt,
      },
    });

    return new Book(
      updatedBook.id,
      updatedBook.title,
      updatedBook.author,
      updatedBook.publishedAt,
      updatedBook.isAvailable,
      updatedBook.imageUrl ?? "/image/no-image.png",
      updatedBook.createdAt,
      updatedBook.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.book.delete({
      where: { id },
    });
  }
}
