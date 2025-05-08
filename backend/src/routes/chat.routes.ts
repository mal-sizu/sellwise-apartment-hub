import express from 'express';
import chatController from '../controllers/chat.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validateRequest from '../middlewares/validation.middleware';
import { createChatValidator, addMessageValidator } from '../utils/validators';

const router = express.Router();

// All chat routes are private - require authentication
router.use(authMiddleware);

// Create new chat session
router.post('/', createChatValidator, validateRequest, chatController.createChat);

// Get all chats for a user
router.get('/user/:userId', chatController.getUserChats);

// Routes for specific chat sessions
router.route('/:sessionId')
  .get(chatController.getChatById)
  .patch(addMessageValidator, validateRequest, chatController.addMessage)
  .delete(chatController.deleteChat);

export default router;