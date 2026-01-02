import { DeleteRequestDto } from "../../dtos/book/deleteRequestDto";
import { DeleteResponseDto } from "../../dtos/book/deleteResponseDto";

export interface DeleteUseCaseInterface {
  execute(requestDto: DeleteRequestDto): Promise<DeleteResponseDto>;
}
