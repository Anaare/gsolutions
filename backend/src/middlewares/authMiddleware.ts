import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

interface CustomRequest extends Request {
  user?: UserDocument;
}

export const protect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;

    //   1. Get token from headers
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      iat: number;
    };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // 4) Check if user has updated their password
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        currentUser.passwordChangedAt.getTime() / 1000
      );
      if (decoded.iat < changedTimestamp) {
        return next(
          new AppError(
            "User recently changed password! Please log in again.",
            401
          )
        );
      }
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  }
);
