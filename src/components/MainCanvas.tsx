import React from 'react';
import MultiInputTabs from './MultiInputTabs';
import ProcessingOverlay from './ProcessingOverlay';
import SearchPlanReview from './SearchPlanReview';
import ParallelSearchView from './ParallelSearchView';
import SplitViewLayout from './SplitViewLayout';
import ChatContainer from './ChatContainer';
import EmptyState from './EmptyState';
import { useToast } from '../hooks/use-toast';

interface Position {
  id: string;
  title: string;
  date: Date;
  status: 'In Progress' | 'Completed' | 'Draft';
}

interface MainCanvasProps {
  currentPositionId: string | null;
  chatHistory: any[];
  addMessage: (message: any) => void;
  handleSendMessage: (message: string, audioBlob?: Blob, file?: File) => Promise<any>;
  agentProcessing: any;
  onPositionUpdate: (positionId: string, updates: Partial<Position>) => void;
}

const MainCanvas: React.FC<MainCanvasProps> = ({
  currentPositionId,
  chatHistory,
  addMessage,
  handleSendMessage,
  agentProcessing,
  onPositionUpdate
}) => {
  const { toast } = useToast();
  
  const {
    isProcessing,
    processingSteps,
    showSplitView,
    showSearchPlan,
    showParallelSearch,
    processingResult,
    searchPlanData,
    searchResults,
    simulateAgentProcess,
    resetProcessing,
    updateJobSpec,
    confirmSearchPlan,
    startParallelSearch
  } = agentProcessing;

  const onSendMessage = async (message: string, audioBlob?: Blob, file?: File) => {
    if (!currentPositionId) return;
    
    const { message: processedMessage, hasFile } = await handleSendMessage(message, audioBlob, file);
    
    // Update position status to In Progress
    onPositionUpdate(currentPositionId, { status: 'In Progress' });
    
    // Start the enhanced processing flow
    await simulateAgentProcess(processedMessage, hasFile, (jobSpec) => {
      addMessage(jobSpec);
    });
  };

  const handleEdit = () => {
    resetProcessing();
    toast({
      title: "Edit Mode",
      description: "Returning to input mode to edit your specification.",
    });
  };

  const handleCopy = () => {
    if (processingResult) {
      const fullContent = `${processingResult.jobSpec}\n\n--- SEARCH PLAN ---\n\nTarget Companies: ${processingResult.searchPlan.targetCompanies.join(', ')}\n\nRelevant Titles: ${processingResult.searchPlan.relevantTitles.join(', ')}\n\nFilters:\n- Experience: ${processingResult.searchPlan.filters.experience}\n- Location: ${processingResult.searchPlan.filters.location}\n- Salary: ${processingResult.searchPlan.filters.salary}\n- Skills: ${processingResult.searchPlan.filters.skills.join(', ')}`;
      
      navigator.clipboard.writeText(fullContent);
      toast({
        title: "Copied to Clipboard",
        description: "Job specification and search plan copied successfully.",
      });
    }
  };

  const handleJobSpecUpdate = (newJobSpec: string) => {
    updateJobSpec(newJobSpec);
    toast({
      title: "Job Spec Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleSearchPlanConfirm = (updatedPlan: any) => {
    confirmSearchPlan(updatedPlan);
    if (currentPositionId) {
      onPositionUpdate(currentPositionId, { status: 'In Progress' });
    }
  };

  const handleSearchComplete = () => {
    if (currentPositionId) {
      onPositionUpdate(currentPositionId, { status: 'Completed' });
    }
    toast({
      title: "Search Complete",
      description: "Found candidates matching your criteria.",
    });
  };

  // Show processing overlay
  if (isProcessing) {
    return <ProcessingOverlay steps={processingSteps} isVisible={isProcessing} />;
  }

  // Show search plan review
  if (showSearchPlan && searchPlanData) {
    return (
      <SearchPlanReview
        searchPlan={searchPlanData}
        onConfirm={handleSearchPlanConfirm}
        onBack={resetProcessing}
      />
    );
  }

  // Show parallel search
  if (showParallelSearch) {
    return (
      <ParallelSearchView
        onComplete={handleSearchComplete}
        searchPlan={searchPlanData}
      />
    );
  }

  // Show final results
  if (showSplitView && processingResult) {
    return (
      <SplitViewLayout
        jobSpec={processingResult.jobSpec}
        searchPlan={processingResult.searchPlan}
        isVisible={showSplitView}
        onEdit={handleEdit}
        onCopy={handleCopy}
        onJobSpecUpdate={handleJobSpecUpdate}
      />
    );
  }

  // Main canvas content
  return (
    <div className="flex-1 flex flex-col">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {chatHistory.length === 0 && !currentPositionId ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState />
          </div>
        ) : (
          <ChatContainer 
            chatHistory={chatHistory}
            isProcessing={false}
            processingSteps={[]}
          />
        )}
      </div>

      {/* Input Area */}
      {currentPositionId && (
        <div className="border-t border-border bg-background p-6">
          <div className="max-w-4xl mx-auto">
            <MultiInputTabs onSendMessage={onSendMessage} disabled={false} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainCanvas;