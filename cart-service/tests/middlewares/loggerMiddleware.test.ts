import { Request, Response, NextFunction } from "express";
import logger from "../../src/utils/logger";
import loggerMiddleware from "../../src/middlewares/loggerMiddleware";

jest.mock("../../src/utils/logger");

describe("loggerMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: "GET",
      url: "/test",
    };
    mockResponse = {
      statusCode: 200,
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "finish") callback();
      }),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it("should log request details when request finishes", () => {
    // Arrange
    const startTime = Date.now();
    jest
      .spyOn(Date, "now")
      .mockReturnValueOnce(startTime)
      .mockReturnValueOnce(startTime + 100);

    // Act
    loggerMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.on).toHaveBeenCalledWith(
      "finish",
      expect.any(Function)
    );
    expect(logger.info).toHaveBeenCalledWith("[GET] /test 200 - 100ms ");
  });

  it("should call next middleware", () => {
    // Act
    loggerMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(nextFunction).toHaveBeenCalled();
  });
});
