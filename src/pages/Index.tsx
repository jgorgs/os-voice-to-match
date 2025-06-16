
import React from 'react';
import ChatInput from '../components/ChatInput';
import ChatContainer from '../components/ChatContainer';
import ProcessingOverlay from '../components/ProcessingOverlay';
import SplitViewLayout from '../components/SplitViewLayout';
import { useAgentProcessing } from '../hooks/useAgentProcessing';
import { useChatHistory } from '../hooks/useChatHistory';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const { chatHistory, addMessage, handleSendMessage } = useChatHistory();
  const { 
    isProcessing, 
    processingSteps, 
    showSplitView, 
    processingResult, 
    simulateAgentProcess, 
    resetProcessing,
    updateJobSpec
  } = useAgentProcessing();
  const { toast } = useToast();

  const onSendMessage = async (message: string, audioBlob?: Blob, file?: File) => {
    const { message: processedMessage, hasFile } = await handleSendMessage(message, audioBlob, file);
    
    // Simulate processing with the new enhanced flow
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
    toast({
      title: "Copied to Clipboard",
      description: "Job specification and search plan copied successfully.",
    });
  };

  const handleJobSpecUpdate = (newJobSpec: string) => {
    updateJobSpec(newJobSpec);
    toast({
      title: "Job Spec Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  // Show split view results
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Processing Overlay */}
      <ProcessingOverlay steps={processingSteps} isVisible={isProcessing} />

      {/* Original Chat Interface (hidden during processing) */}
      {!isProcessing && (
        <>
          {/* Header */}
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-center">
              <h1 className="text-xl font-semibold text-foreground">
                Voice to Match by OutScout
              </h1>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-2xl mx-auto flex flex-col h-full">
              
              {/* Chat History Container */}
              <ChatContainer 
                chatHistory={chatHistory}
                isProcessing={false}
                processingSteps={[]}
              />

              {/* Input Section - Centered */}
              <div className="py-6">
                <ChatInput onSendMessage={onSendMessage} disabled={false} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
