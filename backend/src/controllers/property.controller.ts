import { Request, Response } from 'express';
import Property, { IProperty } from '../models/Property';
import { asyncHandler } from '../middlewares/async.middleware';
import { ApiError } from '../middlewares/error.middleware';
import { successResponse, notFoundResponse } from '../utils/response';

/**
 * @desc    Create a new property
 * @route   POST /api/properties
 * @access  Private/Seller
 */
export const createProperty = asyncHandler(async (req: Request, res: Response) => {
  // Add seller ID from authenticated user
  req.body.sellerId = req.user!._id;

  // Create property
  const property = await Property.create(req.body);

  return successResponse(res, 'Property created successfully', property, 201);
});

/**
 * @desc    Update property details
 * @route   PUT /api/properties/:id
 * @access  Private/Seller (owner) or Admin
 */
export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  const propertyId = req.params.id;

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    return notFoundResponse(res, 'Property');
  }

  // Check ownership (only allow updates if admin or the seller who created it)
  if (
    req.user!.role !== 'admin' &&
    property.sellerId.toString() !== req.user!._id.toString()
  ) {
    throw new ApiError('Not authorized to update this property', 403);
  }

  // Update fields
  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  return successResponse(res, 'Property updated successfully', updatedProperty);
});

/**
 * @desc    Update property availability
 * @route   PATCH /api/properties/:id/availability
 * @access  Private/Seller (owner) or Admin
 */
export const updatePropertyAvailability = asyncHandler(async (req: Request, res: Response) => {
  const propertyId = req.params.id;
  const { forSale } = req.body;

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    return notFoundResponse(res, 'Property');
  }

  // Check ownership
  if (
    req.user!.role !== 'admin' &&
    property.sellerId.toString() !== req.user!._id.toString()
  ) {
    throw new ApiError('Not authorized to update this property', 403);
  }

  // Update availability
  property.forSale = forSale;
  await property.save();

  return successResponse(
    res,
    `Property marked as ${forSale ? 'for sale' : 'not for sale'}`,
    {
      _id: property._id,
      title: property.title,
      forSale: property.forSale,
    }
  );
});

/**
 * @desc    Delete a property
 * @route   DELETE /api/properties/:id
 * @access  Private/Seller (owner) or Admin
 */
export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const propertyId = req.params.id;

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    return notFoundResponse(res, 'Property');
  }

  // Check ownership
  if (
    req.user!.role !== 'admin' &&
    property.sellerId.toString() !== req.user!._id.toString()
  ) {
    throw new ApiError('Not authorized to delete this property', 403);
  }

  // Delete property
  await property.deleteOne();

  return successResponse(res, 'Property deleted successfully');
});

/**
 * @desc    Get all properties with filters
 * @route   GET /api/properties
 * @access  Public
 */
export const getProperties = asyncHandler(async (req: Request, res: Response) => {
  // Build query from request query parameters
  const {
    type,
    city,
    minPrice,
    maxPrice,
    forSale,
    sellerId,
    beds,
    baths,
  } = req.query;

  const query: any = {};

  // Add filters to query
  if (type) query.type = type;
  if (city) query['address.city'] = new RegExp(city as string, 'i');
  if (minPrice) query.price = { $gte: Number(minPrice) };
  if (maxPrice) {
    if (query.price) {
      query.price.$lte = Number(maxPrice);
    } else {
      query.price = { $lte: Number(maxPrice) };
    }
  }
  if (forSale !== undefined) query.forSale = forSale === 'true';
  if (sellerId) query.sellerId = sellerId;
  if (beds) query.beds = { $gte: Number(beds) };
  if (baths) query.baths = { $gte: Number(baths) };

  // Execute query
  const properties = await Property.find(query)
    .populate('sellerId', 'firstName lastName profilePicture');

  return successResponse(res, 'Properties retrieved successfully', properties);
});

/**
 * @desc    Get property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
export const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const propertyId = req.params.id;

  // Check if property exists
  const property = await Property.findById(propertyId)
    .populate('sellerId', 'firstName lastName profilePicture phone email');
  
  if (!property) {
    return notFoundResponse(res, 'Property');
  }

  return successResponse(res, 'Property retrieved successfully', property);
});

/**
 * @desc    Get properties by seller ID
 * @route   GET /api/properties/seller/:sellerId
 * @access  Public
 */
export const getPropertiesBySellerId = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.params.sellerId;

  // Find properties by seller ID
  const properties = await Property.find({ sellerId })
    .populate('sellerId', 'firstName lastName profilePicture');

  return successResponse(res, 'Seller properties retrieved successfully', properties);
});

export default {
  createProperty,
  updateProperty,
  updatePropertyAvailability,
  deleteProperty,
  getProperties,
  getPropertyById,
  getPropertiesBySellerId,
};