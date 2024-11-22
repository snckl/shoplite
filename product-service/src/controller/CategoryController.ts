import { Request, Response } from "express";
import CategoryService from "../services/CategoryService";

// Didn't implement pagination for categories
export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories();
  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
};

export const createCategory = async (req: Request, res: Response) => {
  await CategoryService.createCategory(req.body);
  res.status(201).json({
    status: "success",
    message: "category created successfully",
  });
};

export const updateCategory = async (req: Request, res: Response) => {
  const categoryData = req.body;
  await CategoryService.updateCategory(req.params.id, categoryData);

  res.status(204).json();
};

export const deleteCategory = async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id);

  res.status(204).json();
};
