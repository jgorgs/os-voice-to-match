import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { uploadAudioFile } from '../utils/audioUpload';

interface ChatHistoryItem {
  id: string;
  type: 'user' | 'agent' | 'job_spec' | 'confirmation' | 'processing' | 'plan-preview' | 'results';
  message: string;
  timestamp: Date;
  file?: File;
  isProcessing?: boolean;
  data?: any;
}

interface PositionChatHistory {
  [positionId: string]: ChatHistoryItem[];
}

export const useChatHistoryManager = () => {
  const [positionChatHistories, setPositionChatHistories] = useState<PositionChatHistory>({});

  const getChatHistory = (positionId: string | null): ChatHistoryItem[] => {
    if (!positionId) return [];
    return positionChatHistories[positionId] || [];
  };

  const addMessage = (positionId: string, message: ChatHistoryItem) => {
    setPositionChatHistories(prev => ({
      ...prev,
      [positionId]: [...(prev[positionId] || []), message]
    }));
  };

  const addConfirmationMessage = (positionId: string, userMessage: string) => {
    const confirmationMessage: ChatHistoryItem = {
      id: `confirmation-${Date.now()}`,
      type: 'confirmation',
      message: "Perfect! I'll analyze your requirements and create a tailored search plan. This usually takes 10-15 seconds.",
      timestamp: new Date(),
      isProcessing: true
    };
    addMessage(positionId, confirmationMessage);
    return confirmationMessage;
  };

  const addProcessingMessage = (positionId: string, step: string) => {
    const processingMessage: ChatHistoryItem = {
      id: `processing-${Date.now()}`,
      type: 'processing',
      message: step,
      timestamp: new Date()
    };
    addMessage(positionId, processingMessage);
    return processingMessage;
  };

  const addPlanPreview = (positionId: string, searchPlan: any) => {
    const planMessage: ChatHistoryItem = {
      id: `plan-${Date.now()}`,
      type: 'plan-preview',
      message: `## Search Plan Created 🎯

**Job Summary**: ${searchPlan.jobSummary}

**Target Companies**: ${searchPlan.targetCompanies.join(', ')}

**Search Criteria**:
- Experience: ${searchPlan.filters.experience}
- Location: ${searchPlan.filters.location}
- Salary: ${searchPlan.filters.salary}
- Required Skills: ${searchPlan.filters.skills.join(', ')}

**Matching Weights**:
- Skills: ${searchPlan.weights.skills}%
- Experience: ${searchPlan.weights.experience}%
- Location: ${searchPlan.weights.location}%`,
      timestamp: new Date(),
      data: searchPlan
    };
    addMessage(positionId, planMessage);
    return planMessage;
  };

  const handleSendMessage = async (
    positionId: string,
    message: string, 
    audioBlob?: Blob, 
    file?: File,
    onProcessingComplete?: (jobSpec: ChatHistoryItem) => void
  ) => {
    let displayMessage = message;
    let audioFilePath: string | null = null;

    console.log('handleSendMessage called with:', { message, hasAudio: !!audioBlob, hasFile: !!file });

    // Handle audio upload if present
    if (audioBlob) {
      console.log('Processing audio blob, size:', audioBlob.size, 'type:', audioBlob.type);
      
      const originalFileName = file?.name;
      displayMessage = originalFileName ? 
        `Audio file uploaded: ${originalFileName}` : 
        'Voice message recorded';
      
      audioFilePath = await uploadAudioFile(audioBlob, originalFileName);
      console.log('Audio upload result:', audioFilePath);
      
      if (!audioFilePath) {
        console.error('Failed to upload audio file');
      }
    } else if (file) {
      displayMessage = `File uploaded: ${file.name}`;
    }

    const newMessage: ChatHistoryItem = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: displayMessage,
      timestamp: new Date(),
      file
    };

    addMessage(positionId, newMessage);

    try {
      console.log('Saving to database:', { 
        user_input_text: displayMessage, 
        audio_file_path: audioFilePath 
      });

      // Save to Supabase
      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_input_text: displayMessage,
          audio_file_path: audioFilePath
        })
        .select();

      if (error) {
        console.error('Error saving to database:', error);
      } else {
        console.log('Successfully saved to database:', data);
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }

    return { message, hasFile: !!file || !!audioBlob };
  };

  const hasStartedConversation = (positionId: string | null): boolean => {
    if (!positionId) return false;
    const history = getChatHistory(positionId);
    return history.length > 0;
  };

  const clearPositionHistory = (positionId: string) => {
    setPositionChatHistories(prev => ({
      ...prev,
      [positionId]: []
    }));
  };

  return {
    getChatHistory,
    addMessage,
    addConfirmationMessage,
    addProcessingMessage,
    addPlanPreview,
    handleSendMessage,
    hasStartedConversation,
    clearPositionHistory
  };
};