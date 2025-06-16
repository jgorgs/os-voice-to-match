
import React from 'react';
import ChatInput from '../components/ChatInput';
import ChatContainer from '../components/ChatContainer';
import { useAgentProcessing } from '../hooks/useAgentProcessing';
import { useChatHistory } from '../hooks/useChatHistory';

const Index = () => {
  const { chatHistory, addMessage, handleSendMessage } = useChatHistory();
  const { isProcessing, processingSteps, simulateAgentProcess } = useAgentProcessing();

  const onSendMessage = async (message: string, audioBlob?: Blob, file?: File) => {
    const { message: processedMessage, hasFile } = await handleSendMessage(message, audioBlob, file);
    
    // Simulate processing with the new hook
    await simulateAgentProcess(processedMessage, hasFile, (jobSpec) => {
      addMessage(jobSpec);
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            isProcessing={isProcessing}
            processingSteps={processingSteps}
          />

          {/* Input Section - Centered */}
          <div className="py-6">
            <ChatInput onSendMessage={onSendMessage} disabled={isProcessing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
