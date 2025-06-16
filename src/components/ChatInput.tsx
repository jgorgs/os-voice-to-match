import React, { useState, useRef } from 'react';
import { Send, Mic, Paperclip, X } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import AudioPlayer from './AudioPlayer';
import { uploadAudioFile } from '../utils/audioUpload';

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

  const isFileAudio = uploadedFile?.type.startsWith('audio/');
  const canSend = (inputText.trim() || uploadedFile || recordedAudio) && !disabled && !isRecording;

  return (
    <div className="w-full">
      {uploadedFile && (
        <div className="mb-3 p-3 bg-muted border border-border rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
              {isFileAudio ? '🎵' : '📄'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                {isFileAudio && ` • ${uploadedFile.type}`}
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {recordedAudio && (
        <div className="mb-3 p-3 bg-muted border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                🎤
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Voice recording ready
                </p>
                <p className="text-xs text-muted-foreground">
                  Review your recording below
                </p>
              </div>
            </div>
            <button
              onClick={removeRecording}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
          <AudioPlayer audioBlob={recordedAudio} />
        </div>
      )}
      
      <div className="relative flex items-center bg-background border border-border rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 p-2">
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
        
        <button
          onClick={handleUploadClick}
          disabled={disabled || isRecording}
          className="p-3 rounded-full transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Upload file"
        >
          <Paperclip size={16} />
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept="audio/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />
        
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Looking for a senior product designer to lead redesigns and collaborate closely with engineering..."
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground px-4 py-3 text-sm"
          disabled={disabled || isRecording}
        />
        
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`p-3 rounded-full transition-all duration-200 ${
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
