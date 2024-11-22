export default interface AddItemDto {
  productId: string;
  name: string;
  description: string;
  imageUri?: string;
  price: number;
  quantity: number;
}
