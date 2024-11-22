import { Request, Response, NextFunction } from "express";
import registerValidator from "../../src/middlewares/routeValidators/registerValidator";
import { ValidationError } from "joi";

describe("registerValidator middleware", () => {
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

  test("should pass validation with valid input", async () => {
    mockRequest.body = {
      email: "test@example.com",
      password: "Test1234",
      name: "John",
      surname: "Doe",
    };

    await registerValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith();
  });

  test("should fail validation with invalid email", async () => {
    mockRequest.body = {
      email: "invalid-email",
      password: "Test1234",
      name: "John",
      surname: "Doe",
    };

    await registerValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  test("should fail validation with weak password", async () => {
    mockRequest.body = {
      email: "test@example.com",
      password: "weak",
      name: "John",
      surname: "Doe",
    };

    await registerValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  test("should fail validation with missing required fields", async () => {
    mockRequest.body = {
      email: "test@example.com",
      password: "Test1234",
    };

    await registerValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
  });

  test("should fail validation with invalid password pattern", async () => {
    mockRequest.body = {
      email: "test@example.com",
      password: "12345678", // missing upper and lower case letters
      name: "John",
      surname: "Doe",
    };

    await registerValidator(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});
