import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(`[Error] ${err.message}`, err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred.",
  });
};
