
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/hooks/useChat';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import RoleBadge from '@/components/chat/RoleBadge';
import Navbar from '@/components/ui/common/Navbar';
import { Button } from '@/components/ui/button';
import { RefreshCcw, MessageSquare } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const role = user?.role || 'guest';
  
  const { messages, loading, send, resetSession } = useChat(undefined, role);

  const handleSendMessage = (text: string) => {
    send(text);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto flex-1 p-4 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col bg-white rounded-2xl shadow-soft overflow-hidden"
        >
          <div className="flex items-center justify-between bg-white p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-villain-500" />
              <h1 className="text-lg font-medium text-villain-800">Property Assistant</h1>
              <RoleBadge role={role} />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={resetSession}
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              New Conversation
            </Button>
          </div>
          
          <ChatWindow messages={messages} isLoading={loading} />
          
          <ChatInput onSend={handleSendMessage} isLoading={loading} />
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;
