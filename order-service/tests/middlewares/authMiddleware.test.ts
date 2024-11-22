import { Request, Response, NextFunction } from "express";
import authMiddleware from "../../src/middlewares/authMiddleware";
import { verifyToken } from "../../src/utils/jwtUtils";

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
      authMiddleware("CUSTOMER")(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow("You are not logged in.");
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should throw NotAuthorizedException when invalid token is provided", () => {
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer invalid-token");
    (verifyToken as jest.Mock).mockReturnValue(null);

    expect(() => {
      authMiddleware("CUSTOMER")(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow("Invalid token.");
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should allow access when user has ADMIN role regardless of required role", () => {
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer valid-token");
    (verifyToken as jest.Mock).mockReturnValue({ role: "ADMIN" });

    authMiddleware("CUSTOMER")(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.currentUser).toEqual({ role: "ADMIN" });
  });

  it("should allow access when user has required role", () => {
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer valid-token");
    (verifyToken as jest.Mock).mockReturnValue({ role: "CUSTOMER" });

    authMiddleware("CUSTOMER")(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.currentUser).toEqual({ role: "CUSTOMER" });
  });

  it("should throw NotAuthorizedException when user does not have required role", () => {
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer valid-token");
    (verifyToken as jest.Mock).mockReturnValue({ role: "CUSTOMER" });

    expect(() => {
      authMiddleware("ADMIN")(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow("Access denied. Requires role: ADMIN");
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
