import express from 'express';
import customerController from '../controllers/customer.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import validateRequest from '../middlewares/validation.middleware';
import { 
  createCustomerValidator, 
  updateCustomerValidator 
} from '../utils/validators';

const router = express.Router();

// Public routes
router.post('/', createCustomerValidator, validateRequest, customerController.createCustomer);

// Private routes - require authentication
router.use(authMiddleware);

// Routes for customers and admins
router.route('/:id')
  .get(customerController.getCustomerById)
  .put(updateCustomerValidator, validateRequest, customerController.updateCustomer);

// Admin only routes
router.use(roleMiddleware(['admin']));

// Get all customers
router.get('/', customerController.getCustomers);

// Delete a customer
router.delete('/:id', customerController.deleteCustomer);

export default router;