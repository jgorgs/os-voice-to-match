import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CandidateStatus } from '@/types/workflow';
import { useToast } from '@/hooks/use-toast';

export const useCandidateFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitFeedback = useCallback(async (
    candidateMatchId: string,
    jobSpecId: string,
    decision: CandidateStatus,
    feedbackNotes?: string
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      // Insert feedback record
      const { error: feedbackError } = await supabase
        .from('recruiter_feedback')
        .insert({
          candidate_match_id: candidateMatchId,
          job_spec_id: jobSpecId,
          decision,
          feedback_notes: feedbackNotes,
        });

      if (feedbackError) throw feedbackError;

      // Update candidate match status
      const { error: updateError } = await supabase
        .from('candidate_matches')
        .update({ status: decision })
        .eq('id', candidateMatchId);

      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  const getFeedbackAnalytics = useCallback(async (jobSpecId: string) => {
    try {
      const { data, error } = await supabase
        .from('recruiter_feedback')
        .select('decision, feedback_notes')
        .eq('job_spec_id', jobSpecId);

      if (error) throw error;

      // Analyze patterns in rejections for refinement suggestions
      const rejectionReasons = data
        ?.filter(f => ['rejected'].includes(f.decision))
        .map(f => f.feedback_notes)
        .filter(Boolean);

      return {
        totalFeedback: data?.length || 0,
        rejectionReasons,
      };
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      return { totalFeedback: 0, rejectionReasons: [] };
    }
  }, []);

  return {
    isSubmitting,
    submitFeedback,
    getFeedbackAnalytics,
  };
};