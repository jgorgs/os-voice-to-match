import React from 'react';
import { Position } from '../types';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';

interface SearchDropdownProps {
  positions: Position[];
  query: string;
  isOpen: boolean;
  onSelect: (positionId: string) => void;
  currentPositionId?: string | null;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  positions,
  query,
  isOpen,
  onSelect,
  currentPositionId
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

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 z-50">
      <Command className="bg-popover border border-border rounded-md shadow-md">
        <CommandList className="max-h-64">
          {positions.length === 0 ? (
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              {query ? `No positions found for "${query}"` : 'No positions available'}
            </CommandEmpty>
          ) : (
            <CommandGroup>
              {positions.map((position) => (
                <CommandItem
                  key={position.id}
                  value={position.id}
                  onSelect={() => onSelect(position.id)}
                  className={`p-3 cursor-pointer ${
                    currentPositionId === position.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="space-y-1 w-full">
                    <h4 className="font-medium text-sm truncate">
                      {highlightMatch(position.title, query)}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate">
                        {highlightMatch(position.company, query)}
                      </span>
                      <span className="ml-2 flex-shrink-0">
                        {formatDate(position.date)}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default SearchDropdown;