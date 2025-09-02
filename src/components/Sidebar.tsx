import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Position } from '../types';

interface SidebarProps {
  positions: Position[];
  currentPositionId: string | null;
  onPositionSelect: (positionId: string) => void;
  onNewPosition: () => void;
  searchQuery?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  positions, 
  currentPositionId, 
  onPositionSelect, 
  onNewPosition,
  searchQuery = ''
}) => {

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 px-0 rounded-sm">{part}</mark> : 
        part
    );
  };

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Positions</h2>
          <Button
            onClick={onNewPosition}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            New
          </Button>
        </div>
      </div>

      {/* Positions List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {positions.map((position) => (
            <div
              key={position.id}
              onClick={() => onPositionSelect(position.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-muted/50 ${
                currentPositionId === position.id
                  ? 'bg-muted border border-border'
                  : 'hover:bg-muted/30'
              }`}
            >
              <div className="space-y-1">
                <h3 className="font-medium text-sm text-foreground truncate">
                  {searchQuery ? highlightMatch(position.title, searchQuery) : position.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate">
                    {searchQuery ? highlightMatch(position.company, searchQuery) : position.company}
                  </span>
                  <span className="ml-2 flex-shrink-0">
                    {formatDate(position.date)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;