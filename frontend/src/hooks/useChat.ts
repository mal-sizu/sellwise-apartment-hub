
import { useState, useEffect, useCallback } from 'react';
import { 
  createChatSession, 
  getChatHistory, 
  sendMessage, 
  ChatMessage
} from '../services/chatApi';

export function useChat(initialSessionId?: string, role: string = 'customer') {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize chat session
  useEffect(() => {
    const initChat = async () => {
      try {
        // Check localStorage first
        const storedSessionId = localStorage.getItem(`chat_session_${role}`);
        
        if (storedSessionId) {
          // Use existing session from localStorage
          setSessionId(storedSessionId);
          
          // Load message history
          const history = await getChatHistory(storedSessionId);
          if (history) {
            setMessages(history.messages);
          } else {
            // If stored session is invalid, create a new one
            createNewSession();
          }
        } else {
          // Create a new session
          createNewSession();
        }
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError('Failed to initialize chat session');
      }
    };

    const createNewSession = async () => {
      try {
        const newSessionId = await createChatSession(role);
        localStorage.setItem(`chat_session_${role}`, newSessionId);
        setSessionId(newSessionId);
        setMessages([]);
        
        // Add welcome message
        const welcomeMsg: ChatMessage = {
          id: `welcome_${Date.now()}`,
          text: getWelcomeMessage(role),
          fromBot: true,
          timestamp: new Date()
        };
        setMessages([welcomeMsg]);
      } catch (err) {
        console.error('Failed to create new chat session:', err);
        setError('Failed to create new chat session');
      }
    };

    if (!sessionId) {
      initChat();
    }
  }, [role, sessionId]);

  // Send a message and get response
  const send = useCallback(async (text: string) => {
    if (!sessionId || !text.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        text,
        fromBot: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to API and get bot response
      const response = await sendMessage(sessionId, text, role);
      
      // Ensure timestamp is a Date object
      if (!(response.timestamp instanceof Date)) {
        response.timestamp = new Date(response.timestamp);
      }
      
      setMessages(prev => [...prev, response]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        text: "Sorry, I couldn't process your message. Please try again.",
        fromBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [sessionId, role]);

  // Create a new session
  const resetSession = useCallback(async () => {
    try {
      localStorage.removeItem(`chat_session_${role}`);
      const newSessionId = await createChatSession(role);
      localStorage.setItem(`chat_session_${role}`, newSessionId);
      setSessionId(newSessionId);
      
      // Add welcome message
      const welcomeMsg: ChatMessage = {
        id: `welcome_${Date.now()}`,
        text: getWelcomeMessage(role),
        fromBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    } catch (err) {
      console.error('Failed to reset chat session:', err);
      setError('Failed to reset chat session');
    }
  }, [role]);

  return {
    messages,
    loading,
    error,
    send,
    resetSession
  };
}

// Helper to generate welcome messages based on user role
function getWelcomeMessage(role: string): string {
  switch (role) {
    case 'admin':
      return "Hello Admin! I'm your property management assistant. I can help you with managing properties, sellers, and customers. What would you like to do today?";
    case 'seller':
      return "Hello Seller! I'm your property listing assistant. I can help you manage your properties, understand market trends, and connect with potential buyers. How can I assist you today?";
    case 'customer':
      return "Hello! I'm your property search assistant. I can help you find properties, understand listings, and connect with sellers. What kind of property are you looking for?";
    default:
      return "Hello! I'm your property assistant. How can I help you today?";
  }
}
