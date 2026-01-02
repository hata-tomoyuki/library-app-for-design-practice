import { FindAllRequestDto } from '../../dtos/book/findAllRequestDto';
import { FindAllResponseDto } from '../../dtos/book/findAllResponseDto';

export interface FindAllUseCaseInterface {
  execute(requestDto: FindAllRequestDto): Promise<FindAllResponseDto[]>;
}
