import OrderItemDto from "./OrderItemDto";

export interface FetchOrderDto {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemDto[];
}
export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum DeliveryStatus {
  PENDING,
  SENT,
  FAILED,
  REFUNDED,
}
