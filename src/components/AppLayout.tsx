import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainCanvas from './MainCanvas';
import { WorkflowManager } from './workflow/WorkflowManager';
import { useAgentProcessing } from '../hooks/useAgentProcessing';
import { useChatHistoryManager } from '../hooks/useChatHistoryManager';
import { useToast } from '../hooks/use-toast';
import { useSearch } from '../hooks/useSearch';
import { Position } from '../types';

const AppLayout: React.FC = () => {
  const [currentPositionId, setCurrentPositionId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([
    { id: '1', title: 'Senior Software Engineer', company: 'Acme Corp', date: new Date(2024, 0, 15) },
    { id: '2', title: 'Product Designer', company: 'TechStart Inc', date: new Date(2024, 0, 20) },
    { id: '3', title: 'Marketing Manager', company: 'Global Solutions Ltd', date: new Date(2024, 0, 22) }
  ]);

  const chatHistoryManager = useChatHistoryManager();
  const agentProcessing = useAgentProcessing();
  const { toast } = useToast();
  
  // Search functionality
  const {
    query: searchQuery,
    isActive: isSearchActive,
    filteredPositions,
    handleSearch,
    handleFocus,
    handleBlur,
    clearSearch,
  } = useSearch(positions);

  const handleNewPosition = () => {
    const newPosition: Position = {
      id: Date.now().toString(),
      title: 'New Position',
      company: 'Company Name',
      date: new Date()
    };
    setPositions(prev => [newPosition, ...prev]);
    setCurrentPositionId(newPosition.id);
    clearSearch(); // Clear search instead of history
    agentProcessing.resetProcessing();
    
    toast({
      title: "New Position Started",
      description: "Ready to create your next search plan.",
    });
    
    return newPosition.id;
  };

  const handlePositionSelect = (positionId: string) => {
    console.log('Position selected:', positionId, 'Previous position:', currentPositionId);
    setCurrentPositionId(positionId);
    clearSearch(); // Clear search but keep chat histories intact
    agentProcessing.resetProcessing();
  };

  const handlePositionUpdate = (positionId: string, updates: Partial<Position>) => {
    setPositions(prev => 
      prev.map(pos => 
        pos.id === positionId ? { ...pos, ...updates } : pos
      )
    );
  };

  const handlePositionDelete = (positionId: string) => {
    // If deleting the current position, switch to another position or null
    if (currentPositionId === positionId) {
      const remainingPositions = positions.filter(p => p.id !== positionId);
      if (remainingPositions.length > 0) {
        setCurrentPositionId(remainingPositions[0].id);
      } else {
        setCurrentPositionId(null);
      }
    }
    
    // Remove the position from the list
    setPositions(prev => prev.filter(pos => pos.id !== positionId));
    
    // Clear any related chat history for this position
    chatHistoryManager.clearPositionHistory(positionId);
    
    toast({
      title: "Position Deleted",
      description: "The position has been removed.",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        positions={searchQuery ? filteredPositions : positions}
        currentPositionId={currentPositionId}
        onPositionSelect={handlePositionSelect}
        onNewPosition={handleNewPosition}
        onPositionDelete={handlePositionDelete}
        searchQuery={searchQuery}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          currentPosition={positions.find(p => p.id === currentPositionId)}
          onPositionUpdate={handlePositionUpdate}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onSearchFocus={handleFocus}
          onSearchBlur={handleBlur}
          isSearchActive={isSearchActive}
          filteredPositions={filteredPositions}
          onPositionSelect={handlePositionSelect}
          onSearchClear={clearSearch}
        />
        
        {currentPositionId ? (
          <MainCanvas 
            currentPositionId={currentPositionId}
            chatHistoryManager={chatHistoryManager}
            agentProcessing={agentProcessing}
            onPositionUpdate={handlePositionUpdate}
            onCreateNewPosition={handleNewPosition}
          />
        ) : (
          <WorkflowManager />
        )}
      </div>
    </div>
  );
};

export default AppLayout;