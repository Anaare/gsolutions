import { RequestHandler } from "express";

export const getAllUsers: RequestHandler = (req, res, next) => {
  res.status(200).json({ status: "success" });
};
