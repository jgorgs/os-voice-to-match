import React from 'react';
import { Plus, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import EditableTitle from './EditableTitle';

interface Position {
  id: string;
  title: string;
  date: Date;
  status: 'In Progress' | 'Completed' | 'Draft';
}

interface TopBarProps {
  onNewPosition: () => void;
  currentPosition?: Position;
  onPositionUpdate?: (positionId: string, updates: Partial<Position>) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onNewPosition, currentPosition, onPositionUpdate }) => {
  const handleTitleSave = (newTitle: string) => {
    if (currentPosition && onPositionUpdate) {
      onPositionUpdate(currentPosition.id, { title: newTitle });
    }
  };
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Left Section - Current Position */}
      <div className="flex items-center gap-4">
        {currentPosition ? (
          <EditableTitle
            title={currentPosition.title}
            onSave={handleTitleSave}
            size="md"
            autoFocusOnCreate={currentPosition.title === 'New Position'}
          />
        ) : (
          <h1 className="text-xl font-semibold text-foreground">Voice to Match</h1>
        )}
        {currentPosition && (
          <div className="text-sm text-muted-foreground">
            by OutScout
          </div>
        )}
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search positions..."
            className="pl-10 bg-muted/50 border-none"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={onNewPosition}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          New Position
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <User size={16} />
        </Button>
      </div>
    </header>
  );
};

export default TopBar;