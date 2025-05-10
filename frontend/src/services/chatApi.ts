import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gen AI client using an environment variable for security
export const genai = new GoogleGenAI({ apiKey: 'AIzaSyB-RbZeh1Vii2l--Qt2fmmMnC9Zi1WRTCw' });

// Mock backend API for chat sessions
export type ChatMessage = {
  id: string;
  text: string;
  fromBot: boolean;
  timestamp: Date;
};

type ChatSession = {
  sessionId: string;
  messages: ChatMessage[];
  role: string;
};

const mockSessions: Record<string, ChatSession> = {};

// Create a new chat session
export const createChatSession = async (role: string): Promise<string> => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  mockSessions[sessionId] = { sessionId, messages: [], role };
  return sessionId;
};

// Get chat session history
export const getChatHistory = async (sessionId: string): Promise<ChatSession | null> => {
  const session = mockSessions[sessionId];
  if (!session) return null;
  return {
    ...session,
    messages: session.messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
    })),
  };
};

// Save user message to the session
export const saveUserMessage = async (sessionId: string, text: string): Promise<ChatMessage> => {
  const session = mockSessions[sessionId];
  if (!session) throw new Error("Session not found");

  const message: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    text,
    fromBot: false,
    timestamp: new Date(),
  };
  session.messages.push(message);
  return message;
};

// Save bot message to the session
export const saveBotMessage = async (sessionId: string, text: string): Promise<ChatMessage> => {
  const session = mockSessions[sessionId];
  if (!session) throw new Error("Session not found");

  const message: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    text,
    fromBot: true,
    timestamp: new Date(),
  };
  session.messages.push(message);
  return message;
};

// Send message to Gemini API and get a response
export const sendMessage = async (
  sessionId: string,
  text: string,
  role: string
): Promise<ChatMessage> => {
  // 1. Save user message
  await saveUserMessage(sessionId, text);
  const session = mockSessions[sessionId];

  try {
    // 2. Build prompt with role context and recent history
    const rolePrompt = getRoleSpecificPrompt(role);
    const historyText = session.messages
      .filter(m => !m.fromBot)
      .slice(-10)
      .map(m => m.text)
      .join("\n");
    const fullPrompt = `${rolePrompt}\n\nPrevious Conversation:\n${historyText}\n\nUser: ${text}`;

    // 3. Call Gemini API via generateContent (per quickstart) to get the bot response
    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
    });

    // 4. Extract and save bot text
    const botText = response.text; // `response.text` per quickstart example
    return await saveBotMessage(sessionId, botText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return await saveBotMessage(
      sessionId,
      "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later."
    );
  }
};

// Helper to generate role-specific prompts
const getRoleSpecificPrompt = (role: string): string => {
  switch (role) {
    case "admin":
      return "You are an AI assistant helping a property management system administrator. Provide concise, helpful responses about property management and system features.";
    case "seller":
      return "You are an AI assistant helping a property seller. Provide concise, helpful responses about property listings and sales strategies.";
    case "customer":
      return "You are an AI assistant helping a property customer. Provide concise, helpful responses about property features and purchasing processes.";
    default:
      return "You are an AI assistant for a property management system. Provide concise, helpful responses about properties and system features.";
  }
};