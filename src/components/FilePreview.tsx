
import React from 'react';
import { X } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
  const isFileAudio = file.type.startsWith('audio/');

  return (
    <div className="mb-3 p-3 bg-muted border border-border rounded-lg flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
          {isFileAudio ? '🎵' : '📄'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
            {isFileAudio && ` • ${file.type}`}
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
  );
};

export default FilePreview;
