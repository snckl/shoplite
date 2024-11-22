import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import { UserLoginDto } from "../types/UserLoginDto";
import { UserRegisterDto } from "../types/UserRegisterDto";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginData: UserLoginDto = req.body;
  const token = await AuthService.login(loginData);

  res.setHeader("Authorization", `Bearer ${token}`);

  res.status(200).json({
    status: "success",
    message: "Login successful",
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const registerData: UserRegisterDto = req.body;
  await AuthService.register(registerData);

  res.status(201).json({
    status: "success",
    message: "Registration successful",
  });
};

export default {
  login,
  register,
};
