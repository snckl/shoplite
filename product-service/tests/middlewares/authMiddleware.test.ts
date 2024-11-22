import { Request, Response, NextFunction } from "express";
import authMiddleware from "../../src/middlewares/authMiddleware";
import { verifyToken } from "../../src/utils/jwtUtils";
import { NotAuthorizedException } from "../../src/exceptions/NotAuthorizedException";

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
      authMiddleware("USER")(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow(NotAuthorizedException);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should throw NotAuthorizedException when invalid token is provided", () => {
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer invalid-token");
    (verifyToken as jest.Mock).mockReturnValue(null);

    expect(() => {
      authMiddleware("USER")(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow(NotAuthorizedException);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should allow access when user has ADMIN role regardless of required role", () => {
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer valid-token");
    (verifyToken as jest.Mock).mockReturnValue({ role: "ADMIN" });

    authMiddleware("USER")(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.currentUser).toEqual({ role: "ADMIN" });
  });

  it("should allow access when user has required role", () => {
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer valid-token");
    (verifyToken as jest.Mock).mockReturnValue({ role: "USER" });

    authMiddleware("USER")(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.currentUser).toEqual({ role: "USER" });
  });

  it("should throw NotAuthorizedException when user does not have required role", () => {
    (mockRequest.header as jest.Mock).mockReturnValue("Bearer valid-token");
    (verifyToken as jest.Mock).mockReturnValue({ role: "USER" });

    expect(() => {
      authMiddleware("MANAGER")(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );
    }).toThrow(NotAuthorizedException);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
