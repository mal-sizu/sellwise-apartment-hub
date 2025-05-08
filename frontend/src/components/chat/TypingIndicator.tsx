
import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm">
        <div className="flex space-x-2">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="h-2.5 w-2.5 rounded-full bg-villain-400"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{
                repeat: Infinity,
                duration: 1.4,
                delay: dot * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
