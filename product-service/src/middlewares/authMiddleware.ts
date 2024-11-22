import { Request, Response, NextFunction } from "express";
import { NotAuthorizedException } from "./../exceptions/NotAuthorizedException";
import { JwtPayload } from "../types/JwtPayload";
import { verifyToken } from "./../utils/jwtUtils";

declare module "express" {
  export interface Request {
    currentUser?: JwtPayload;
  }
}

const authMiddleware =
  (requiredRole: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new NotAuthorizedException("You are not logged in.");
    }

    const decoded: JwtPayload | null = verifyToken(token) as JwtPayload;

    if (decoded === null) {
      throw new NotAuthorizedException("Invalid token.");
    }

    req.currentUser = decoded;

    if (decoded.role === "ADMIN") {
      return next();
    }

    if (decoded.role !== requiredRole) {
      throw new NotAuthorizedException(
        `Access denied. Requires role: ${requiredRole}`
      );
    }

    next();
  };

export default authMiddleware;
