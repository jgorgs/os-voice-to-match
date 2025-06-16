
import React from 'react';
import { Paperclip } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

interface InputControlsProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  onUploadClick: () => void;
  disabled: boolean;
}

const InputControls: React.FC<InputControlsProps> = ({
  onRecordingComplete,
  isRecording,
  setIsRecording,
  onUploadClick,
  disabled
}) => {
  return (
    <div className="flex items-center space-x-2 mr-3 pt-1">
      <VoiceRecorder
        onRecordingComplete={onRecordingComplete}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />
      
      <button
        onClick={onUploadClick}
        disabled={disabled || isRecording}
        className="p-2 rounded-full transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Upload file"
      >
        <Paperclip size={16} />
      </button>
    </div>
  );
};

export default InputControls;
