import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/JwtPayload";

const secretKey = process.env.JWT_SECRET || "default-secret-key";

export const verifyToken = (token: string): JwtPayload | null => {
  return jwt.verify(token, secretKey) as JwtPayload;
};
