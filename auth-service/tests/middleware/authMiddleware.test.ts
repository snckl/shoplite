import { Request, Response, NextFunction } from "express";
import authMiddleware from "../../src/middlewares/authMiddleware";
import { NotAuthorizedException } from "../../src/exceptions/NotAuthorizedException";
import * as jwtUtils from "./../../src/utils/jwtUtils";

jest.mock("../../src/utils/jwtUtils");

describe("authMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      header: jest.fn(),
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it("should throw NotAuthorizedException when no token is provided", () => {
    (mockRequest.header as jest.Mock).mockReturnValue(undefined);

    expect(() => {
      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow(NotAuthorizedException);
    expect(() => {
      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow("You are not logged in.");
  });

  it("should throw NotAuthorizedException when token is invalid", () => {
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer invalid-token");
    (jwtUtils.verifyToken as jest.Mock).mockReturnValue(null);

    expect(() => {
      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow(NotAuthorizedException);
    expect(() => {
      authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow("Invalid token.");
  });

  it("should set currentUser and call next() when token is valid", () => {
    const mockDecodedToken = { userId: "123", email: "test@test.com" };
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer valid-token");
    (jwtUtils.verifyToken as jest.Mock).mockReturnValue(mockDecodedToken);

    authMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockRequest.currentUser).toEqual(mockDecodedToken);
    expect(nextFunction).toHaveBeenCalled();
  });
});
