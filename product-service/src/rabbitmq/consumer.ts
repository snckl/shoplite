import { getChannel } from "./rabbitmq";
import logger from "./../utils/logger";
import { OrderCreated } from "./../events/OrderCreated";
import ProductService from "./../services/ProductService";

const EXCHANGE = "order-events";
const QUEUE = "order-created-queue";
const routingKey = "order-created-queue";

export const consumeOrderCreatedEvent = async () => {
  try {
    const channel = getChannel();

    // Adding error handling for channel retrieval
    if (!channel) {
      logger.error("Failed to get RabbitMQ channel");
      return;
    }

    await channel.assertExchange(EXCHANGE, "direct", { durable: true });
    await channel.assertQueue(QUEUE, {
      durable: true,
      deadLetterExchange: "order-events-dlx",
    });

    // Consider adding a dead letter queue configuration
    await channel.assertExchange("order-events-dlx", "direct", {
      durable: true,
    });
    await channel.assertQueue(`${QUEUE}.dlq`, {
      durable: true,
    });

    await channel.bindQueue(QUEUE, EXCHANGE, routingKey);

    // Consider adding a connection/channel error handler
    channel.on("error", (err) => {
      logger.error("Channel error:", err);
    });

    channel.prefetch(1);

    channel.consume(
      QUEUE,
      async (msg) => {
        if (msg !== null) {
          try {
            const order: OrderCreated = JSON.parse(msg.content.toString());
            logger.info(`Order event received: ${JSON.stringify(order)}`);

            const itemUpdatePromises = order.orderedItems.map(async (item) => {
              try {
                logger.info(
                  `Processing item: ${item.itemName} - Quantity: ${item.quantity}`
                );
                await ProductService.updateProduct(item.itemId, {
                  stock: -item.quantity,
                });
              } catch (itemError: any) {
                logger.error(
                  `Failed to update item ${item.itemId}: ${itemError.message}`
                );
                throw itemError;
              }
            });

            await Promise.all(itemUpdatePromises);
            channel.ack(msg);
          } catch (processError: any) {
            logger.error(
              `Failed to process order event: ${processError.message}`
            );
            channel.nack(msg, false, false); // Requeue the message
          }
        }
      },
      {
        noAck: false,
      }
    );

    logger.info(`Waiting for messages in ${QUEUE}`);
  } catch (error: any) {
    logger.error(`Failed to set up order event consumer: ${error.message}`);
    throw error;
  }
};
