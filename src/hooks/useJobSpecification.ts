import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JobSpecification, JobSpecStatus } from '@/types/workflow';
import { useToast } from '@/hooks/use-toast';

export const useJobSpecification = () => {
  const [jobSpec, setJobSpec] = useState<JobSpecification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createJobSpec = useCallback(async (
    title: string,
    company_name: string,
    original_input?: string,
    audio_file_path?: string,
    document_file_path?: string
  ): Promise<JobSpecification | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_specifications')
        .insert({
          title,
          company_name,
          original_input,
          audio_file_path,
          document_file_path,
          status: 'draft' as JobSpecStatus,
        })
        .select()
        .single();

      if (error) throw error;

      setJobSpec(data);
      toast({
        title: "Job specification created",
        description: "Ready for input processing",
      });

      return data;
    } catch (error) {
      console.error('Error creating job specification:', error);
      toast({
        title: "Error",
        description: "Failed to create job specification",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateJobSpec = useCallback(async (
    id: string,
    updates: Partial<JobSpecification>
  ): Promise<JobSpecification | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_specifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setJobSpec(data);
      return data;
    } catch (error) {
      console.error('Error updating job specification:', error);
      toast({
        title: "Error",
        description: "Failed to update job specification",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const confirmJobSpec = useCallback(async (
    id: string,
    confirmation_notes?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_specifications')
        .update({
          status: 'confirmed' as JobSpecStatus,
          last_confirmed_at: new Date().toISOString(),
          confirmation_notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setJobSpec(data);
      toast({
        title: "Job specification confirmed",
        description: "Ready to begin candidate search",
      });

      return true;
    } catch (error) {
      console.error('Error confirming job specification:', error);
      toast({
        title: "Error",
        description: "Failed to confirm job specification",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const loadJobSpec = useCallback(async (id: string): Promise<JobSpecification | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_specifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setJobSpec(data);
      return data;
    } catch (error) {
      console.error('Error loading job specification:', error);
      toast({
        title: "Error",
        description: "Failed to load job specification",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const parseInputToJobSpec = useCallback(async (
    jobSpecId: string,
    inputText: string
  ): Promise<JobSpecification | null> => {
    // This would typically call an AI service to parse the input
    // For now, we'll create a simple mock parsing
    const mockParsedData = {
      short_description: inputText.slice(0, 200),
      primary_skills: ['JavaScript', 'React', 'TypeScript'], // Mock extraction
      experience_years_min: 3,
      experience_years_max: 7,
      preferred_location: 'Remote',
      working_mode: 'Hybrid',
    };

    return await updateJobSpec(jobSpecId, mockParsedData);
  }, [updateJobSpec]);

  return {
    jobSpec,
    isLoading,
    createJobSpec,
    updateJobSpec,
    confirmJobSpec,
    loadJobSpec,
    parseInputToJobSpec,
  };
};