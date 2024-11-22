import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    logger.info(`[${method}] ${url} ${res.statusCode} - ${duration}ms `);
  });

  next();
};

export default loggerMiddleware;
