export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
}
