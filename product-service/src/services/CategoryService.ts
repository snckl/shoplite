import { FetchCategoryDto } from "../types/category/FetchCategoryDto";
import prisma from "../config/database";
import { CreateCategoryDto } from "../types/category/CreateCategoryDto";
import { UpdateCategoryDto } from "../types/category/UpdateCategoryDto";
import { NotFoundException } from "../exceptions/NotFoundException";

class CategoryService {
  async getAllCategories(): Promise<FetchCategoryDto[]> {
    return await prisma.category.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        imageUri: true,
        createdAt: true,
      },
    });
  }

  async createCategory(categoryData: CreateCategoryDto) {
    await prisma.category.create({
      data: {
        name: categoryData.name.toLowerCase(),
        description: categoryData.description,
        imageUri: categoryData.imageUri,
      },
    });
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDto) {
    const category = await prisma.category.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!category) {
      throw new NotFoundException(
        `Category not found with provided identifier}`
      );
    }

    await prisma.category.update({
      where: { id: id },
      data: categoryData,
    });
  }

  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id, isDeleted: false },
    });

    if (!category) {
      throw new NotFoundException(
        `Category not found with provided identifier`
      );
    }

    await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

export default new CategoryService();
