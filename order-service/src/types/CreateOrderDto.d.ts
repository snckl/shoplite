export default interface CreateOrderDto {
  userId: string;
  email: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethodId: string;
}
