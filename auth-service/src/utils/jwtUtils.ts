import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/JwtPayload";

const secretKey = process.env.JWT_SECRET || "default-secret-key";
const expiresIn = process.env.JWT_EXPIRE || "1h";

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload | null => {
  return jwt.verify(token, secretKey) as JwtPayload;
};
