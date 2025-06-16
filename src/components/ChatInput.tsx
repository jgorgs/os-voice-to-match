
import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import FilePreview from './FilePreview';
import RecordingPreview from './RecordingPreview';
import InputControls from './InputControls';

interface ChatInputProps {
  onSendMessage: (message: string, audioBlob?: Blob, file?: File) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if ((inputText.trim() || uploadedFile || recordedAudio) && !disabled) {
      let message = inputText.trim();
      let audioBlob: Blob | undefined = undefined;
      let fileToProcess: File | undefined = undefined;
      
      // Handle recorded audio
      if (recordedAudio && !message) {
        message = 'Voice message';
        audioBlob = recordedAudio;
      }
      
      // Handle uploaded audio files
      if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
        if (!message) {
          message = `Audio file: ${uploadedFile.name}`;
        }
        
        // Convert File to Blob for audio processing
        audioBlob = new Blob([uploadedFile], { type: uploadedFile.type });
        console.log('Processing uploaded audio file:', uploadedFile.name, 'Type:', uploadedFile.type);
      } else if (uploadedFile) {
        // Handle non-audio files
        if (!message) {
          message = `File uploaded: ${uploadedFile.name}`;
        }
        fileToProcess = uploadedFile;
      }
      
      onSendMessage(message, audioBlob, fileToProcess);
      setInputText('');
      setUploadedFile(null);
      setRecordedAudio(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    setRecordedAudio(audioBlob);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeRecording = () => {
    setRecordedAudio(null);
  };

  const canSend = (inputText.trim() || uploadedFile || recordedAudio) && !disabled && !isRecording;

  return (
    <div className="w-full">
      {uploadedFile && (
        <FilePreview file={uploadedFile} onRemove={removeFile} />
      )}

      {recordedAudio && (
        <RecordingPreview audioBlob={recordedAudio} onRemove={removeRecording} />
      )}
      
      <div className="relative flex items-start bg-background border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-3">
        <InputControls
          onRecordingComplete={handleRecordingComplete}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onUploadClick={handleUploadClick}
          disabled={disabled}
        />
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept="audio/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Looking for a senior product designer to lead redesigns and collaborate closely with engineering..."
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground resize-none text-sm min-h-[80px] py-2"
          disabled={disabled || isRecording}
          rows={3}
        />
        
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`ml-3 p-3 rounded-full transition-all duration-200 self-end ${
            canSend
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
      
      <input type="hidden" />
    </div>
  );
};

export default ChatInput;
