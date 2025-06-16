
import React from 'react';
import { Edit, Copy, Check, X } from 'lucide-react';
import { Button } from './ui/button';

interface ResultsActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCopy: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

const ResultsActions: React.FC<ResultsActionsProps> = ({ 
  isEditing, 
  onEdit, 
  onCopy, 
  onSave, 
  onCancel 
}) => {
  if (isEditing) {
    return (
      <div className="flex items-center space-x-3">
        <Button variant="outline" onClick={onCancel} className="flex items-center space-x-2">
          <X size={16} />
          <span>Cancel</span>
        </Button>
        <Button onClick={onSave} className="flex items-center space-x-2">
          <Check size={16} />
          <span>Save Changes</span>
        </Button>
      </div>
    );
  }

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
