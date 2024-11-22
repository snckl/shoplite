import { Request, Response } from "express";
import ProductService from "../services/ProductService";
import Joi from "joi/lib";

export const getAllProducts = async (req: Request, res: Response) => {
  const page = req.query.page === undefined ? 1 : +req.query.page;

  const products = await ProductService.getAllProducts(page);
  res.status(200).json({
    status: "success",
    data: {
      page: page,
      count: products.length,
      products,
    },
  });
};

export const createProduct = async (req: Request, res: Response) => {
  await ProductService.createProduct(req.body);
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  await ProductService.updateProduct(req.params.id, req.body);
  res.status(204).json();
};

export const deleteProduct = async (req: Request, res: Response) => {
  await ProductService.deleteProduct(req.params.id);
  res.status(204).json();
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await ProductService.getProductById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

export const getProductsByCategoryName = async (
  req: Request,
  res: Response
) => {
  const page = req.query.page === undefined ? 1 : +req.query.page;

  const products = await ProductService.getProductsByCategoryName(
    req.params.name,
    page
  );

  res.status(200).json({
    status: "success",
    data: {
      page,
      count: products.length,
      products,
    },
  });
};
