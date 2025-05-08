import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Customer, { ICustomer } from '../models/Customer';
import User from '../models/User';
import { asyncHandler } from '../middlewares/async.middleware';
import { ApiError } from '../middlewares/error.middleware';
import { successResponse, notFoundResponse } from '../utils/response';

/**
 * @desc    Create a new customer
 * @route   POST /api/customers
 * @access  Public
 */
export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    interests,
    password,
  } = req.body;

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if customer with email already exists
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      throw new ApiError('Customer with this email already exists', 400);
    }

    // Check if user with email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError('User with this email already exists', 400);
    }

    // Create customer
    const customer = await Customer.create(
      [
        {
          firstName,
          lastName,
          email,
          phone,
          address,
          interests,
        },
      ],
      { session }
    );

    // Create user with same ID as customer
    await User.create(
      [
        {
          _id: customer[0]._id,
          name: `${firstName} ${lastName}`,
          email,
          password,
          role: 'customer',
        },
      ],
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return successResponse(
      res,
      'Customer registered successfully',
      {
        _id: customer[0]._id,
        firstName,
        lastName,
        email,
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
 * @desc    Update customer details
 * @route   PUT /api/customers/:id
 * @access  Private/Customer or Admin
 */
export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.params.id;
  
  // Check if customer exists
  const customer = await Customer.findById(customerId);
  if (!customer) {
    return notFoundResponse(res, 'Customer');
  }

  // Check permissions (only allow updates if admin or the customer itself)
  if (req.user!.role !== 'admin' && req.user!._id.toString() !== customerId) {
    throw new ApiError('Not authorized to update this customer', 403);
  }

  // Update fields
  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return successResponse(res, 'Customer updated successfully', updatedCustomer);
});

/**
 * @desc    Delete a customer
 * @route   DELETE /api/customers/:id
 * @access  Private/Admin
 */
export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.params.id;

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return notFoundResponse(res, 'Customer');
    }

    // Delete customer
    await Customer.findByIdAndDelete(customerId).session(session);

    // Delete associated user
    await User.findByIdAndDelete(customerId).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 'Customer deleted successfully');
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @desc    Get all customers
 * @route   GET /api/customers
 * @access  Private/Admin
 */
export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  // Get customers
  const customers = await Customer.find();

  return successResponse(res, 'Customers retrieved successfully', customers);
});

/**
 * @desc    Get customer by ID
 * @route   GET /api/customers/:id
 * @access  Private/Admin or Self
 */
export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.params.id;

  // Check if customer exists
  const customer = await Customer.findById(customerId);
  if (!customer) {
    return notFoundResponse(res, 'Customer');
  }

  // Check permissions (only allow access if admin or the customer itself)
  if (req.user!.role !== 'admin' && req.user!._id.toString() !== customerId) {
    throw new ApiError('Not authorized to view this customer', 403);
  }

  return successResponse(res, 'Customer retrieved successfully', customer);
});

export default {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerById,
};