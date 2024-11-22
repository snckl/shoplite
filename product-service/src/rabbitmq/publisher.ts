import { getChannel } from "./rabbitmq";
import logger from "./../utils/logger";
import { ProductCreated } from "./../events/ProductCreated";
import { ProductDeleted } from "./../events/ProductDeleted";
import { ProductUpdated } from "./../events/ProductUpdated";

const EXCHANGE = "product-events";

export async function publishProductCreatedEvent(
  productCreated: ProductCreated
) {
  const channel = getChannel();
  const routingKey = "product.created";

  await channel.assertExchange(EXCHANGE, "direct", { durable: true });

  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(productCreated))
  );
  logger.info(
    `Published ProductCreated event: ${JSON.stringify(productCreated)}`
  );
}

export async function publishProductDeletedEvent(
  productDeleted: ProductDeleted
) {
  const channel = getChannel();
  const routingKey = "product.deleted";

  await channel.assertExchange(EXCHANGE, "direct", { durable: true });

  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(productDeleted))
  );
  logger.info(
    `Published ProductDeleted event: ${JSON.stringify(productDeleted)}`
  );
}

export async function publishProductUpdatedEvent(
  productUpdated: ProductUpdated
) {
  const channel = getChannel();
  const routingKey = "product.updated";

  await channel.assertExchange(EXCHANGE, "direct", { durable: true });

  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(productUpdated))
  );
  logger.info(
    `Published ProductUpdated event: ${JSON.stringify(productUpdated)}`
  );
}
