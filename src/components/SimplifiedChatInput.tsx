import React, { useState, useRef } from 'react';
import { Send, Mic, Upload, Paperclip, Square } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import FilePreview from './FilePreview';
import RecordingPreview from './RecordingPreview';
import VoiceRecorder from './VoiceRecorder';

interface SimplifiedChatInputProps {
  onSendMessage: (message: string, audioBlob?: Blob, file?: File) => void;
  disabled?: boolean;
}

const SimplifiedChatInput: React.FC<SimplifiedChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (disabled) return;

    let message = inputText.trim();
    let audioBlob: Blob | undefined = undefined;
    let fileToProcess: File | undefined = undefined;

    if (recordedAudio) {
      message = message || 'Voice message';
      audioBlob = recordedAudio;
    } else if (uploadedFile) {
      if (uploadedFile.type.startsWith('audio/')) {
        message = message || `Audio file: ${uploadedFile.name}`;
        audioBlob = new Blob([uploadedFile], { type: uploadedFile.type });
      } else {
        message = message || `File uploaded: ${uploadedFile.name}`;
        fileToProcess = uploadedFile;
      }
    } else if (!message) {
      return;
    }

    if (message || audioBlob || fileToProcess) {
      onSendMessage(message, audioBlob, fileToProcess);
      setInputText('');
      setUploadedFile(null);
      setRecordedAudio(null);
      setShowAllOptions(false);
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
    setIsRecording(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setShowAllOptions(true);
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

  const startRecording = () => {
    setIsRecording(true);
    setShowAllOptions(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const canSend = () => {
    if (disabled || isRecording) return false;
    return recordedAudio || inputText.trim() || uploadedFile;
  };

  const handleFocus = () => {
    setShowAllOptions(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* File and Recording Previews */}
      {uploadedFile && (
        <FilePreview file={uploadedFile} onRemove={removeFile} />
      )}
      
      {recordedAudio && (
        <RecordingPreview audioBlob={recordedAudio} onRemove={removeRecording} />
      )}

      {/* Main Input Container */}
      <div className="relative border-2 border-border rounded-2xl bg-background shadow-lg hover:shadow-xl transition-all duration-200 hover:border-border/80">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          placeholder="Explain the role like you would in a kickoff call..."
          className="min-h-[120px] max-h-[300px] resize-none border-none bg-transparent p-6 pr-32 text-lg placeholder:text-muted-foreground/60 leading-relaxed"
          disabled={disabled || isRecording}
        />
        
        {/* Action Buttons Container */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          {/* Voice Recording Button - Always visible and prominent */}
          {!isRecording ? (
            <Button
              variant="ghost"
              size="lg"
              onClick={startRecording}
              disabled={disabled}
              className="h-12 w-12 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
              title="Record voice message"
            >
              <Mic size={24} className="group-hover:scale-110 transition-transform duration-200" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="lg"
              onClick={stopRecording}
              disabled={disabled}
              className="h-12 w-12 p-0 rounded-full hover:bg-destructive/10 text-destructive animate-pulse"
              title="Stop recording"
            >
              <Square size={24} />
            </Button>
          )}

          {/* File Upload Button */}
          {showAllOptions && (
            <Button
              variant="ghost"
              size="default"
              onClick={handleUploadClick}
              disabled={disabled}
              className="h-10 w-10 p-0 rounded-full hover:bg-muted/80 transition-all duration-200"
              title="Upload file"
            >
              <Paperclip size={18} />
            </Button>
          )}

          {/* Send Button - More prominent */}
          <Button
            onClick={handleSend}
            disabled={!canSend()}
            size="lg"
            className="h-12 w-12 p-0 rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-30"
            title="Send message"
          >
            <Send size={20} />
          </Button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute bottom-6 left-6 flex items-center gap-3 text-base text-muted-foreground animate-fade-in">
            <div className="w-3 h-3 bg-destructive rounded-full animate-pulse shadow-md" />
            <span className="font-medium">Recording...</span>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt,audio/*"
        className="hidden"
      />

      {/* Voice Recorder Component (Hidden) */}
      {isRecording && (
        <div className="hidden">
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </div>
      )}
    </div>
  );
};

export default SimplifiedChatInput;