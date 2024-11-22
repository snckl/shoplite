export interface FetchCategoryDto {
  id: string;
  name: string;
  description: string;
  imageUri?: string | null;
  createdAt: Date;
}
