import { describe, expect, jest, test, beforeEach } from "@jest/globals";
import AuthService from "../../src/services/AuthService";
import prisma from "../../src/config/database";
import { UserRegisterDto } from "../../src/types/UserRegisterDto";
import { UserLoginDto } from "../../src/types/UserLoginDto";
import { AlreadyExistException } from "../../src/exceptions/AlreadyExistException";
import { InvalidCredentialsException } from "../../src/exceptions/InvalidCredentialsException";
import * as passwordUtils from "../../src/utils/passwordUtils";
import * as jwtUtils from "../../src/utils/jwtUtils";
import * as publisher from "../../src/rabbitmq/publisher";

jest.mock("./../../src/config/database", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("./../../src/rabbitmq/publisher");
jest.mock("./../../src/utils/jwtUtils");

describe("AuthService", () => {
  const mockUser = {
    id: "test-uuid",
    email: "test@test.com",
    firstName: "Test",
    lastName: "User",
    password: "hashedPassword",
    role: "CUSTOMER" as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    concurrencyStamp: "test-stamp",
  };

  const registerDto: UserRegisterDto = {
    email: "test@test.com",
    password: "password123",
    name: "Test",
    surname: "User",
  };

  const loginDto: UserLoginDto = {
    email: "test@test.com",
    password: "password123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    test("should register new user successfully", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);
      jest.spyOn(prisma.user, "create").mockResolvedValue(mockUser);
      jest
        .spyOn(passwordUtils, "hashPassword")
        .mockResolvedValue("hashedPassword");
      jest.spyOn(publisher, "publishUserCreatedEvent").mockResolvedValue();

      const result = await AuthService.register(registerDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(passwordUtils.hashPassword).toHaveBeenCalledWith(
        registerDto.password
      );
      expect(prisma.user.create).toHaveBeenCalled();
      expect(publisher.publishUserCreatedEvent).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test("should throw AlreadyExistException if user exists", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);

      await expect(AuthService.register(registerDto)).rejects.toThrow(
        AlreadyExistException
      );
    });
  });

  describe("login", () => {
    test("should login successfully and return token", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);
      jest.spyOn(passwordUtils, "comparePassword").mockResolvedValue(true);
      jest.spyOn(jwtUtils, "generateToken").mockReturnValue("mock-token");

      const result = await AuthService.login(loginDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: loginDto.email,
          isActive: true,
        },
      });
      expect(passwordUtils.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password
      );
      expect(jwtUtils.generateToken).toHaveBeenCalled();
      expect(result).toBe("mock-token");
    });

    test("should throw InvalidCredentialsException if user not found", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      await expect(AuthService.login(loginDto)).rejects.toThrow(
        InvalidCredentialsException
      );
    });

    test("should throw InvalidCredentialsException if password is invalid", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);
      jest.spyOn(passwordUtils, "comparePassword").mockResolvedValue(false);

      await expect(AuthService.login(loginDto)).rejects.toThrow(
        InvalidCredentialsException
      );
    });
  });
});
