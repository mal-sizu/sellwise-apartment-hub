import express from 'express';
import userRoutes from './user.routes';
import sellerRoutes from './seller.routes';
import customerRoutes from './customer.routes';
import propertyRoutes from './property.routes';

const router = express.Router();

// Mount all routes
router.use('/users', userRoutes);
router.use('/sellers', sellerRoutes);
router.use('/customers', customerRoutes);
router.use('/properties', propertyRoutes);

export default router;