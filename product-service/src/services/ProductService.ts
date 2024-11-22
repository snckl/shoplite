import { CreateProductDto } from "../types/product/CreateProductDto";
import prisma from "../config/database";
import Joi from "joi/lib";
import { NotFoundException } from "../exceptions/NotFoundException";
import {
  publishProductCreatedEvent,
  publishProductDeletedEvent,
  publishProductUpdatedEvent,
} from "../rabbitmq/publisher";
import { UpdateProductDto } from "../types/product/UpdateProductDto";
import { FetchProductDto } from "product/FetchProductDto";

class ProductService {
  async getAllProducts(page: number): Promise<FetchProductDto[]> {
    await Joi.number().positive().min(1).validateAsync(page);

    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
  }

  async createProduct(productData: CreateProductDto) {
    const { categoryId, ...product } = productData;

    const productFromDb = await prisma.product.create({
      data: {
        ...product,
        category: { connect: { id: categoryId } },
      },
    });

    await publishProductCreatedEvent({
      id: productFromDb.id,
      name: productFromDb.name,
      description: productFromDb.description,
      categoryId: productFromDb.categoryId,
      stock: productFromDb.stock,
      price: productFromDb.price.toNumber(),
      createdAt: productFromDb.createdAt.toISOString(),
      updatedAt: productFromDb.updatedAt.toISOString(),
    });
  }

  async updateProduct(
    id: string,
    productData: UpdateProductDto
  ): Promise<void> {
    // Validate ID input
    await Joi.string().required().validateAsync(id);

    // Check if the product exists and is not deleted
    const product = await prisma.product.findUnique({
      where: { id, isDeleted: false },
    });

    if (!product) {
      throw new NotFoundException(
        `Product not found with provided identifier: ${id}`
      );
    }

    if (productData.stock !== undefined && productData.stock !== null) {
      if (productData.stock + product.stock >= 0) {
        productData.stock = productData.stock + product.stock;
      } else {
        await publishProductUpdatedEvent({
          id: product.id,
          name: product.name,
          price: product.price.toNumber(),
          stock: product.stock,
          updatedAt: product.updatedAt.toISOString(),
        });
      }
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        stock: productData.stock,
        price: productData.price,
        categoryId: productData.categoryId,
      },
    });

    // Publish the product updated event
    await publishProductUpdatedEvent({
      id: updatedProduct.id,
      name: updatedProduct.name, // Fixed the typo
      price: updatedProduct.price.toNumber(),
      stock: updatedProduct.stock,
      updatedAt: updatedProduct.updatedAt.toISOString(),
    });
  }

  async deleteProduct(id: string) {
    // Validate ID input
    await Joi.string().required().validateAsync(id);

    // Fetch the product and ensure it exists
    const product = await prisma.product.findUnique({
      where: { id, isDeleted: false },
    });

    if (!product) {
      throw new NotFoundException(
        `Product not found with provided identifier: ${id}`
      );
    }

    // Soft delete the product
    await prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    // Publish the deletion event
    await publishProductDeletedEvent({
      id,
      timestamp: new Date().toISOString(),
    });
  }

  async getProductById(id: string): Promise<FetchProductDto> {
    await Joi.string().required().validateAsync(id);

    const product = await prisma.product.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Product not found with provided identifier: ${id}`
      );
    }

    return {
      ...product,
      price: product.price.toNumber(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  async getProductsByCategoryName(
    categoryName: string,
    page: number
  ): Promise<FetchProductDto[]> {
    await Joi.string().min(2).validateAsync(categoryName);
    await Joi.number().positive().min(1).validateAsync(page);

    const category = await prisma.category.findUnique({
      where: { name: categoryName, isDeleted: false },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundException(
        `Category not found with provided name: ${categoryName}`
      );
    }

    const products = await prisma.product.findMany({
      where: { isDeleted: false, categoryId: category.id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: (page - 1) * 10, // Assuming 10 products per page
      take: 10,
    });

    return products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));
  }
}
export default new ProductService();
