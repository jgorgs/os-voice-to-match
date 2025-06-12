
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isJobSpec?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, isJobSpec = false }) => {
  if (isJobSpec) {
    return (
      <div className="flex justify-start mb-6">
        <div className="max-w-4xl bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-2xl px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
