export interface JwtPayload {
  userId: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  iat?: number;
  exp?: number;
}
