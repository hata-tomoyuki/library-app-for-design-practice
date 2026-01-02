import { UpdateRequestDto } from "../../dtos/book/updateRequestDto";
import { UpdateResponseDto } from "../../dtos/book/updateResponseDto";

export interface UpdateUseCaseInterface {
  execute(requestDto: UpdateRequestDto): Promise<UpdateResponseDto>;
}
