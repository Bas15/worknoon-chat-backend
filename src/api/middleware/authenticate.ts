import type { Request, RequestHandler } from "express";
import { UnauthorizedError } from "../../shared/errors/app-error.js";

export interface AuthenticatedRequest extends Request {
  userId: string;
}

/**
 * Stub for assessment: replace with JWT verification against your identity provider.
 * Expects `Authorization: Bearer <userId>` for local development.
 */
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new UnauthorizedError("Missing bearer token"));
    return;
  }
  const token = header.slice(7).trim();
  if (!token) {
    next(new UnauthorizedError("Invalid bearer token"));
    return;
  }
  (req as AuthenticatedRequest).userId = token;
  next();
};
