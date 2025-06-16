
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';

interface JobSpecPanelProps {
  jobSpec: string;
}

const JobSpecPanel: React.FC<JobSpecPanelProps> = ({ jobSpec }) => {
  return (
    <div className="flex-1 border-r border-border">
      <div className="p-8 h-full overflow-y-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText size={20} className="text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Job Specification</h2>
        </div>
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{jobSpec}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default JobSpecPanel;
