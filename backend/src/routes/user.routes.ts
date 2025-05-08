import express from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import validateRequest from '../middlewares/validation.middleware';
import { loginValidator, createUserValidator, updatePasswordValidator } from '../utils/validators';

const router = express.Router();

// Public routes
router.post('/login', loginValidator, validateRequest, userController.loginUser);

// Private routes - require authentication
router.use(authMiddleware);

// Get current user profile
router.get('/me', userController.getCurrentUser);

// Update password (user can update their own password)
router.put('/:id/password', updatePasswordValidator, validateRequest, userController.updatePassword);

// Admin only routes
router.use(roleMiddleware(['admin']));

// Create a new user (admin only)
router.post('/', createUserValidator, validateRequest, userController.createUser);

// Delete a user (admin only)
router.delete('/:id', userController.deleteUser);

export default router;