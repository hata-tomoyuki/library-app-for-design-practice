import { FindByIdRequestDto } from '../../dtos/book/findByIdRequestDto';
import { FindByIdResponseDto } from '../../dtos/book/findByIdResponseDto';

export interface FindByIdUseCaseInterface {
  execute(requestDto: FindByIdRequestDto): Promise<FindByIdResponseDto>;
}
