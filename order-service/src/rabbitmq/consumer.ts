import { ProductUpdated } from "./../events/ProductUpdated";
import logger from "./../utils/logger";
import { getChannel } from "./rabbitmq";

const EXCHANGE = "product-events";
const QUEUE = "product_updated_queue";
const ROUTING_KEY = "product.updated";

export async function consumeProductUpdatedEvent() {
  const channel = getChannel();

  await channel.assertExchange(EXCHANGE, "direct", { durable: true });
  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

  channel.consume(QUEUE, async (msg) => {
    if (msg !== null) {
      const productUpdated: ProductUpdated = JSON.parse(msg.content.toString());
      logger.info(
        `Consumed ProductUpdated event: ${JSON.stringify(productUpdated)}`
      );
      // Process the productUpdated event here
      console.log("Product updated event consumed: ", productUpdated);

      channel.ack(msg);
    }
  });

  logger.info(`Waiting for messages in queue: ${QUEUE}`);
}
