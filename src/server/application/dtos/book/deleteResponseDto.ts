export interface DeleteResponseDto {
  id: string;
  title: string;
  author: string;
  publishedAt: Date;
  isAvailable: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
