import { Response } from 'express';

/**
 * Standard API response format
 */
interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: any;
}

/**
 * Send a success response
 * @param res - Express response object
 * @param message - Success message
 * @param data - Data to send
 * @param statusCode - HTTP status code
 */
export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

/**
 * Send an error response
 * @param res - Express response object
 * @param message - Error message
 * @param errors - Error details
 * @param statusCode - HTTP status code
 */
export const errorResponse = (
  res: Response,
  message: string,
  errors?: any,
  statusCode = 400
): Response<ApiResponse<null>> => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    errors,
  });
};

/**
 * Create a not found response
 * @param res - Express response object
 * @param entity - Entity name (e.g., 'User', 'Product')
 */
export const notFoundResponse = (
  res: Response,
  entity: string
): Response<ApiResponse<null>> => {
  return errorResponse(res, `${entity} not found`, null, 404);
};

/**
 * Create an unauthorized response
 * @param res - Express response object
 * @param message - Error message
 */
export const unauthorizedResponse = (
  res: Response,
  message = 'Unauthorized access'
): Response<ApiResponse<null>> => {
  return errorResponse(res, message, null, 401);
};

/**
 * Create a forbidden response
 * @param res - Express response object
 * @param message - Error message
 */
export const forbiddenResponse = (
  res: Response,
  message = 'Forbidden'
): Response<ApiResponse<null>> => {
  return errorResponse(res, message, null, 403);
};