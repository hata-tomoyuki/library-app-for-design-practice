import { CreateRequestDto } from "../../dtos/book/createRequestDto";
import { CreateResponseDto } from "../../dtos/book/createResponseDto";

export interface CreateUseCaseInterface {
  execute(requestDto: CreateRequestDto): Promise<CreateResponseDto>;
}
