import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";
import { NotFoundException } from "../exceptions/NotFoundException";
import { NotAuthorizedException } from "./../exceptions/NotAuthorizedException";

interface HttpError extends Error {
  status?: number;
  details?: ValidationError["details"];
}

const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let name = "InternalServerError";
  let message = "Internal Server Error";
  const formatValidationError = (details: ValidationError["details"]) => {
    return details.map((detail) => detail.message.replace(/"/g, "")).join(", ");
  };

  if (err instanceof ValidationError) {
    status = 400;
    name = "Validation Error";
    message = formatValidationError(err.details) || "Validation Error";
  } else if (err instanceof NotFoundException) {
    status = 404;
    name = "NotFoundException";
    message = err.message || "Not Found";
  } else if (err instanceof NotAuthorizedException) {
    status = 403;
    name = "NotAuthorizedException";
    message = err.message || "Not Authorized";
  } else {
    status = err.status || 500;
    name = err.name || "InternalServerError";
    message = err.message || "Internal Server Error";
  }

  const errorResponse: Record<string, any> = {
    name,
    message,
    status,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development" && err.stack) {
    errorResponse.stack = err.stack;
    errorResponse.headers = req.headers;
  }

  res.status(status).json(errorResponse);
};

export default errorHandler;
