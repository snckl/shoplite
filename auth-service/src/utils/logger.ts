import { createLogger, format, transports } from "winston";
import * as process from "process";

// Log format
const logFormat = format.printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} - ${level.toUpperCase()}: ${stack || message}`;
});

// Logger Instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: "auth-service" },
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    logFormat
  ),
  transports: [
    new transports.File({ filename: "./../../logs/auth-service.log" }),
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), logFormat),
    }),
  ],
});

export default logger;
