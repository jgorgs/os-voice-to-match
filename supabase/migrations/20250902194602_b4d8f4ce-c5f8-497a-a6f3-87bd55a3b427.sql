-- Fix RLS policies to allow unauthenticated access temporarily
-- This will be updated once authentication is implemented

-- Drop existing restrictive policies on job_specifications
DROP POLICY IF EXISTS "Authenticated users can create job specifications" ON public.job_specifications;
DROP POLICY IF EXISTS "Users can update their own job specifications" ON public.job_specifications;

-- Create temporary policies that allow unauthenticated access
-- These should be updated once authentication is implemented
CREATE POLICY "Allow anyone to create job specifications (temp)" 
ON public.job_specifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow anyone to update job specifications (temp)" 
ON public.job_specifications 
FOR UPDATE 
USING (true);

-- Keep the existing read policy as it allows everyone
-- "Users can view all job specifications" already exists and is fine

-- Fix other tables with auth issues
-- Update candidate_matches policies to be more permissive temporarily  
DROP POLICY IF EXISTS "Authenticated users can manage candidate matches" ON public.candidate_matches;

CREATE POLICY "Allow anyone to manage candidate matches (temp)" 
ON public.candidate_matches 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Update search_sessions policies
DROP POLICY IF EXISTS "Authenticated users can manage search sessions" ON public.search_sessions;

CREATE POLICY "Allow anyone to manage search sessions (temp)" 
ON public.search_sessions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Update recruiter_feedback policies  
DROP POLICY IF EXISTS "Authenticated users can provide feedback" ON public.recruiter_feedback;

CREATE POLICY "Allow anyone to provide feedback (temp)" 
ON public.recruiter_feedback 
FOR ALL 
USING (true) 
WITH CHECK (true);