import amqp from "amqplib";

let connection: amqp.Connection;
let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost:5672"
    );
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    process.exit(1); // Exit the process if RabbitMQ connection fails
  }
}

export function getChannel() {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized.");
  }
  return channel;
}
