import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
  onOptionSelect?: (option: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOptionSelect }) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          message.sender === 'user'
            ? 'bg-indigo-600 text-white'
            : 'bg-white border shadow-sm'
        }`}
      >
        {message.type === 'options' ? (
          <div className="space-y-2">
            <p className="text-gray-800 mb-2">{message.text}</p>
            <div className="grid grid-cols-1 gap-2">
              {message.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => onOptionSelect?.(option)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;