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
    <div className="w-full space-y-4">
      {/* File and Recording Previews */}
      {uploadedFile && (
        <FilePreview file={uploadedFile} onRemove={removeFile} />
      )}
      
      {recordedAudio && (
        <RecordingPreview audioBlob={recordedAudio} onRemove={removeRecording} />
      )}

      {/* Main Input Container */}
      <div className="relative border border-border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          placeholder="Explain the role like you would in a kickoff call..."
          className="min-h-[60px] max-h-[200px] resize-none border-none bg-transparent p-4 pr-16 text-base placeholder:text-muted-foreground/70"
          disabled={disabled || isRecording}
        />
        
        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {showAllOptions && (
            <>
              {/* Voice Recording Button */}
              {!isRecording ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startRecording}
                  disabled={disabled}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <Mic size={16} />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={stopRecording}
                  disabled={disabled}
                  className="h-8 w-8 p-0 hover:bg-muted text-destructive"
                >
                  <Square size={16} />
                </Button>
              )}

              {/* File Upload Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUploadClick}
                disabled={disabled}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Paperclip size={16} />
              </Button>
            </>
          )}

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!canSend()}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Send size={14} />
          </Button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute bottom-3 left-4 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            Recording...
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