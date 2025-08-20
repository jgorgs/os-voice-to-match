import React, { useState } from 'react';
import MultiInputTabs from './MultiInputTabs';
import ChatContainer from './ChatContainer';
import SimplifiedEmptyState from './SimplifiedEmptyState';
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
  addConfirmationMessage: (userMessage: string) => any;
  addProcessingMessage: (step: string) => any;
  addPlanPreview: (searchPlan: any) => any;
  handleSendMessage: (message: string, audioBlob?: Blob, file?: File) => Promise<any>;
  agentProcessing: any;
  onPositionUpdate: (positionId: string, updates: Partial<Position>) => void;
  onCreateNewPosition: () => string; // Returns the new position ID
}

const MainCanvas: React.FC<MainCanvasProps> = ({
  currentPositionId,
  chatHistory,
  addMessage,
  addConfirmationMessage,
  addProcessingMessage,
  addPlanPreview,
  handleSendMessage,
  agentProcessing,
  onPositionUpdate,
  onCreateNewPosition
}) => {
  const { toast } = useToast();
  
  // We no longer need these old processing hooks since we use chat-based flow
  // const { ... } = agentProcessing;

  const [isEditingPlan, setIsEditingPlan] = useState(false);

  const onSendMessage = async (message: string, audioBlob?: Blob, file?: File) => {
    let positionId = currentPositionId;
    
    // If no current position, create a new one automatically
    if (!positionId) {
      positionId = onCreateNewPosition();
    }
    
    const { message: processedMessage, hasFile } = await handleSendMessage(message, audioBlob, file);
    
    // Update position status to In Progress
    if (positionId) {
      onPositionUpdate(positionId, { status: 'In Progress' });
    }
    
    // Start the enhanced conversational flow
    startConversationalFlow(processedMessage, hasFile);
  };

  const startConversationalFlow = async (userMessage: string, hasFile: boolean) => {
    // Step 1: Add confirmation message
    const confirmationMsg = addConfirmationMessage(userMessage);
    
    // Step 2: Simulate processing with sequential messages
    setTimeout(() => {
      addProcessingMessage("Analyzing your requirements...");
    }, 1000);
    
    setTimeout(() => {
      addProcessingMessage("Researching relevant companies and roles...");  
    }, 2500);
    
    setTimeout(() => {
      addProcessingMessage("Building your customized search plan...");
    }, 4000);
    
    // Step 3: Present search plan as interactive chat message
    setTimeout(() => {
      const mockSearchPlan = {
        jobSummary: `Senior Software Engineer role focusing on ${userMessage.includes('React') ? 'React/Frontend' : 'Full Stack'} development`,
        targetCompanies: ['Google', 'Meta', 'Netflix', 'Stripe', 'Figma'],
        filters: {
          experience: '5+ years',
          location: 'San Francisco, CA / Remote',
          salary: '$180K - $250K',
          skills: ['React', 'TypeScript', 'Node.js', 'System Design']
        },
        weights: {
          skills: 70,
          experience: 20,
          location: 10
        }
      };
      addPlanPreview(mockSearchPlan);
    }, 5500);
  };

  const handleMessageInteraction = (messageId: string, action: string, data?: any) => {
    const message = chatHistory.find(m => m.id === messageId);
    if (!message || message.type !== 'plan-preview') return;

    if (action === 'confirm') {
      // Start search execution in chat
      addProcessingMessage("Starting parallel search across platforms...");
      
      setTimeout(() => {
        addProcessingMessage("Searching LinkedIn, Indeed, and company careers pages...");
      }, 2000);
      
      setTimeout(() => {
        const resultsMessage = {
          id: `results-${Date.now()}`,
          type: 'results' as any,
          message: `## Search Complete! 🎉\n\nFound **47 matching positions** across target companies:\n\n**Top Matches:**\n- Senior React Engineer at Netflix (95% match)\n- Frontend Architect at Stripe (92% match)\n- Full Stack Engineer at Figma (89% match)\n\n**Search Coverage:**\n- LinkedIn: 23 positions\n- Company websites: 18 positions  
- AngelList: 6 positions\n\nReady to review candidates and start outreach!`,
          timestamp: new Date(),
          data: { totalResults: 47, topMatches: 3 }
        };
        addMessage(resultsMessage);
        
        if (currentPositionId) {
          onPositionUpdate(currentPositionId, { status: 'Completed' });
        }
      }, 4000);
      
    } else if (action === 'refine') {
      setIsEditingPlan(true);
    }
  };

  const handlePlanRefinement = (refinement: string) => {
    addProcessingMessage(`Refining plan based on: "${refinement}"`);
    
    setTimeout(() => {
      // Generate updated plan based on refinement
      const message = chatHistory.find(m => m.type === 'plan-preview');
      if (message?.data) {
        const updatedPlan = { ...message.data };
        // Simple keyword-based refinement
        if (refinement.toLowerCase().includes('startup')) {
          updatedPlan.targetCompanies = ['Stripe', 'Figma', 'Notion', 'Linear', 'Vercel'];
        }
        if (refinement.toLowerCase().includes('remote')) {
          updatedPlan.filters.location = 'Remote / Flexible';
        }
        addPlanPreview(updatedPlan);
      }
    }, 2000);
  };

  const handleEdit = () => {
    toast({
      title: "Edit Mode",
      description: "Returning to input mode to edit your specification.",
    });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to Clipboard",
      description: "Content copied successfully.",
    });
  };

  // Main canvas content - show simplified empty state or chat interface
  return (
    <div className="flex-1 flex flex-col">
      {!currentPositionId ? (
        <div className="flex-1 flex items-center justify-center">
          <SimplifiedEmptyState 
            onSendMessage={onSendMessage} 
            disabled={agentProcessing.isProcessing}
          />
        </div>
      ) : (
        <>
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto">
            <ChatContainer 
              chatHistory={chatHistory}
              isProcessing={agentProcessing.isProcessing}
              processingSteps={agentProcessing.processingSteps}
              onMessageInteraction={handleMessageInteraction}
            />
          </div>

          {/* Multi-Input Area */}
          <div className="border-t border-border bg-background p-6">
            <div className="max-w-4xl mx-auto">
              <MultiInputTabs onSendMessage={onSendMessage} disabled={agentProcessing.isProcessing} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainCanvas;