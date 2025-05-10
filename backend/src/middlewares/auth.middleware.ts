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
    let token: string = '';
    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log("Token received:", token);
    }

    // Check if token exists
    if (!token) {
      unauthorizedResponse(res, 'Access denied. No token provided.');
      return;
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");
    
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || '5b8a422a3b50060bfa46a98f79c61b65e476fba0b1fc7deacd0db50e5331c665'
    ) as DecodedToken;    
    console.log("Token decoded successfully:", decoded);
    // Find user by id from token
    const user = await User.findById(decoded.id);

    if (!user) {
      unauthorizedResponse(res, 'User not found.');
      return;
    }

    // Add user to request object with role from token
    // This ensures the role from the token is used, not just what's in the database
    // Use the actual Mongoose document to maintain all Document properties
    req.user = user;
    
    // Update the role from the token if needed
    if (user.role !== decoded.role) {
      user.role = decoded.role as "admin" | "seller" | "customer";
    }
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
};export default authMiddleware;