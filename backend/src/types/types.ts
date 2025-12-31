import { Request, Response, NextFunction } from "express";

export type UserRole = "Director" | "Accountant" | "Audit";

export type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | any>;

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

export interface Employee {
  firstName: string;
  lastName: string;
  personalId: string;
  email?: string;
  position: string;
  grossSalary: number;
  employeePension: number;
  employerPension: number;
  incomeTax: number;
  netSalary: number;
  createdAt?: Date;
  updatedAt?: Date;
  active?: boolean;
  _id?: string;
}
