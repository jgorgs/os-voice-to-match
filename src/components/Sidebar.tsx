import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Position } from '../types';

interface SidebarProps {
  positions: Position[];
  currentPositionId: string | null;
  onPositionSelect: (positionId: string) => void;
  onNewPosition: () => void;
  onPositionDelete: (positionId: string) => void;
  searchQuery?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  positions, 
  currentPositionId, 
  onPositionSelect, 
  onNewPosition,
  onPositionDelete,
  searchQuery = ''
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<Position | null>(null);
  const navigate = useNavigate();

  const handleDeleteClick = (position: Position) => {
    setPositionToDelete(position);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (positionToDelete) {
      onPositionDelete(positionToDelete.id);
    }
    setDeleteDialogOpen(false);
    setPositionToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPositionToDelete(null);
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
              className={`p-3 rounded-lg transition-colors duration-200 hover:bg-muted/50 relative group ${
                currentPositionId === position.id
                  ? 'bg-muted border border-border'
                  : 'hover:bg-muted/30'
              }`}
            >
              <div 
                onClick={() => navigate(`/position/${position.id}`)}
                className="cursor-pointer"
              >
                <div className="space-y-1 pr-8">
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
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(position);
                }}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Position</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{positionToDelete?.title}" at {positionToDelete?.company}? 
              This action cannot be undone and will remove all associated chat history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default Sidebar;