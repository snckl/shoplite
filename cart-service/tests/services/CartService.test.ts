import CartService from "../../src/services/CartService";
import prisma from "../../src/config/database";
import { NotFoundException } from "../../src/exceptions/NotFoundException";
import { v4 as uuid } from "uuid";

jest.mock("../../src/config/database", () => ({
  $transaction: jest.fn(),
  cart: {
    upsert: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

describe("CartService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addItem", () => {
    const userId = uuid();
    const addItemDto = {
      productId: uuid(),
      name: "Test Product",
      description: "Test Description",
      imageUri: "test.jpg",
      price: 10,
      quantity: 2,
    };

    it("should create new cart and add item when cart doesn't exist", async () => {
      const mockNewCart = { id: uuid(), userId, total: 0 };
      const mockUpdatedCart = {
        ...mockNewCart,
        total: addItemDto.price * addItemDto.quantity,
      };

      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          return callback(prisma);
        }
      );

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.cart.create as jest.Mock).mockResolvedValue(mockNewCart);
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.cartItem.create as jest.Mock).mockResolvedValue({
        id: uuid(),
        ...addItemDto,
        cartId: mockNewCart.id,
      });
      (prisma.cart.update as jest.Mock).mockResolvedValue(mockUpdatedCart);

      const result = await CartService.addItem(userId, addItemDto);

      expect(result).toEqual(mockUpdatedCart);
      expect(prisma.cart.create).toHaveBeenCalledWith({
        data: { userId: userId, total: 0 },
      });
      expect(prisma.cartItem.create).toHaveBeenCalledWith({
        data: {
          name: addItemDto.name,
          description: addItemDto.description,
          imageUri: addItemDto.imageUri,
          price: addItemDto.price,
          quantity: addItemDto.quantity,
          productId: addItemDto.productId,
          cartId: mockNewCart.id,
        },
      });
      expect(prisma.cart.update).toHaveBeenCalledWith({
        where: { userId: userId },
        data: { total: addItemDto.price * addItemDto.quantity },
      });
    });

    it("should update quantity if item exists", async () => {
      const mockCart = { id: userId, userId, total: 0 };
      const existingItem = {
        id: uuid(),
        cartId: userId,
        productId: addItemDto.productId,
        quantity: 1,
      };

      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          return callback(prisma);
        }
      );

      (prisma.cart.upsert as jest.Mock).mockResolvedValue(mockCart);
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(existingItem);
      (prisma.cart.update as jest.Mock).mockResolvedValue({
        ...mockCart,
        total: mockCart.total + addItemDto.price * addItemDto.quantity,
      });

      const result = await CartService.addItem(userId, addItemDto);

      expect(result).toEqual({
        ...mockCart,
        total: mockCart.total + addItemDto.price * addItemDto.quantity,
      });
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + addItemDto.quantity },
      });
      expect(prisma.cart.update).toHaveBeenCalledWith({
        where: { userId: userId },
        data: {
          total: mockCart.total + addItemDto.price * addItemDto.quantity,
        },
      });
    });

    it("should throw error for invalid userId", async () => {
      await expect(
        CartService.addItem("invalid-uuid", addItemDto)
      ).rejects.toThrow();
    });
  });

  describe("removeItem", () => {
    const userId = uuid();
    const cartItemId = uuid();

    it("should remove item from cart", async () => {
      const mockCartItem = {
        id: cartItemId,
        cartId: userId,
        price: 10,
        quantity: 2,
      };

      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValueOnce(
        mockCartItem
      );
      (prisma.cartItem.delete as jest.Mock).mockResolvedValueOnce({
        id: cartItemId,
        cartId: userId,
      });
      (prisma.cart.update as jest.Mock).mockResolvedValueOnce({
        id: userId,
        total: 80, // Example cart total after decrement
      });
      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          return callback(prisma);
        }
      );

      const result = await CartService.removeItem(cartItemId, userId);

      expect(result).toEqual({
        id: userId,
        total: 80,
      });
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: cartItemId },
      });
      expect(prisma.cart.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { total: { decrement: 20 } },
      });
    });

    it("should throw NotFoundException when item not found", async () => {
      (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(CartService.removeItem(cartItemId, userId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("clearCart", () => {
    const userId = uuid();

    it("should clear all items from cart", async () => {
      const mockCart = { id: userId, userId, total: 100 };

      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          return callback(prisma);
        }
      );

      await CartService.clearCart(userId);

      expect(prisma.cartItem.deleteMany).toHaveBeenCalled();
      expect(prisma.cart.update).toHaveBeenCalledWith({
        where: { id: mockCart.id },
        data: { total: 0 },
      });
    });

    it("should throw NotFoundException when cart not found", async () => {
      (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(CartService.clearCart(userId)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
