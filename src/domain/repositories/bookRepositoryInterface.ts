import { Book } from "../entities/book";

export interface BookRepositoryInterface {
  create(book: Book): Promise<Book>;
  // findById(id: string): Promise<Book | null>;
  // Define other repository methods as needed
}
