import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError } from "joi";

export const updateProductSchema = Joi.object({
  price: Joi.number().positive().min(1).optional(),
  stock: Joi.number().min(0).optional(),
  categoryId: Joi.string().optional(),
});

export const validateUpdateProduct = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    await updateProductSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      next(error);
    } else {
      next(error);
    }
  }
};
