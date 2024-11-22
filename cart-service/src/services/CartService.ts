import AddItemDto from "../types/AddItemDto";
import prisma from "./../config/database";
import Joi from "joi/lib";
import { NotFoundException } from "./../exceptions/NotFoundException";
import { ValidationError } from "joi";
import { ProductUpdated } from "./../events/ProductUpdated";

// Might look over-fetching but it's better to keep for data clarity and use at orders
class CartService {
  async addItem(userId: string, addItem: AddItemDto) {
    await Joi.string().uuid().validateAsync(userId);
    let finalCart;

    // Using transaction for a single request to the DB
    await prisma.$transaction(async (prisma) => {
      // First try to find existing cart
      finalCart = await prisma.cart.findUnique({
        where: { userId: userId },
      });

      // If cart doesn't exist, create it
      if (!finalCart) {
        finalCart = await prisma.cart.create({
          data: { userId: userId, total: 0 },
        });
      }

      // Check if the cart item already exists
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: finalCart.id,
          productId: addItem.productId,
        },
      });

      let updatedTotal = finalCart.total;

      if (cartItem) {
        // Update quantity if item already exists
        await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity: cartItem.quantity + addItem.quantity },
        });
        updatedTotal += addItem.price * addItem.quantity;
      } else {
        // Create new cart item if not found
        await prisma.cartItem.create({
          data: {
            name: addItem.name,
            description: addItem.description,
            imageUri: addItem.imageUri,
            price: addItem.price,
            quantity: addItem.quantity,
            productId: addItem.productId,
            cartId: finalCart.id,
          },
        });
        updatedTotal += addItem.price * addItem.quantity;
      }

      // Update total cost in the cart
      finalCart = await prisma.cart.update({
        where: { userId: userId },
        data: { total: updatedTotal },
      });
    });

    return finalCart;
  }

  async removeItem(cartItemId: string, userId: string) {
    await Joi.string().uuid().required().validateAsync(cartItemId);

    const cartItemFromDb = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId: userId },
      },
    });

    if (!cartItemFromDb) {
      throw new NotFoundException(
        `Cart item not found with the provided identifier`
      );
    }

    // Calculate the cost of the item being removed
    const itemTotal = Number(cartItemFromDb.price) * cartItemFromDb.quantity;
    let finalCart;

    await prisma.$transaction(async (prisma) => {
      // Remove the item from the cart
      const cartItem = await prisma.cartItem.delete({
        where: { id: cartItemId },
      });

      // Update the cart total
      finalCart = await prisma.cart.update({
        where: { id: cartItem.cartId },
        data: {
          total: {
            decrement: itemTotal,
          },
        },
      });
    });

    return finalCart;
  }

  // DİKKAT!
  // The quantity is how much to add or subtract
  // In order to decrease requests to back-end
  // Front-end should wait a little for exact quantity on UI
  async updateItem(cartItemId: string, quantity: number) {
    const cartItemFromDb = await prisma.cartItem.findFirst({
      where: { id: cartItemId },
    });

    if (!cartItemFromDb) {
      throw new NotFoundException(
        `Cart item not found with the provided identifier`
      );
    }

    const newQuantity = cartItemFromDb.quantity + quantity;

    if (newQuantity < 0) {
      throw new ValidationError(
        "Quantity can not be less than 0",
        [
          {
            message: "Quantity can not make current quantity less than 0",
            path: ["quantity"],
            type: "number.min",
          },
        ],
        "quantity"
      );
    }

    const cartId = cartItemFromDb.cartId;

    const cartFromDb = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cartFromDb) {
      throw new NotFoundException(`Cart not found with identifier`);
    }

    const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

    const oldTotal = roundToTwoDecimals(
      cartItemFromDb.price.toNumber() * cartItemFromDb.quantity
    );
    let cart;

    await prisma.$transaction(async (prisma) => {
      if (newQuantity === 0) {
        // Delete the cart item if the quantity becomes 0
        await prisma.cartItem.delete({
          where: { id: cartItemId },
        });

        // Adjust the cart total
        cart = await prisma.cart.update({
          where: { id: cartId },
          data: {
            total: {
              decrement: oldTotal,
            },
          },
        });
      } else {
        const newTotal = roundToTwoDecimals(
          cartItemFromDb.price.toNumber() * newQuantity
        );

        // Update the cart item quantity
        await prisma.cartItem.update({
          where: { id: cartItemId },
          data: { quantity: newQuantity },
        });

        // Update the cart total
        cart = await prisma.cart.update({
          where: { id: cartId },
          data: {
            total: {
              increment: roundToTwoDecimals(newTotal - oldTotal),
            },
          },
        });
      }
    });

    return cart;
  }

  async getItems(userId: string) {
    // Validate input
    await Joi.string().uuid().validateAsync(userId);

    // First try to find the cart
    let cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        items: true,
      },
    });

    // If cart doesn't exist, create it
    if (!cart) {
      try {
        cart = await prisma.cart.create({
          data: {
            userId: userId,
            total: 0,
          },
          include: {
            items: true,
          },
        });
      } catch (error: any) {
        // If creation fails due to race condition, try to fetch again
        if (error.code === "P2002") {
          cart = await prisma.cart.findUnique({
            where: {
              userId: userId,
            },
            include: {
              items: true,
            },
          });
        } else {
          throw error;
        }
      }
    }

    if (!cart) {
      throw new Error("Failed to fetch or create cart");
    }

    return cart;
  }

  // Keeping this userId for future use with events
  async clearCart(userId: string) {
    await Joi.string().uuid().validateAsync(userId);

    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!cart) {
      throw new NotFoundException(
        `Cart not found with the provided identifier`
      );
    }

    let finalCart;

    // Use a transaction for consistency
    await prisma.$transaction(async (prisma) => {
      // Delete all cart items
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      // Reset the total cost of the cart to 0
      finalCart = await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          total: 0,
        },
      });
    });

    return finalCart;
  }

  // EVENT-ONLY FUNCTION
  async deleteProduct(productId: string) {
    await prisma.cart.deleteMany({
      where: {
        items: {
          some: {
            productId: productId,
          },
        },
      },
    });
    console.log("Deleted cart items with productId: ", productId);
  }

  // EVENT-ONLY FUNCTION
  async updateProduct(product: ProductUpdated) {
    await prisma.cartItem.updateMany({
      where: {
        productId: product.id,
      },
      data: {
        price: product.price,
        name: product.name,
      },
    });
    console.log("Updated cart items with productId: ", product.id);
  }
}

export default new CartService();
