import { useState, useCallback } from 'react';
import { useJobSpecification } from './useJobSpecification';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useWorkflowIntegration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createJobSpec, parseInputToJobSpec } = useJobSpecification();
  const { toast } = useToast();

  const handleInput = useCallback(async (
    message: string,
    audioBlob?: Blob,
    file?: File,
    positionId?: string
  ) => {
    setIsProcessing(true);
    
    try {
      // Upload audio file if provided
      let audioFilePath: string | undefined;
      if (audioBlob) {
        const fileName = `audio_${Date.now()}.${audioBlob.type.includes('mp4') ? 'mp4' : 'webm'}`;
        const { data: audioData, error: audioError } = await supabase.storage
          .from('audio-files')
          .upload(fileName, audioBlob);

        if (audioError) {
          console.error('Error uploading audio:', audioError);
          toast({
            title: "Audio Upload Error",
            description: "Failed to upload audio file",
            variant: "destructive",
          });
        } else {
          audioFilePath = audioData.path;
        }
      }

      // Create job specification from the input
      const jobSpec = await createJobSpec(
        "New Position", // Default title, will be updated during parsing
        "Company Name", // Default company, will be updated during parsing
        message,
        audioFilePath,
        file?.name // Store file name if provided
      );

      if (jobSpec) {
        toast({
          title: "Processing Your Request",
          description: "Analyzing your input to create job specification...",
        });

        // Parse the input to update job specification details
        const updatedJobSpec = await parseInputToJobSpec(jobSpec.id, message);
        
        if (updatedJobSpec) {
          toast({
            title: "Job Specification Created",
            description: "Your position details have been analyzed and saved.",
          });
          
          return { success: true, jobSpecId: jobSpec.id };
        }
      }
      
      return { success: false };
    } catch (error) {
      console.error('Error in workflow integration:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process your input. Please try again.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  }, [createJobSpec, parseInputToJobSpec, toast]);

  return {
    isProcessing,
    handleInput,
  };
};