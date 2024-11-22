import { getChannel } from "./rabbitmq";
import UserCreated from "./../events/UserCreated";
import UserUpdated from "./../events/UserUpdated";
import logger from "./../utils/logger";
import UserDeleted from "./../events/UserDeleted";

const EXCHANGE = "auth-events";

export async function publishUserCreatedEvent(userCreated: UserCreated) {
  const channel = getChannel();
  const routingKey = "user.created"; // Routing key for the user created event

  // Ensure the exchange exists
  await channel.assertExchange(EXCHANGE, "direct", { durable: true });

  // Publish the event message
  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(userCreated))
  );
  logger.info(`Published UserCreated event: ${JSON.stringify(userCreated)}`);
}

export async function publishUserUpdatedEvent(userUpdated: UserUpdated) {
  const channel = getChannel();
  const routingKey = "user.updated"; // Routing key for the user updated event

  // Ensure the exchange exists
  await channel.assertExchange(EXCHANGE, "direct", { durable: true });

  // Publish the event message
  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(userUpdated))
  );
  logger.info(`Published UserUpdated event: ${JSON.stringify(userUpdated)}`);
}

export async function publishUserDeletedEvent(userDeleted: UserDeleted) {
  const channel = getChannel();
  const routingKey = "user.deleted";

  await channel.assertExchange(EXCHANGE, "direct", { durable: true });

  channel.publish(
    EXCHANGE,
    routingKey,
    Buffer.from(JSON.stringify(userDeleted))
  );
  logger.info(`Published UserDeleted event: ${JSON.stringify(userDeleted)}`);
}
