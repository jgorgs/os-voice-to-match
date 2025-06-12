
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
      <div className="flex justify-start">
        <div className="w-full bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-xl ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
