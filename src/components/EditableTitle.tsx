import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => void;
  className?: string;
  placeholder?: string;
  maxLength?: number;
  size?: 'sm' | 'md' | 'lg';
  autoFocusOnCreate?: boolean;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  title,
  onSave,
  className = '',
  placeholder = 'Enter title...',
  maxLength = 100,
  size = 'md',
  autoFocusOnCreate = false
}) => {
  const [isEditing, setIsEditing] = useState(autoFocusOnCreate && title === 'New Position');
  const [editValue, setEditValue] = useState(title);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold'
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(title);
  }, [title]);

  const handleSave = async () => {
    if (editValue.trim() === '' || editValue === title) {
      setIsEditing(false);
      setEditValue(title);
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate save delay
      onSave(editValue.trim());
      setIsEditing(false);
      toast({
        title: "Title updated",
        description: "Position title has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save title. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`${sizeClasses[size]} border-primary/50 focus:border-primary bg-background`}
          disabled={isSaving}
        />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
          >
            <Check size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted"
          >
            <X size={14} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-center gap-2 cursor-pointer transition-all duration-200 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <h1 className={`${sizeClasses[size]} text-foreground transition-colors duration-200 ${
        isHovered ? 'text-primary' : ''
      }`}>
        {title}
      </h1>
      {isHovered && (
        <Edit2 
          size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} 
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
        />
      )}
      {isHovered && (
        <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
      )}
    </div>
  );
};

export default EditableTitle;