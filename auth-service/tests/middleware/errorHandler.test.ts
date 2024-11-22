import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";
import errorHandler from "../../src/middlewares/errorHandler";
import { AlreadyExistException } from "../../src/exceptions/AlreadyExistException";
import { NotAuthorizedException } from "../../src/exceptions/NotAuthorizedException";
import { NotFoundException } from "../../src/exceptions/NotFoundException";
import { InvalidCredentialsException } from "../../src/exceptions/InvalidCredentialsException";
import { Prisma } from "@prisma/client";

describe("errorHandler middleware", () => {
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
          message: '"username" is required',
          path: ["username"],
          type: "any.required",
          context: { key: "username", label: "username" },
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
        message: "username is required",
      })
    );
  });

  it("should handle InvalidCredentialsException", () => {
    const error = new InvalidCredentialsException("Invalid password");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 401,
        name: "InvalidCredentialsException",
        message: "Invalid password",
      })
    );
  });

  it("should handle NotFoundException", () => {
    const error = new NotFoundException("User not found");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        name: "NotFoundException",
        message: "User not found",
      })
    );
  });

  it("should handle AlreadyExistException", () => {
    const error = new AlreadyExistException("Email already exists");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 409,
        name: "AlreadyExistException",
        message: "Email already exists",
      })
    );
  });

  it("should handle NotAuthorizedException", () => {
    const error = new NotAuthorizedException("Access denied");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 403,
        name: "NotAuthorizedException",
        message: "Access denied",
      })
    );
  });

  it("should handle PrismaClientKnownRequestError", () => {
    const error = new Prisma.PrismaClientKnownRequestError("Conflict", {
      code: "P2002",
      clientVersion: "2.19.0",
    });

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 409,
        name: "ClientKnownRequestError",
        message: "Concurrency conflict, please try again.",
      })
    );
  });

  it("should handle unknown errors", () => {
    const error = new Error("Unknown error");

    errorHandler(
      error,
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
});
