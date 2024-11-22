import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError } from "joi";

const createProductSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(8).required(),
  price: Joi.number().positive().required(),
  categoryId: Joi.string().required(),
  stock: Joi.number().min(0).required(),
  imageUri: Joi.string().uri().optional(),
});

export const validateCreateProduct = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    await createProductSchema.validateAsync(req.body, {
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
