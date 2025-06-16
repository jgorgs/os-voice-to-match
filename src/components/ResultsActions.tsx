
import React from 'react';
import { Edit, Copy } from 'lucide-react';
import { Button } from './ui/button';

interface ResultsActionsProps {
  onEdit: () => void;
  onCopy: () => void;
}

const ResultsActions: React.FC<ResultsActionsProps> = ({ onEdit, onCopy }) => {
  return (
    <div className="flex items-center space-x-3">
      <Button variant="outline" onClick={onEdit} className="flex items-center space-x-2">
        <Edit size={16} />
        <span>Edit Spec</span>
      </Button>
      <Button onClick={onCopy} className="flex items-center space-x-2">
        <Copy size={16} />
        <span>Copy to Clipboard</span>
      </Button>
    </div>
  );
};

export default ResultsActions;
