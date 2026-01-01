import { CreateUseCaseInterface } from "../../application/usecases/book/createUseCaseInterface";
import { CreateRequestDto } from "../../application/dtos/book/createRequestDto";

export class BookController {
  constructor(private readonly createUseCase: CreateUseCaseInterface) {}

  async create(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const requestDto: CreateRequestDto = {
        title: body.title,
        author: body.author,
        publishedAt: new Date(body.publishedAt),
      };
      const book = await this.createUseCase.execute(requestDto);

      return Response.json(book, { status: 201 });
    } catch (error) {
      console.log(error);
      return Response.json(
        { error: "書籍の作成に失敗しました" },
        { status: 500 },
      );
    }
  }
}
