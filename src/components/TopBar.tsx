import React from 'react';
import { Plus, Search, User, X, MessageSquare, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import EditableTitle from './EditableTitle';
import SearchDropdown from './SearchDropdown';
import { Position } from '../types';

interface TopBarProps {
  currentPosition?: Position;
  onPositionUpdate?: (positionId: string, updates: Partial<Position>) => void;
  // Search props
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  isSearchActive: boolean;
  filteredPositions: Position[];
  onPositionSelect: (positionId: string) => void;
  onSearchClear: () => void;
  // View mode props
  viewMode?: 'chat' | 'overview';
  onViewModeChange?: (mode: 'chat' | 'overview') => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  currentPosition, 
  onPositionUpdate,
  searchQuery,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  isSearchActive,
  filteredPositions,
  onPositionSelect,
  onSearchClear,
  viewMode,
  onViewModeChange
}) => {
  const handleTitleSave = (newTitle: string) => {
    if (currentPosition && onPositionUpdate) {
      onPositionUpdate(currentPosition.id, { title: newTitle });
    }
  };

  const handleCompanySave = (newCompany: string) => {
    if (currentPosition && onPositionUpdate) {
      onPositionUpdate(currentPosition.id, { company: newCompany });
    }
  };
  return (
    <header className="h-16 bg-background border-b border-border relative flex items-center px-6">
      {/* Left Section - Current Position */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {currentPosition && (
          <div className="flex flex-col gap-1 min-w-0">
            <EditableTitle
              title={currentPosition.title}
              onSave={handleTitleSave}
              size="md"
              autoFocusOnCreate={currentPosition.title === 'New Position'}
            />
            <EditableTitle
              title={currentPosition.company}
              onSave={handleCompanySave}
              size="sm"
              className="text-muted-foreground"
              placeholder="Company Name"
              autoFocusOnCreate={currentPosition.company === 'Company Name'}
            />
          </div>
        )}
        
        {/* View Mode Toggle - Only show when a position is selected */}
        {currentPosition && onViewModeChange && (
          <div className="flex items-center bg-muted rounded-lg p-1 ml-4">
            <Button
              variant={viewMode === 'chat' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('chat')}
              className="h-8 px-3 rounded-md"
            >
              <MessageSquare size={14} className="mr-2" />
              Chat
            </Button>
            <Button
              variant={viewMode === 'overview' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('overview')}
              className="h-8 px-3 rounded-md"
            >
              <Users size={14} className="mr-2" />
              Overview
            </Button>
          </div>
        )}
      </div>

      {/* Center Section - Search - Absolutely positioned to stay centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-96">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search positions..."
            className="pl-10 pr-8 bg-muted/50 border-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              onClick={onSearchClear}
            >
              <X size={12} />
            </Button>
          )}
          
          <SearchDropdown
            positions={filteredPositions}
            query={searchQuery}
            isOpen={isSearchActive && (searchQuery.trim() !== '' || filteredPositions.length > 0)}
            onSelect={onPositionSelect}
            currentPositionId={currentPosition?.id}
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3 flex-1 justify-end">
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