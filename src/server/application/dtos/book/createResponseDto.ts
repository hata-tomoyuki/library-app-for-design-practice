export interface CreateResponseDto {
  id: string;
  title: string;
  author: string;
  publishedAt: Date;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
