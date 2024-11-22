import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";
import errorHandler from "../../src/middlewares/errorHandler";
import { NotFoundException } from "../../src/exceptions/NotFoundException";
import { NotAuthorizedException } from "../../src/exceptions/NotAuthorizedException";

describe("Error Handler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: "GET",
      originalUrl: "/test",
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should handle ValidationError", () => {
    const validationError = new ValidationError(
      "Validation failed",
      [
        {
          message: '"name" is required',
          path: ["name"],
          type: "any.required",
        },
      ],
      null
    );

    errorHandler(
      validationError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        name: "Validation Error",
        message: "name is required",
      })
    );
  });

  it("should handle NotFoundException", () => {
    const notFoundError = new NotFoundException("Resource not found");

    errorHandler(
      notFoundError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        name: "NotFoundException",
        message: "Resource not found",
      })
    );
  });

  it("should handle NotAuthorizedException", () => {
    const notAuthorizedError = new NotAuthorizedException(
      "Not authorized to access"
    );

    errorHandler(
      notAuthorizedError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 403,
        name: "NotAuthorizedException",
        message: "Not authorized to access",
      })
    );
  });

  it("should handle unknown errors", () => {
    const unknownError = new Error("Unknown error");

    errorHandler(
      unknownError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 500,
        name: "Error",
        message: "Unknown error",
      })
    );
  });

  it("should include stack trace in development environment", () => {
    process.env.NODE_ENV = "development";
    const error = new Error("Test error");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String),
        headers: expect.any(Object),
      })
    );
  });
});
