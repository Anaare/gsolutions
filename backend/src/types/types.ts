import { Request, Response, NextFunction } from "express";

export type UserRole = "Director" | "Accountant" | "Audit";

export interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  passwordChangedAt?: Date;
  comparePassword(candidate: string): Promise<boolean>;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createPasswordResetToken(): string;
  active?: boolean;
  _id?: string;
}

export type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | any>;
