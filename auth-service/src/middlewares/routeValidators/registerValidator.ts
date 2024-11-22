import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "Password is required",
    }),

  name: Joi.string().required().messages({
    "any.required": "First name is required",
  }),

  surname: Joi.string().required().messages({
    "any.required": "Last name is required",
  }),
});

const registerValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await registerSchema.validateAsync(req.body, {
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

export default registerValidator;
