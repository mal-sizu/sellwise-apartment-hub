import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Chat, { IChat } from '../models/Chat';
import { asyncHandler } from '../middlewares/async.middleware';
import { ApiError } from '../middlewares/error.middleware';
import { successResponse, notFoundResponse } from '../utils/response';

/**
 * @desc    Create a new chat session
 * @route   POST /api/chats
 * @access  Private
 */
export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  const userId = req.user!._id;

  // Generate a unique session ID
  const sessionId = uuidv4();

  // Create chat
  const chat = await Chat.create({
    sessionId,
    userId,
    messages: [],
    role,
  });

  return successResponse(res, 'Chat session created successfully', chat, 201);
});

/**
 * @desc    Add a message to a chat session
 * @route   PATCH /api/chats/:sessionId
 * @access  Private
 */
export const addMessage = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { text, fromBot } = req.body;
  const userId = req.user!._id;

  // Check if chat exists
  const chat = await Chat.findOne({ sessionId });
  if (!chat) {
    return notFoundResponse(res, 'Chat session');
  }

  // Check ownership
  if (chat.userId.toString() !== userId.toString() && req.user!.role !== 'admin') {
    throw new ApiError('Not authorized to access this chat session', 403);
  }

  // Create a new message
  const message = {
    id: uuidv4(),
    text,
    fromBot,
    timestamp: new Date(),
  };

  // Add message to chat
  chat.messages.push(message);
  await chat.save();

  return successResponse(res, 'Message added successfully', {
    sessionId,
    message,
  });
});

/**
 * @desc    Get a chat session by ID
 * @route   GET /api/chats/:sessionId
 * @access  Private
 */
export const getChatById = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user!._id;

  // Check if chat exists
  const chat = await Chat.findOne({ sessionId });
  if (!chat) {
    return notFoundResponse(res, 'Chat session');
  }

  // Check ownership
  if (chat.userId.toString() !== userId.toString() && req.user!.role !== 'admin') {
    throw new ApiError('Not authorized to access this chat session', 403);
  }

  return successResponse(res, 'Chat session retrieved successfully', chat);
});

/**
 * @desc    Get all chat sessions for a user
 * @route   GET /api/chats/user/:userId
 * @access  Private/Admin or Self
 */
export const getUserChats = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Check permissions
  if (userId !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw new ApiError('Not authorized to access these chat sessions', 403);
  }

  // Get chats
  const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

  return successResponse(res, 'Chat sessions retrieved successfully', chats);
});

/**
 * @desc    Delete a chat session
 * @route   DELETE /api/chats/:sessionId
 * @access  Private/Admin or Owner
 */
export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user!._id;

  // Check if chat exists
  const chat = await Chat.findOne({ sessionId });
  if (!chat) {
    return notFoundResponse(res, 'Chat session');
  }

  // Check ownership
  if (chat.userId.toString() !== userId.toString() && req.user!.role !== 'admin') {
    throw new ApiError('Not authorized to delete this chat session', 403);
  }

  // Delete chat
  await chat.deleteOne();

  return successResponse(res, 'Chat session deleted successfully');
});

export default {
  createChat,
  addMessage,
  getChatById,
  getUserChats,
  deleteChat,
};