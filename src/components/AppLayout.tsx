import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainCanvas from './MainCanvas';
import SimplifiedEmptyState from './SimplifiedEmptyState';
import PositionOverviewContent from './PositionOverviewContent';
import { useWorkflowIntegration } from '../hooks/useWorkflowIntegration';
import { useAgentProcessing } from '../hooks/useAgentProcessing';
import { useChatHistoryManager } from '../hooks/useChatHistoryManager';
import { useToast } from '../hooks/use-toast';
import { useSearch } from '../hooks/useSearch';
import { usePositions, Position } from '../hooks/usePositions';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const [currentPositionId, setCurrentPositionId] = useState<string | null>(null);
  const { positions, isLoading: positionsLoading, createPosition, deletePosition } = usePositions();

  const chatHistoryManager = useChatHistoryManager();
  const agentProcessing = useAgentProcessing();
  const { toast } = useToast();
  const { isProcessing, handleInput } = useWorkflowIntegration();
  
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

  const handleNewPosition = async () => {
    const newPositionId = await createPosition('New Position', 'Company Name');
    if (newPositionId) {
      setCurrentPositionId(newPositionId);
      clearSearch();
      agentProcessing.resetProcessing();
      
      toast({
        title: "New Position Started",
        description: "Ready to create your next search plan.",
      });
    }
    
    return newPositionId;
  };

  const handlePositionSelect = (positionId: string) => {
    console.log('Position selected:', positionId, 'Previous position:', currentPositionId);
    setCurrentPositionId(positionId);
    clearSearch(); // Clear search but keep chat histories intact
    agentProcessing.resetProcessing();
  };

  const handlePositionUpdate = (positionId: string, updates: Partial<Position>) => {
    // This would update the position in the database if needed
    // For now, we'll rely on the positions hook to manage state
  };

  const handlePositionDelete = async (positionId: string) => {
    const success = await deletePosition(positionId);
    if (success) {
      // If deleting the current position, switch to another position or null
      if (currentPositionId === positionId) {
        const remainingPositions = positions.filter(p => p.id !== positionId);
        if (remainingPositions.length > 0) {
          setCurrentPositionId(remainingPositions[0].id);
        } else {
          setCurrentPositionId(null);
        }
      }
      
      // Clear any related chat history for this position
      chatHistoryManager.clearPositionHistory(positionId);
      
      toast({
        title: "Position Deleted",
        description: "The position has been removed.",
      });
    }
  };

  // Check if we're on the position overview route
  const isPositionOverview = location.pathname.startsWith('/position/');
  const overviewPositionId = isPositionOverview ? location.pathname.split('/')[2] : null;

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
        
        {isPositionOverview ? (
          <PositionOverviewContent positionId={overviewPositionId!} />
        ) : currentPositionId ? (
          <MainCanvas 
            currentPositionId={currentPositionId}
            chatHistoryManager={chatHistoryManager}
            agentProcessing={agentProcessing}
            onPositionUpdate={handlePositionUpdate}
            onCreateNewPosition={() => {
              handleNewPosition();
              return '';
            }}
          />
        ) : (
          <SimplifiedEmptyState 
            onSendMessage={async (message, audioBlob, file) => {
              // Create a new position and handle the input processing
              const newPositionId = await handleNewPosition();
              
              if (newPositionId) {
                // Process the input through the workflow
                const result = await handleInput(message, audioBlob, file, newPositionId);
                
                if (result.success) {
                  console.log('Successfully processed input for new position:', newPositionId);
                }
              }
            }}
            disabled={isProcessing}
          />
        )}
      </div>
    </div>
  );
};

export default AppLayout;