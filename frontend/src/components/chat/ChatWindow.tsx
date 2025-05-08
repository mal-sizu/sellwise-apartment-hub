
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '@/services/chatApi';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <motion.div 
      className="flex-1 overflow-y-auto p-4 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {messages.length === 0 && !isLoading ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <div>
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </motion.div>
  );
};

export default ChatWindow;
