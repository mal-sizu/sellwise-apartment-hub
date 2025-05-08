import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '@/services/chatApi';
// Import a Markdown/MDX renderer
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { fromBot, text, timestamp } = message;
  
  // Format timestamp - handling both Date objects and ISO strings
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp instanceof Date ? timestamp : new Date(timestamp));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${fromBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm prose prose-sm break-words whitespace-pre-wrap ${
          fromBot
            ? 'bg-white border border-gray-200 text-gray-800 dark:prose-invert'
            : 'bg-villain-500 text-white'
        }`}
      >
        {/* Render MDX/Markdown content */}
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>

        <div className={`text-xs mt-1 text-right ${fromBot ? 'text-gray-500' : 'text-villain-200'}`}>
          {formattedTime}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
