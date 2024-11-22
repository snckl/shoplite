import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const addItemSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  imageUri: Joi.string().uri().optional(),
  price: Joi.number().precision(2).required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const validateAddItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await addItemSchema.validateAsync(req.body);

  next();
};
