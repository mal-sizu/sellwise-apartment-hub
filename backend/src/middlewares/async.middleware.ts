import { Request, Response, NextFunction } from 'express';

/**
 * Async handler to catch errors in async route handlers
 * @param fn - Async route handler function
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;