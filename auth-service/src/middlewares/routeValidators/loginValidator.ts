import { Request, Response, NextFunction } from "express";
import Joi, { ValidationError } from "joi";

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

const loginValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await loginSchema.validateAsync(req.body, {
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

export default loginValidator;
