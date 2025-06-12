
import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

interface ChatInputProps {
  onSendMessage: (message: string, audioBlob?: Blob) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (inputText.trim() && !disabled) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    onSendMessage('Voice message', audioBlob);
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center bg-background border border-border rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 p-2">
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
        
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe the role, or just say the job title..."
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground px-4 py-3 text-sm"
          disabled={disabled || isRecording}
        />
        
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || disabled || isRecording}
          className={`p-3 rounded-full transition-all duration-200 ${
            inputText.trim() && !disabled && !isRecording
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Send size={16} />
        </button>
      </div>
      
      {isRecording && (
        <div className="text-center mt-2">
          <span className="text-sm text-muted-foreground">Recording...</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
