import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Paperclip, 
  Send, 
  FileText, 
  Music, 
  X,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import VoiceRecorder from '@/components/VoiceRecorder';
import SimpleAudioPlayer from './SimpleAudioPlayer';
import { uploadAudioFile } from '@/utils/audioUpload';

interface EnhancedChatInputProps {
  onSubmit: (data: {
    text?: string;
    audioPath?: string;
    filePath?: string;
    hasFile?: boolean;
  }) => void;
  disabled?: boolean;
  placeholder?: string;
  supportedFileTypes?: string[];
}

export const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = "Describe the position, upload a job description, or record your requirements...",
  supportedFileTypes = ['.pdf', '.docx', '.doc', '.txt', '.mp3', '.wav', '.m4a', '.mp4', '.webm'],
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = !disabled && !isSubmitting && (
    inputText.trim().length > 0 || 
    audioBlob || 
    uploadedFile
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      let audioPath = null;
      
      // Handle audio upload if present
      if (audioBlob) {
        audioPath = await uploadAudioFile(audioBlob);
        if (!audioPath) {
          throw new Error('Failed to upload audio file');
        }
      }

      // Handle file upload if present
      let filePath = null;
      if (uploadedFile) {
        // TODO: Implement file upload to Supabase storage
        console.log('File upload not yet implemented:', uploadedFile.name);
      }

      onSubmit({
        text: inputText,
        audioPath,
        filePath,
        hasFile: !!uploadedFile
      });
      
      // Reset form
      setInputText('');
      setAudioBlob(null);
      setAudioUrl(null);
      setUploadedFile(null);
      setIsRecording(false);
    } catch (error) {
      console.error('Error submitting:', error);
      // TODO: Add error toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setAudioUrl(URL.createObjectURL(blob));
    setIsRecording(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!supportedFileTypes.includes(fileExtension)) {
      alert(`Unsupported file type. Supported types: ${supportedFileTypes.join(', ')}`);
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setUploadedFile(file);
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const removeRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (['mp3', 'wav', 'm4a', 'mp4', 'webm'].includes(extension || '')) {
      return <Music className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* File Preview */}
      {uploadedFile && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(uploadedFile)}
              <div>
                <p className="text-sm font-medium">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
              {uploadProgress === 100 && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-3">
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </Card>
      )}

      {/* Audio Preview */}
      {audioUrl && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              <span className="text-sm font-medium">Voice Recording</span>
            </div>
            <Button variant="ghost" size="sm" onClick={removeRecording}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <SimpleAudioPlayer audioUrl={audioUrl} />
        </Card>
      )}

      {/* Main Input Area */}
      <div className="relative">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="min-h-[120px] pr-24 resize-none"
          disabled={disabled || isSubmitting}
        />
        
        {/* Input Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {/* File Upload */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isSubmitting}
            title="Upload file"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          {/* Voice Recording */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled || isSubmitting}
            title={isRecording ? "Stop recording" : "Start recording"}
            className={isRecording ? "text-red-500 hover:text-red-600" : ""}
          >
            {isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          
          {/* Submit */}
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit}
            title="Submit"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Recording... Click the microphone to stop
        </div>
      )}

      {isSubmitting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          Processing your input...
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={supportedFileTypes.join(',')}
        onChange={handleFileUpload}
      />

      {/* Hidden Voice Recorder */}
      <div className="hidden">
        <VoiceRecorder
          onRecordingComplete={handleRecordingComplete}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </div>
    </div>
  );
};