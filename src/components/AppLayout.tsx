import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainCanvas from './MainCanvas';
import { useAgentProcessing } from '../hooks/useAgentProcessing';
import { useChatHistory } from '../hooks/useChatHistory';
import { useToast } from '../hooks/use-toast';

interface Position {
  id: string;
  title: string;
  date: Date;
  status: 'In Progress' | 'Completed' | 'Draft';
}

const AppLayout: React.FC = () => {
  const [currentPositionId, setCurrentPositionId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([
    { id: '1', title: 'Senior Software Engineer', date: new Date(2024, 0, 15), status: 'Completed' },
    { id: '2', title: 'Product Designer', date: new Date(2024, 0, 20), status: 'In Progress' },
    { id: '3', title: 'Marketing Manager', date: new Date(2024, 0, 22), status: 'Draft' }
  ]);

  const { chatHistory, addMessage, handleSendMessage, clearHistory } = useChatHistory();
  const agentProcessing = useAgentProcessing();
  const { toast } = useToast();

  const handleNewPosition = () => {
    const newPosition: Position = {
      id: Date.now().toString(),
      title: 'New Position',
      date: new Date(),
      status: 'Draft'
    };
    setPositions(prev => [newPosition, ...prev]);
    setCurrentPositionId(newPosition.id);
    clearHistory();
    agentProcessing.resetProcessing();
    
    toast({
      title: "New Position Started",
      description: "Ready to create your next search plan.",
    });
  };

  const handlePositionSelect = (positionId: string) => {
    setCurrentPositionId(positionId);
    // In a real app, this would load the position's chat history
    clearHistory();
    agentProcessing.resetProcessing();
  };

  const handlePositionUpdate = (positionId: string, updates: Partial<Position>) => {
    setPositions(prev => 
      prev.map(pos => 
        pos.id === positionId ? { ...pos, ...updates } : pos
      )
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        positions={positions}
        currentPositionId={currentPositionId}
        onPositionSelect={handlePositionSelect}
        onNewPosition={handleNewPosition}
        onPositionUpdate={handlePositionUpdate}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          onNewPosition={handleNewPosition}
          currentPosition={positions.find(p => p.id === currentPositionId)}
          onPositionUpdate={handlePositionUpdate}
        />
        
        <MainCanvas
          currentPositionId={currentPositionId}
          chatHistory={chatHistory}
          addMessage={addMessage}
          handleSendMessage={handleSendMessage}
          agentProcessing={agentProcessing}
          onPositionUpdate={handlePositionUpdate}
        />
      </div>
    </div>
  );
};

export default AppLayout;