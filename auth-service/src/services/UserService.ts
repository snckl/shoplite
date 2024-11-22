import prisma from "./../config/database";
import { NotFoundException } from "./../exceptions/NotFoundException";
import Joi from "joi";
import { UserUpdateDto } from "../types/UserUpdateDto";
import { UserFetchDto } from "../types/UserFetchDto";
import { v4 as uuid } from "uuid";
import {
  publishUserDeletedEvent,
  publishUserUpdatedEvent,
} from "../rabbitmq/publisher";

/**
 * @class UserService
 * @description Service class for managing user-related operations.
 **/
class UserService {
  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to a UserFetchDto object containing user details.
   * @throws NotFoundException if the user is not found or the identifier is invalid.
   */
  async getUser(id: string): Promise<UserFetchDto> {
    const { error } = Joi.string().uuid().validate(id);

    if (error) {
      // This message especially written to prevent attackers.
      throw new NotFoundException(`User not found with identifier`);
    }

    const user = await prisma.user.findUnique({
      where: { id, isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found with identifier`);
    }

    return user;
  }

  /**
   * Updates a user's details by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @param userData - An object containing the updated user details.
   * @returns A promise that resolves when the user has been updated.
   * @throws NotFoundException if the user is not found or inactive.
   */
  async updateUser(id: string, userData: UserUpdateDto): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { isActive: true, concurrencyStamp: true },
    });

    if (!user || !user.isActive) {
      throw new NotFoundException(`User not found or inactive with identifier`);
    }

    const updatedUser = await prisma.user.update({
      where: { id, concurrencyStamp: user.concurrencyStamp },
      data: {
        firstName: userData.name,
        lastName: userData.surname,
        concurrencyStamp: uuid(),
      },
    });

    await publishUserUpdatedEvent({
      userId: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
    });
  }

  /**
   * Deactivates a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves when the user has been deactivated.
   * @throws NotFoundException if the user is not found or inactive.
   */
  async deleteUser(id: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id, isActive: true },
    });
    if (!user || !user.isActive) {
      throw new NotFoundException(`User not found with identifier`);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    await publishUserDeletedEvent({
      userId: updatedUser.id,
      email: updatedUser.email,
    });
  }

  /**
   * Retrieves a list of all users.
   *
   * @returns A promise that resolves to an array of UserFetchDto objects containing user details.
   */
  async listUsers(page: number = 1): Promise<UserFetchDto[]> {
    await Joi.number().min(1).validateAsync(page);

    return await prisma.user.findMany({
      skip: (page - 1) * 10,
      take: 10,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export default new UserService();
