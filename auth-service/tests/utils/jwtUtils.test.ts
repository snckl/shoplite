import { generateToken, verifyToken } from "../../src/utils/jwtUtils";
import jwt from "jsonwebtoken";

describe("JWT Utils", () => {
  const mockPayload = {
    userId: "123",
    email: "test@test.com",
    role: "user",
  };

  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      const token = generateToken(mockPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should generate token with correct payload", () => {
      const token = generateToken(mockPayload);
      const decoded = jwt.decode(token) as any;
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });
  });

  describe("verifyToken", () => {
    it("should verify and decode a valid token", () => {
      const token = generateToken(mockPayload);
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(mockPayload.userId);
      expect(decoded?.email).toBe(mockPayload.email);
      expect(decoded?.role).toBe(mockPayload.role);
    });

    it("should throw error for invalid token", () => {
      expect(() => {
        verifyToken("invalid-token");
      }).toThrow();
    });
  });
});
