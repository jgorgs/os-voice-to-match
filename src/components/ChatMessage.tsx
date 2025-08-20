
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, CheckCircle, Search, Edit3 } from 'lucide-react';
import { Button } from './ui/button';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isJobSpec?: boolean;
  type?: 'message' | 'confirmation' | 'processing' | 'plan-preview' | 'results';
  isProcessing?: boolean;
  onInteraction?: (action: string, data?: any) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser, 
  isJobSpec = false, 
  type = 'message',
  isProcessing = false,
  onInteraction 
}) => {
  // Processing message with typing indicator
  if (type === 'processing') {
    return (
      <div className="flex justify-start">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare size={16} className="text-primary" />
          </div>
          <div className="bg-card border rounded-xl p-4 max-w-[80%] shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse-delay-1"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse-delay-2"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse-delay-3"></div>
              </div>
              <span className="text-sm text-muted-foreground">{message}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation message
  if (type === 'confirmation') {
    return (
      <div className="flex justify-start">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle size={16} className="text-primary" />
          </div>
          <div className="bg-card border rounded-xl p-4 max-w-[80%] shadow-sm">
            <p className="text-sm leading-relaxed">{message}</p>
            {isProcessing && (
              <div className="mt-3 flex items-center space-x-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span className="text-xs">Processing your request...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Job spec or plan preview as interactive chat message
  if (isJobSpec || type === 'plan-preview') {
    return (
      <div className="flex justify-start">
        <div className="w-full bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
          {type === 'plan-preview' && onInteraction && (
            <div className="mt-6 pt-4 border-t border-primary/20 flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onInteraction('refine')}
                className="flex items-center space-x-2"
              >
                <Edit3 size={14} />
                <span>Refine Plan</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => onInteraction('confirm')}
                className="flex items-center space-x-2"
              >
                <Search size={14} />
                <span>Start Search</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Regular message
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
