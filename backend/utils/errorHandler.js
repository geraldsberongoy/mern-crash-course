/**
 * Custom error class for API errors with status code
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle specific MongoDB validation error types
 */
const handleMongoValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new ApiError(message, 400);
};

/**
 * Handle MongoDB duplicate key errors
 */
const handleMongoDuplicateKeyError = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new ApiError(message, 400);
};

/**
 * Handle MongoDB cast errors (invalid IDs, etc.)
 */
const handleMongoCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};

/**
 * Main error handler middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("ERROR 💥", err);

  // Handle specific error types
  if (err.name === "ValidationError") error = handleMongoValidationError(err);
  if (err.code === 11000) error = handleMongoDuplicateKeyError(err);
  if (err.name === "CastError") error = handleMongoCastError(err);

  // Send error response
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : {},
    stack: process.env.NODE_ENV === "development" ? err.stack : "",
  });
};

export { ApiError, errorHandler };
