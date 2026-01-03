export interface CreateRequestDto {
  title: string;
  author: string;
  publishedAt: Date;
  isAvailable: boolean;
  imageUrl?: string;
}
