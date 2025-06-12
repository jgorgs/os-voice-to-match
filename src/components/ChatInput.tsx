
import React, { useState } from 'react';
import { Send } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
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
            className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500"
            disabled={disabled || isRecording}
          />
          
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || disabled || isRecording}
            className={`p-2 rounded-full transition-all duration-200 ${
              inputText.trim() && !disabled && !isRecording
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
