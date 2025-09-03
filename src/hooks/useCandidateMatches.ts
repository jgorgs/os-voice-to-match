import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CandidateMatch, CandidateStatus } from '@/types/workflow';
import { useToast } from '@/hooks/use-toast';

export const useCandidateMatches = () => {
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadCandidateMatches = useCallback(async (jobSpecId: string): Promise<CandidateMatch[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('candidate_matches')
        .select('*')
        .eq('job_spec_id', jobSpecId)
        .order('overall_score', { ascending: false });

      if (error) throw error;

      setCandidates(data || []);
      return data || [];
    } catch (error) {
      console.error('Error loading candidate matches:', error);
      toast({
        title: "Error",
        description: "Failed to load candidate matches",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateCandidateStatus = useCallback(async (
    candidateId: string, 
    status: CandidateStatus
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('candidate_matches')
        .update({ status })
        .eq('id', candidateId);

      if (error) throw error;

      // Update local state
      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? { ...c, status } : c
      ));

      return true;
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast({
        title: "Error",
        description: "Failed to update candidate status",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    candidates,
    isLoading,
    loadCandidateMatches,
    updateCandidateStatus,
  };
};