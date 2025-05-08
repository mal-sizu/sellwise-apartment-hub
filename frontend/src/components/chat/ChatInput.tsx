
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex items-end gap-2 bg-white p-4 border-t border-gray-200 rounded-b-2xl">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-xl border border-gray-300 bg-transparent px-4 py-2 text-sm focus:border-villain-500 focus:outline-none focus:ring-2 focus:ring-villain-500/20 max-h-[150px]"
        rows={1}
        disabled={isLoading}
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className="bg-villain-500 hover:bg-villain-600 h-10 w-10 p-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput;
