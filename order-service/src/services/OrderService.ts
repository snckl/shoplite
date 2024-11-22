import prisma from "./../config/database";
import CreateOrderDto from "../types/CreateOrderDto";
import { NotFoundException } from "./../exceptions/NotFoundException";
import { FetchOrderDto } from "../types/FetchOrderDto";
import { publishOrderCreatedEvent } from "./../rabbitmq/publisher";
import { OrderStatus } from "@prisma/client";
import { JwtPayload } from "JwtPayload";
import paymentUtil from "./../utils/paymentUtils";
import sendDigitalProduct from "./../utils/sendProduct";

class OrderService {
  public async createOrder(
    payload: JwtPayload,
    data: CreateOrderDto
  ): Promise<string> {
    const { userId, email } = payload;
    const { items, totalAmount } = data;

    let order;

    // 1. Create the order in the database
    order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: OrderStatus.PENDING, // Correct enum reference
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    // 2. Process payment with Stripe
    const paymentIntent = await paymentUtil(totalAmount, email, order.id);

    // 3. Update order status to PAID
    await prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.PAID, paymentId: paymentIntent.id },
    });

    // 4. Simulate digital product delivery (send via email)
    await sendDigitalProduct(email, order.orderItems);

    // 5. Publish order created event for external systems
    await publishOrderCreatedEvent({
      id: order.id,
      userId: order.userId,
      orderedItems: order.orderItems.map((orderItem) => ({
        itemId: orderItem.productId,
        itemName: orderItem.productName,
        quantity: orderItem.quantity,
      })),
      totalAmount: order.totalAmount.toNumber(),
      createdAt: order.createdAt,
    });

    return order.id;
  }

  public async getOrderById(orderId: string): Promise<FetchOrderDto> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
        delivery: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found with provided identifier.");
    }

    return {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount.toNumber(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item) => ({
        itemId: item.id,
        itemName: item.productName,
        quantity: item.quantity,
        price: item.price.toNumber(),
      })),
    };
  }

  public async getUserOrders(userId: string): Promise<FetchOrderDto[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
        delivery: true,
      },
    });

    if (!orders.length) {
      throw new NotFoundException("No orders found for the provided user.");
    }

    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount.toNumber(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item) => ({
        itemId: item.id,
        itemName: item.productName,
        quantity: item.quantity,
        price: item.price.toNumber(),
      })),
    }));
  }
}

export default new OrderService();
