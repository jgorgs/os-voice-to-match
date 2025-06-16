
import React from 'react';
import { X } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

interface RecordingPreviewProps {
  audioBlob: Blob;
  onRemove: () => void;
}

const RecordingPreview: React.FC<RecordingPreviewProps> = ({ audioBlob, onRemove }) => {
  return (
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
          onClick={onRemove}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>
      <AudioPlayer audioBlob={audioBlob} />
    </div>
  );
};

export default RecordingPreview;
