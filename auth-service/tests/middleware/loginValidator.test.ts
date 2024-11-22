import { Request, Response, NextFunction } from "express";
import loginValidator from "../../src/middlewares/routeValidators/loginValidator";

describe("Login Validator Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it("should pass validation with valid email and password", async () => {
    mockRequest.body = {
      email: "test@example.com",
      password: "password123",
    };

    await loginValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith();
  });

  it("should fail validation with invalid email", async () => {
    mockRequest.body = {
      email: "invalid-email",
      password: "password123",
    };

    await loginValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.arrayContaining([
          expect.objectContaining({
            message: "Please provide a valid email address",
          }),
        ]),
      })
    );
  });

  it("should fail validation with missing email", async () => {
    mockRequest.body = {
      password: "password123",
    };

    await loginValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.arrayContaining([
          expect.objectContaining({
            message: "Email is required",
          }),
        ]),
      })
    );
  });

  it("should fail validation with short password", async () => {
    mockRequest.body = {
      email: "test@example.com",
      password: "12345",
    };

    await loginValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.arrayContaining([
          expect.objectContaining({
            message: "Password must be at least 6 characters long",
          }),
        ]),
      })
    );
  });

  it("should fail validation with missing password", async () => {
    mockRequest.body = {
      email: "test@example.com",
    };

    await loginValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.arrayContaining([
          expect.objectContaining({
            message: "Password is required",
          }),
        ]),
      })
    );
  });
});
