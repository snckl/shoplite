import { Request, Response, NextFunction } from "express";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";
import { JwtPayload } from "../types/JwtPayload";
import { verifyToken } from "./../utils/jwtUtils";

declare module "express" {
  export interface Request {
    currentUser?: JwtPayload;
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new NotAuthorizedException("You are not logged in.");
  }

  const decoded = verifyToken(token) as JwtPayload;

  if (decoded === null) {
    throw new NotAuthorizedException("Invalid token.");
  }

  req.currentUser = decoded;
  next();
};

export default authMiddleware;
