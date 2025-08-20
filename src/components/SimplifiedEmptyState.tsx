import React from 'react';
import SimplifiedChatInput from './SimplifiedChatInput';

interface SimplifiedEmptyStateProps {
  onSendMessage: (message: string, audioBlob?: Blob, file?: File) => void;
  disabled?: boolean;
}

const SimplifiedEmptyState: React.FC<SimplifiedEmptyStateProps> = ({ onSendMessage, disabled }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-6">
      {/* Logo and Header */}
      <div className="flex flex-col items-center mb-12 space-y-6">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img 
            src="/lovable-uploads/11f6ac57-a7ba-40f1-b2de-24c3dfdeada5.png" 
            alt="OutScout Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-3xl font-semibold text-foreground text-center">
          Let's Kick Off Your Search
        </h1>
      </div>

      {/* Simplified Chat Input */}
      <div className="w-full">
        <SimplifiedChatInput onSendMessage={onSendMessage} disabled={disabled} />
      </div>
    </div>
  );
};

export default SimplifiedEmptyState;