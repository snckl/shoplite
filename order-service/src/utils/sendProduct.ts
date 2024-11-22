import { OrderItem, OrderStatus } from ".prisma/client";
import sendEmail from "./emailUtils";
import prisma from "./../config/database";
import styleEmail from "./stylingUtils";

// This method simulates digital product delivery for case study of octopus
// Not a real world usage
const sendDigitalProduct = async (
  email: string,
  orderItems: OrderItem[]
): Promise<void> => {
  console.log(`Sending digital product to ${email}`);
  const items: { productName: string; quantity: number }[] = [];
  orderItems.forEach((item) => {
    console.log(`Product: ${item.productName}, Quantity: ${item.quantity}`);
    items.push({ productName: item.productName, quantity: item.quantity });
  });

  // Create a styled HTML email for the products
  const emailHtml: string = styleEmail(items);

  await sendEmail({
    to: email,
    subject: "Digital product delivery from ShopLite",
    text: `Thank you for your purchase! Here are your digital products: ${items
      .map((item) => `${item.productName} - Quantity: ${item.quantity}`)
      .join(", ")}`,
    html: emailHtml,
  });

  // Update order status to DELIVERED after sending the digital product
  await prisma.order.update({
    where: { id: orderItems[0].orderId },
    data: { status: OrderStatus.DELIVERED }, // Use enum here
  });
};

export default sendDigitalProduct;
