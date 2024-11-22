import { Request, Response, NextFunction } from "express";
import { validateAddItem } from "../../src/middlewares/validation/addItemValidation";
import { v4 as uuidv4 } from "uuid";

describe("validateAddItem middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should pass validation with valid item data", async () => {
    const validItem = {
      productId: uuidv4(),
      name: "Test Product",
      description: "Test Description",
      imageUri: "https://example.com/image.jpg",
      price: 99.99,
      quantity: 1,
    };

    mockRequest.body = validItem;

    await validateAddItem(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should throw error when productId is invalid", async () => {
    const invalidItem = {
      productId: "invalid-uuid",
      name: "Test Product",
      description: "Test Description",
      price: 99.99,
      quantity: 1,
    };

    mockRequest.body = invalidItem;

    await expect(
      validateAddItem(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )
    ).rejects.toThrow();
  });

  it("should throw error when required fields are missing", async () => {
    const invalidItem = {
      productId: uuidv4(),
      name: "Test Product",
      // missing description
      price: 99.99,
      quantity: 1,
    };

    mockRequest.body = invalidItem;

    await expect(
      validateAddItem(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )
    ).rejects.toThrow();
  });

  it("should throw error when quantity is less than 1", async () => {
    const invalidItem = {
      productId: uuidv4(),
      name: "Test Product",
      description: "Test Description",
      price: 99.99,
      quantity: 0,
    };

    mockRequest.body = invalidItem;

    await expect(
      validateAddItem(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )
    ).rejects.toThrow();
  });

  it("should pass validation when imageUri is not provided", async () => {
    const validItem = {
      productId: uuidv4(),
      name: "Test Product",
      description: "Test Description",
      price: 99.99,
      quantity: 1,
    };

    mockRequest.body = validItem;

    await validateAddItem(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
  });
});
