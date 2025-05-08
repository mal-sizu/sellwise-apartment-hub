import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from './error.middleware';

/**
 * Middleware to check for validation errors
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    throw new ApiError('Validation failed', 400, errors.array());
  }
  
  next();
};

export default validateRequest;