import jwt from "jsonwebtoken";
import { verifyToken } from "../../src/utils/jwtUtils";
import { JwtPayload } from "../../src/types/JwtPayload";

jest.mock("jsonwebtoken");

describe("verifyToken", () => {
  const secretKey = process.env.JWT_SECRET || "default-secret-key";
  const mockToken = "mockToken";
  const mockPayload: JwtPayload = {
    userId: "123",
    iat: 1234567890,
    email: "test@example.com",
    role: "ADMIN",
  };

  it("should return the decoded payload when the token is valid", () => {
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

    const result = verifyToken(mockToken);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, secretKey);
    expect(result).toEqual(mockPayload);
  });

  it("should return null when the token is invalid", () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      return null;
    });

    const result = verifyToken(mockToken);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, secretKey);
    expect(result).toBeNull();
  });
});
