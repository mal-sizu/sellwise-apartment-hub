import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import mongoose from 'mongoose';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    // This is to ensure that the ApiError is an instance of Error
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Central error handler middleware
 */
const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default error status and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = null;

  // Log error for debugging
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  // Handle specific error types
  if (err instanceof ApiError) {
    // Our custom API error
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  } else if (err instanceof mongoose.Error.CastError) {
    // Mongoose cast error (invalid ID, etc.)
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'MongoError' && (err as any).code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate key error';
    const keyValue = (err as any).keyValue;
    if (keyValue) {
      const field = Object.keys(keyValue)[0];
      const value = keyValue[field];
      message = `The ${field} '${value}' already exists`;
    }
  } else if (Array.isArray(err) && err.length > 0 && (err[0] as any).param) {
    // Express validator errors
    statusCode = 400;
    message = 'Validation Error';
    errors = err.map((e: any) => ({
      field: e.param,
      message: e.msg,
    }));  
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorMiddleware;