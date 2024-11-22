export interface OrderCreated {
  id: string;
  userId: string;
  orderedItems: OrderedItem[];
  totalAmount: number;
  createdAt: Date;
}

export interface OrderedItem {
  itemId: string;
  itemName: string;
  quantity: number;
}
