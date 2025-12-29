import { Request, Response, NextFunction } from "express";

export type UserRole = "Director" | "Accountant" | "Audit";

export interface User {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | any>;
