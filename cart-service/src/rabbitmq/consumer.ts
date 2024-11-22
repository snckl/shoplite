import { ProductUpdated } from "./../events/ProductUpdated";
import { ProductDeleted } from "./../events/ProductDeleted";
import { getChannel } from "./../rabbitmq/rabbitmq"; // Adjust the import path as necessary
import logger from "./../utils/logger"; // Adjust the import path as necessary
import CartService from "./../services/CartService";

const EXCHANGE = "product-events";
const QUEUE = "product_deleted_queue";

export async function consumeProductDeletedEvent() {
  const routingKey = "product.deleted";
  const channel = getChannel();
  await channel.assertExchange(EXCHANGE, "direct", { durable: true });
  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE, routingKey);

  channel.consume(QUEUE, (msg) => {
    if (msg !== null) {
      const productDeleted: ProductDeleted = JSON.parse(msg.content.toString());

      // CONSUME EVENT HERE
      CartService.deleteProduct(productDeleted.id);

      logger.info(
        `Consumed ProductDeleted event: ${JSON.stringify(productDeleted)}`
      );
      channel.ack(msg);
    }
  });

  logger.info(`Consumer for ProductDeleted event started`);
}

export async function consumeProductUpdatedEvent() {
  const routingKey = "product.updated";
  const channel = getChannel();

  await channel.assertExchange(EXCHANGE, "direct", { durable: true });
  await channel.assertQueue(QUEUE, { durable: true });
  await channel.bindQueue(QUEUE, EXCHANGE, routingKey);

  channel.consume(QUEUE, (msg) => {
    if (msg !== null) {
      const productUpdated: ProductUpdated = JSON.parse(msg.content.toString());

      // CONSUME EVENT HERE
      CartService.updateProduct(productUpdated);

      logger.info(
        `Consumed ProductDeleted event: ${JSON.stringify(productUpdated)}`
      );
      channel.ack(msg);
    }
  });

  logger.info(`Consumer for productUpdated event started`);
}
