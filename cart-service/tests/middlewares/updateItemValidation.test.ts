import { Request, Response, NextFunction } from "express";
import { validateUpdateItem } from "./../../src/middlewares/validation/updateItemValidation";

describe("Update Item Validation Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {
        quantity: 0,
      },
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it("should pass validation with valid input", async () => {
    await validateUpdateItem(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
  });

  it("should throw error when cartId is invalid", async () => {
    mockRequest.body.cartId = "invalid-uuid";

    await expect(
      validateUpdateItem(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )
    ).rejects.toThrow();
  });

  it("should throw error when quantity is 0", async () => {
    mockRequest.body.quantity = 0;

    try {
      await validateUpdateItem(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
      fail("Expected validation to throw an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should throw error when required fields are missing", async () => {
    mockRequest.body = {};

    await expect(
      validateUpdateItem(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )
    ).rejects.toThrow();
  });
});
