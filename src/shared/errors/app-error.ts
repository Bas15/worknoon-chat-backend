export class AppError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403, "FORBIDDEN");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED");
  }
}
