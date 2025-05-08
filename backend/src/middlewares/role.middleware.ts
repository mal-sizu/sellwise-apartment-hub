import { Request, Response, NextFunction } from 'express';
import { forbiddenResponse } from '../utils/response';

/**
 * Role-based authorization middleware
 * @param roles - Allowed roles for this endpoint
 */
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if user exists on request (should be added by authMiddleware)
    if (!req.user) {
      forbiddenResponse(res, 'Access denied: User not authenticated');
      return;
    }

    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      forbiddenResponse(
        res,
        `Access denied: Role '${req.user.role}' is not authorized to access this resource`
      );
      return;
    }

    next();
  };
};

export default roleMiddleware;