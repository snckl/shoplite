import app from "./app";
import { connectRabbitMQ } from "./rabbitmq/rabbitmq";
import logger from "./utils/logger";
import prisma from "./config/database";
import { consumeOrderCreatedEvent } from "./rabbitmq/consumer";

const PORT = process.env.PORT;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Connected to PostgreSQL");

    await connectRabbitMQ();
    await consumeOrderCreatedEvent();
    logger.info("Connected to RabbitMQ");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to a service:");

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    process.exit(1);
  }
}

startServer();
