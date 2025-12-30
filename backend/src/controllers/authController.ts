import { RequestHandler } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/User.js";

export const signUp: RequestHandler = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});
