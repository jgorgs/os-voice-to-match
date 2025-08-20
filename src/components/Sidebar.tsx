import React from 'react';
import { Plus, FileText, Clock, CheckCircle, Edit3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Position {
  id: string;
  title: string;
  date: Date;
  status: 'In Progress' | 'Completed' | 'Draft';
}

interface SidebarProps {
  positions: Position[];
  currentPositionId: string | null;
  onPositionSelect: (positionId: string) => void;
  onNewPosition: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  positions, 
  currentPositionId, 
  onPositionSelect, 
  onNewPosition 
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
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
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
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm text-foreground truncate flex-1">
                  {position.title}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  {getStatusIcon(position.status)}
                </div>
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
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Voice to Match by OutScout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;