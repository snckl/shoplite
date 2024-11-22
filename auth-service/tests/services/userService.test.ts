import UserService from "../../src/services/UserService";
import prisma from "../../src/config/database";
import { NotFoundException } from "../../src/exceptions/NotFoundException";
import { UserUpdateDto } from "../../src/types/UserUpdateDto";
import { UserFetchDto } from "../../src/types/UserFetchDto";
import * as publisher from "../../src/rabbitmq/publisher";

jest.mock("./../../src/config/database", () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
}));

jest.mock("./../../src/rabbitmq/publisher");

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should return user when valid id is provided", async () => {
      const mockUser: UserFetchDto = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getUser(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it("should throw NotFoundException when invalid uuid is provided", async () => {
      await expect(UserService.getUser("invalid-uuid")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const mockUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        isActive: true,
        concurrencyStamp: "stamp",
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
      };

      const updateData: UserUpdateDto = {
        name: "Jane",
        surname: "Smith",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        firstName: updateData.name,
        lastName: updateData.surname,
      });

      await UserService.updateUser(mockUser.id, updateData);
      expect(publisher.publishUserUpdatedEvent).toHaveBeenCalled();
    });
  });

  describe("listUsers", () => {
    it("should return paginated users", async () => {
      const mockUsers: UserFetchDto[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "test1@test.com",
          firstName: "John",
          lastName: "Doe",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await UserService.listUsers(1);
      expect(result).toEqual(mockUsers);
    });

    it("should throw error when page number is invalid", async () => {
      await expect(UserService.listUsers(0)).rejects.toThrow();
    });
  });

  describe("deleteUser", () => {
    it("should deactivate user successfully", async () => {
      const mockUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        isActive: true,
        email: "test@test.com",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await UserService.deleteUser(mockUser.id);
      expect(publisher.publishUserDeletedEvent).toHaveBeenCalled();
    });
  });
});
