import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Seller, { ISeller } from '../models/Seller';
import User from '../models/User';
import { asyncHandler } from '../middlewares/async.middleware';
import { ApiError } from '../middlewares/error.middleware';
import { successResponse, notFoundResponse } from '../utils/response';

/**
 * @desc    Create a new seller
 * @route   POST /api/sellers
 * @access  Public
 */
export const createSeller = asyncHandler(async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    identification,
    profilePicture,
    bio,
    socialLinks,
    preferredLanguages,
    business,
    username,
    password,
  } = req.body;

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if seller with email or username already exists
    const sellerExists = await Seller.findOne({
      $or: [{ email }, { username }],
    });

    if (sellerExists) {
      throw new ApiError('Seller with this email or username already exists', 400);
    }

    // Check if user with email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError('User with this email already exists', 400);
    }

    // Create seller
    const seller = await Seller.create(
      [
        {
          firstName,
          lastName,
          email,
          phone,
          identification,
          profilePicture,
          bio,
          socialLinks,
          preferredLanguages,
          business,
          username,
          status: 'Pending',
        },
      ],
      { session }
    );

    // Create user with same ID as seller
    await User.create(
      [
        {
          _id: seller[0]._id,
          name: `${firstName} ${lastName}`,
          email,
          password,
          role: 'seller',
        },
      ],
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return successResponse(
      res,
      'Seller registered successfully. Awaiting approval.',
      {
        _id: seller[0]._id,
        firstName,
        lastName,
        email,
        username,
        status: 'Pending',
      },
      201
    );
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @desc    Update seller details
 * @route   PUT /api/sellers/:id
 * @access  Private/Seller or Admin
 */
export const updateSeller = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.params.id;
  
  // Check if seller exists
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return notFoundResponse(res, 'Seller');
  }

  // Check permissions (only allow updates if admin or the seller itself)
  if (req.user!.role !== 'admin' && req.user!._id.toString() !== sellerId) {
    throw new ApiError('Not authorized to update this seller', 403);
  }

  // Update fields
  const updatedSeller = await Seller.findByIdAndUpdate(
    sellerId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return successResponse(res, 'Seller updated successfully', updatedSeller);
});

/**
 * @desc    Delete a seller
 * @route   DELETE /api/sellers/:id
 * @access  Private/Admin
 */
export const deleteSeller = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.params.id;

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return notFoundResponse(res, 'Seller');
    }

    // Delete seller
    await Seller.findByIdAndDelete(sellerId).session(session);

    // Delete associated user
    await User.findByIdAndDelete(sellerId).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 'Seller deleted successfully');
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @desc    Update seller status
 * @route   PATCH /api/sellers/:id/status
 * @access  Private/Admin
 */
export const updateSellerStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const sellerId = req.params.id;

  // Check if seller exists
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return notFoundResponse(res, 'Seller');
  }

  // Update status
  seller.status = status;
  await seller.save();

  return successResponse(res, `Seller status updated to ${status}`, {
    _id: seller._id,
    status: seller.status,
  });
});

/**
 * @desc    Get all sellers
 * @route   GET /api/sellers
 * @access  Private/Admin
 */
export const getSellers = asyncHandler(async (req: Request, res: Response) => {
  // Get query parameters
  const status = req.query.status as string | undefined;
  
  // Build query
  const query: any = {};
  if (status) {
    query.status = status;
  }

  // Get sellers
  const sellers = await Seller.find(query);

  return successResponse(res, 'Sellers retrieved successfully', sellers);
});

/**
 * @desc    Get seller by ID
 * @route   GET /api/sellers/:id
 * @access  Private/Admin or Self
 */
export const getSellerById = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.params.id;

  // Check if seller exists
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return notFoundResponse(res, 'Seller');
  }

  // Check permissions (only allow access if admin or the seller itself)
  if (req.user!.role !== 'admin' && req.user!._id.toString() !== sellerId) {
    throw new ApiError('Not authorized to view this seller', 403);
  }

  return successResponse(res, 'Seller retrieved successfully', seller);
});

export default {
  createSeller,
  updateSeller,
  deleteSeller,
  updateSellerStatus,
  getSellers,
  getSellerById,
};