import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.js";

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(
        new AppError(error, StatusCodes.INTERNAL_SERVER_ERROR)
      );
    });
  };
};

export const globalErrorHandling = (error, req, res, next) => {
  return process.env.MODE == "development" ? res.status(error.statusCode || 400).json({
    error: error.message,
    stack: error.stack,
  }) : res.status(error.statusCode || 400).json({ error: error.message });
};