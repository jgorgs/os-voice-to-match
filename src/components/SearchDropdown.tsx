import React from 'react';
import { Position } from '../types';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';
import { FileText, Clock, CheckCircle, Edit3 } from 'lucide-react';
import { Badge } from './ui/badge';

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
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'In Progress':
        return <Clock size={14} className="text-blue-500" />;
      case 'Draft':
        return <Edit3 size={14} className="text-orange-500" />;
      default:
        return <FileText size={14} className="text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Draft':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

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
                  <div className="flex items-start justify-between w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(position.status)}
                        <h4 className="font-medium text-sm truncate">
                          {highlightMatch(position.title, query)}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(position.date)}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-xs px-2 py-0.5 ${getStatusColor(position.status)}`}
                        >
                          {position.status}
                        </Badge>
                      </div>
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