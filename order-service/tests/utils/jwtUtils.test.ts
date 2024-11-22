import jwt from "jsonwebtoken";
import { verifyToken } from "../../src/utils/jwtUtils";
import { JwtPayload } from "../../src/types/JwtPayload";

jest.mock("jsonwebtoken");

describe("verifyToken", () => {
  const secretKey = process.env.JWT_SECRET || "default-secret-key";
  const mockToken = "mockToken";
  const mockPayload: JwtPayload = {
    userId: "12345",
    iat: 1609459200,
    email: "test@example.com",
    role: "CUSTOMER",
  };

  it("should return payload when token is valid", () => {
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

    const result = verifyToken(mockToken);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, secretKey);
    expect(result).toEqual(mockPayload);
  });

  it("should return null when token is invalid", () => {
    (jwt.verify as jest.Mock).mockImplementation(() => null);

    const result = verifyToken(mockToken);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, secretKey);
    expect(result).toBeNull();
  });
});
