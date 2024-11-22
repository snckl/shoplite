import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError } from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(8).required(),
  imageUri: Joi.string().uri().optional(),
});

export const validateCreateCategory = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    await createCategorySchema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      _res.status(400).json({
        errors: error.details.map((detail) => ({
          msg: detail.message,
        })),
      });
    } else {
      next(error);
    }
  }
};
