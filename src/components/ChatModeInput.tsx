import React, { useState, useRef } from 'react';
import { Send, Mic, Paperclip, Square } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import FilePreview from './FilePreview';
import RecordingPreview from './RecordingPreview';
import VoiceRecorder from './VoiceRecorder';

interface ChatModeInputProps {
  onSendMessage: (message: string, audioBlob?: Blob, file?: File) => void;
  disabled?: boolean;
}

const ChatModeInput: React.FC<ChatModeInputProps> = ({ onSendMessage, disabled = false }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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
    }

    if (message || audioBlob || fileToProcess) {
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
    setIsRecording(false);
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

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const canSend = () => {
    if (disabled || isRecording) return false;
    return inputText.trim() || recordedAudio || uploadedFile;
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* File and Recording Previews */}
        {uploadedFile && (
          <div className="mb-3">
            <FilePreview file={uploadedFile} onRemove={removeFile} />
          </div>
        )}
        
        {recordedAudio && (
          <div className="mb-3">
            <RecordingPreview audioBlob={recordedAudio} onRemove={removeRecording} />
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Continue your conversation..."
              className="min-h-[44px] max-h-32 resize-none border-input focus:border-primary"
              disabled={disabled || isRecording}
              rows={1}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Voice Recording */}
            <Button
              variant="outline"
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled}
              className="flex items-center gap-1 px-3"
            >
              {isRecording ? <Square size={16} /> : <Mic size={16} />}
              {isRecording && <span className="text-xs">Stop</span>}
            </Button>

            {/* File Upload */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              disabled={disabled}
              className="px-3"
            >
              <Paperclip size={16} />
            </Button>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!canSend()}
              size="sm"
              className="px-4"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="mt-2 text-sm text-muted-foreground text-center animate-pulse">
            Recording... Click stop when finished
          </div>
        )}

        {/* Hidden Components */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt,audio/*"
          className="hidden"
        />
        
        <div className="hidden">
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModeInput;