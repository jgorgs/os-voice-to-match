import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Position {
  id: string;
  title: string;
  company: string;
  date: Date;
  status?: string;
}

export const usePositions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadPositions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_specifications')
        .select('id, title, company_name, created_at, status')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedPositions: Position[] = (data || []).map(job => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        date: new Date(job.created_at),
        status: job.status
      }));

      setPositions(transformedPositions);
    } catch (error) {
      console.error('Error loading positions:', error);
      toast({
        title: "Error",
        description: "Failed to load positions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createPosition = useCallback(async (title: string, company: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('job_specifications')
        .insert({
          title,
          company_name: company,
          status: 'draft'
        })
        .select('id')
        .single();

      if (error) throw error;

      await loadPositions(); // Refresh the list
      return data.id;
    } catch (error) {
      console.error('Error creating position:', error);
      toast({
        title: "Error",
        description: "Failed to create position",
        variant: "destructive",
      });
      return null;
    }
  }, [loadPositions, toast]);

  const updatePosition = useCallback(async (id: string, updates: Partial<Position>): Promise<boolean> => {
    try {
      // Map Position interface fields to database fields
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.company !== undefined) dbUpdates.company_name = updates.company;

      const { error } = await supabase
        .from('job_specifications')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      // Update local state optimistically
      setPositions(prev => prev.map(pos => 
        pos.id === id ? { ...pos, ...updates } : pos
      ));

      return true;
    } catch (error) {
      console.error('Error updating position:', error);
      toast({
        title: "Error",
        description: "Failed to update position",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const deletePosition = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('job_specifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPositions(prev => prev.filter(pos => pos.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting position:', error);
      toast({
        title: "Error",
        description: "Failed to delete position",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Load positions on mount
  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  return {
    positions,
    isLoading,
    loadPositions,
    createPosition,
    updatePosition,
    deletePosition,
  };
};