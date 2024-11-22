import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        productName: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
  totalAmount: Joi.number().positive().required(),
  paymentMethodId: Joi.string().optional(), // OPTIONAL FOR TESTING PURPOSES
});

export const validateCreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await createOrderSchema.validateAsync(req.body);

  next();
};
