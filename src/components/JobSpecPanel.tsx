
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Check, X } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface JobSpecPanelProps {
  jobSpec: string;
  isEditing: boolean;
  onSave: (newJobSpec: string) => void;
  onCancel: () => void;
}

const JobSpecPanel: React.FC<JobSpecPanelProps> = ({ 
  jobSpec, 
  isEditing, 
  onSave, 
  onCancel 
}) => {
  const [editedJobSpec, setEditedJobSpec] = useState(jobSpec);

  const handleSave = () => {
    onSave(editedJobSpec);
  };

  const handleCancel = () => {
    setEditedJobSpec(jobSpec); // Reset to original
    onCancel();
  };

  return (
    <div className="flex-1 border-r border-border">
      <div className="p-8 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Job Specification</h2>
          </div>
          
          {isEditing && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={16} />
                <span>Cancel</span>
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check size={16} />
                <span>Save</span>
              </Button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <Textarea
            value={editedJobSpec}
            onChange={(e) => setEditedJobSpec(e.target.value)}
            className="min-h-[600px] font-mono text-sm resize-none"
            placeholder="Edit your job specification..."
          />
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{jobSpec}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSpecPanel;
