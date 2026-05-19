/**
 * Operational error with HTTP status code.
 * Thrown intentionally (validation, auth, not-found, etc.)
 * Distinguished from programming errors by isOperational flag.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
