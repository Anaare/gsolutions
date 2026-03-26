import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;

  // 23505 = Unique Violation (e.g., email already exists)
  if (err.code === "23505") {
    error.statusCode = 400;
    error.message = "This record already exists. Please use a different value.";
  }

  // 23503 = Foreign Key Violation (e.g., trying to delete an employee with active projects)
  if (err.code === "23503") {
    error.statusCode = 400;
    error.message =
      "This item is linked to other data and cannot be modified/deleted.";
  }

  // Standard Error Setup
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  res.status(statusCode).json({
    status,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
