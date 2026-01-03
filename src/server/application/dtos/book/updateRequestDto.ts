export interface UpdateRequestDto {
  id: string;
  title: string;
  author: string;
  publishedAt: Date;
  isAvailable: boolean;
  imageUrl?: string;
  updatedAt: Date;
}
