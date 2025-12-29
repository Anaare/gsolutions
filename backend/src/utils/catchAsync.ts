import { RequestHandler } from "express";
import { AsyncFunction } from "../types/types.js";

export const catchAsync = (fn: AsyncFunction): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
