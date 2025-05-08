import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { unauthorizedResponse } from '../utils/response';
import User, { IUser } from '../models/User';

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: string };
    }
  }
}

/**
 * Authentication middleware to verify JWT tokens
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      unauthorizedResponse(res, 'Access denied. No token provided.');
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // Find user by id from token
    const user = await User.findById(decoded.id);

    if (!user) {
      unauthorizedResponse(res, 'User not found.');
      return;
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      unauthorizedResponse(res, 'Invalid token.');
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      unauthorizedResponse(res, 'Token expired.');
      return;
    }

    unauthorizedResponse(res, 'Authentication failed.');
  }
};

export default authMiddleware;