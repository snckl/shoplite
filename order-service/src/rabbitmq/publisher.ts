import { getChannel } from "./rabbitmq";
import logger from "./../utils/logger";
import type { OrderCreated } from "./../events/OrderCreated";

const EXCHANGE = "order-events";
const routingKey = "order-created-queue";

export const publishOrderCreatedEvent = async (order: OrderCreated) => {
  try {
    const channel = getChannel();
    await channel.assertExchange(EXCHANGE, "direct", { durable: true });
    const message = JSON.stringify(order);
    // Consider adding a routing key for more flexible routing
    channel.publish(EXCHANGE, routingKey, Buffer.from(message), {
      persistent: true, // Ensure message survives broker restart
    });
    logger.info(`Order event published: ${message}`);
  } catch (error: any) {
    logger.error(`Failed to publish order event: ${error.message}`);
    // Consider adding error handling strategy (retry, fallback)
    throw error; // Optional: rethrow to allow caller to handle
  }
};
