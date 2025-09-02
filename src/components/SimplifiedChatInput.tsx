import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Upload, Paperclip, Square } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import FilePreview from './FilePreview';
import RecordingPreview from './RecordingPreview';
import { useToast } from '@/hooks/use-toast';

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
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleSend = async () => {
    if (disabled || isUploading) return;

    let message = inputText.trim();
    let audioBlob: Blob | undefined = undefined;
    let fileToProcess: File | undefined = undefined;

    if (recordedAudio) {
      message = message || 'Voice message';
      audioBlob = recordedAudio;
      console.log('🎤 Sending audio recording:', { 
        size: recordedAudio.size, 
        type: recordedAudio.type 
      });
    } else if (uploadedFile) {
      if (uploadedFile.type.startsWith('audio/')) {
        message = message || `Audio file: ${uploadedFile.name}`;
        audioBlob = new Blob([uploadedFile], { type: uploadedFile.type });
        console.log('📁 Sending audio file:', { 
          name: uploadedFile.name, 
          size: uploadedFile.size, 
          type: uploadedFile.type 
        });
      } else {
        message = message || `File uploaded: ${uploadedFile.name}`;
        fileToProcess = uploadedFile;
        console.log('📎 Sending file:', { 
          name: uploadedFile.name, 
          size: uploadedFile.size, 
          type: uploadedFile.type 
        });
      }
    } else if (!message) {
      return;
    }

    if (message || audioBlob || fileToProcess) {
      try {
        setIsUploading(true);
        console.log('📤 Starting upload process...');
        await onSendMessage(message, audioBlob, fileToProcess);
        
        // Clear state after successful send
        setInputText('');
        setUploadedFile(null);
        setRecordedAudio(null);
        setShowAllOptions(false);
        
        if (audioBlob || fileToProcess) {
          toast({
            title: "Upload successful",
            description: audioBlob ? "Voice recording sent successfully" : "File uploaded successfully"
          });
        }
      } catch (error) {
        console.error('❌ Upload failed:', error);
        toast({
          title: "Upload failed",
          description: "There was an error processing your request. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    console.log('🎤 Recording completed:', { 
      size: audioBlob.size, 
      type: audioBlob.type 
    });
    setRecordedAudio(audioBlob);
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    toast({
      title: "Recording complete",
      description: "Your voice message is ready to send"
    });
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

  const startRecording = async () => {
    try {
      console.log('🎤 Starting recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Configure MediaRecorder for mp4 format
      const options = {
        mimeType: 'audio/mp4'
      };
      
      // Fallback to webm if mp4 is not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/webm';
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType;
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        handleRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setShowAllOptions(true);
      setRecordingTime(0);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak now, click stop when finished"
      });
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    console.log('🛑 Stopping recording...');
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const canSend = () => {
    if (disabled || isRecording || isUploading) return false;
    return recordedAudio || inputText.trim() || uploadedFile;
  };

  const handleFocus = () => {
    setShowAllOptions(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

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
            <span className="font-medium">Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</span>
          </div>
        )}
        
        {/* Upload Indicator */}
        {isUploading && (
          <div className="absolute bottom-6 left-6 flex items-center gap-3 text-base text-muted-foreground animate-fade-in">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-md" />
            <span className="font-medium">Uploading...</span>
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

    </div>
  );
};

export default SimplifiedChatInput;