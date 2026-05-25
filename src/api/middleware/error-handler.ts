import type { ErrorRequestHandler } from "express";
import { AppError } from "../../shared/errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
    return;
  }
  console.error("[api] Unhandled error", err);
  res.status(500).json({
    error: { code: "INTERNAL", message: "An unexpected error occurred" },
  });
};
