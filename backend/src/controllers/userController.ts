import { RequestHandler } from "express";
import User from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllUsers: RequestHandler = catchAsync(
  async (req, res, next) => {
    const users = await User.find();
    res
      .status(200)
      .json({ status: "success", result: users.length, data: { users } });
  }
);

export const getUser: RequestHandler = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError("No user found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

export const updateOneUser: RequestHandler = catchAsync(
  async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // 1. Return the modified document (original by default)
      runValidators: true, // 2. Ensures the update follows Schema rules
    });

    if (!updatedUser)
      return next(new AppError("Update was not completed", 404));

    res.status(200).json({
      status: "success",
      data: { updatedUser },
    });
  }
);

export const deleteUser: RequestHandler = catchAsync(async (req, res, next) => {
  const userToDelete = await User.findByIdAndDelete(req.params.id);

  if (!userToDelete)
    return next(new AppError("No user found with that ID", 404));
  res.status(204).send();
});
