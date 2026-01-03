export interface UpdateRequestDto {
  id: string;
  title: string;
  author: string;
  publishedAt: Date;
  isAvailable: boolean;
  updatedAt: Date;
}
