import { hashPassword, comparePassword } from "../../src/utils/passwordUtils";

describe("Password Utils", () => {
  const testPassword = "TestPassword123!";

  describe("hashPassword", () => {
    it("should hash a password successfully", async () => {
      const hashedPassword = await hashPassword(testPassword);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(testPassword);
      expect(typeof hashedPassword).toBe("string");
    });

    it("should generate different hashes for the same password", async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password and hash", async () => {
      const hashedPassword = await hashPassword(testPassword);
      const isMatch = await comparePassword(testPassword, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it("should return false for non-matching password and hash", async () => {
      const hashedPassword = await hashPassword(testPassword);
      const isMatch = await comparePassword(
        "WrongPassword123!",
        hashedPassword
      );
      expect(isMatch).toBe(false);
    });

    it("should handle empty password comparison", async () => {
      const hashedPassword = await hashPassword(testPassword);
      const isMatch = await comparePassword("", hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});
