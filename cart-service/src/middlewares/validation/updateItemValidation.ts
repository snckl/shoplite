import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const updateItemSchema = Joi.object({
  quantity: Joi.number().required(),
});

export const validateUpdateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await updateItemSchema.validateAsync(req.body);

  next();
};
