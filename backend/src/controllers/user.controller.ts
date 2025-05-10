import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import { asyncHandler } from '../middlewares/async.middleware';
import { ApiError } from '../middlewares/error.middleware';
import { successResponse, unauthorizedResponse, notFoundResponse } from '../utils/response';

/**
 * Generate JWT token for a user
 * @param user - User object
 */
function generateToken(user: IUser): string {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 86400, // 1 day
    algorithm: 'HS256',
  };

  const jwtSecret =
    process.env.JWT_SECRET || '5b8a422a3b50060bfa46a98f79c61b65e476fba0b1fc7deacd0db50e5331c665';

  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, options);
}

/**
 * @desc    Login user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password))) {
    return unauthorizedResponse(res, 'Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken(user);

  // Return response without password
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return successResponse(res, 'Login successful', {
    user: userResponse,
    token,
  });
});

/**
 * @desc    Create a new user (admin only)
 * @route   POST /api/users
 * @access  Private/Admin
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError('User with this email already exists', 400);
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Return response
  return successResponse(res, 'User created successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }, 201);
});

/**
 * @desc    Update user password
 * @route   PUT /api/users/:id/password
 * @access  Private/Admin or Self
 */
export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  // Check if user is updating their own password or is an admin
  if (req.user!._id.toString() !== userId && req.user!.role !== 'admin') {
    throw new ApiError('Not authorized to update this user', 403);
  }

  // Find user
  const user = await User.findById(userId).select('+password');
  if (!user) {
    return notFoundResponse(res, 'User');
  }

  // If not admin, verify current password
  if (req.user!.role !== 'admin') {
    if (!(await user.comparePassword(currentPassword))) {
      return unauthorizedResponse(res, 'Current password is incorrect');
    }
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return successResponse(res, 'Password updated successfully');
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    return notFoundResponse(res, 'User');
  }

  // Delete user
  await user.deleteOne();

  return successResponse(res, 'User deleted successfully');
});

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  // User is already attached to the request by auth middleware
  const user = req.user;

  if (!user) {
    return notFoundResponse(res, 'User');
  }

  return successResponse(res, 'User profile retrieved successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

export default {
  loginUser,
  createUser,
  updatePassword,
  deleteUser,
  getCurrentUser,
};