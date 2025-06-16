
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';

interface ChatHistoryItem {
  id: string;
  type: 'user' | 'agent' | 'job_spec';
  message: string;
  timestamp: Date;
  file?: File;
}

interface ProcessingStep {
  id: string;
  text: string;
  completed: boolean;
}

interface ChatContainerProps {
  chatHistory: ChatHistoryItem[];
  isProcessing: boolean;
  processingSteps: ProcessingStep[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  chatHistory,
  isProcessing,
  processingSteps
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isProcessing, processingSteps]);

  return (
    <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-8 space-y-4 min-h-0">
      {chatHistory.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {chatHistory.map(item => (
            <ChatMessage 
              key={item.id} 
              message={item.message} 
              isUser={item.type === 'user'} 
              isJobSpec={item.type === 'job_spec'} 
            />
          ))}
        </>
      )}
    </div>
  );
};

export default ChatContainer;
