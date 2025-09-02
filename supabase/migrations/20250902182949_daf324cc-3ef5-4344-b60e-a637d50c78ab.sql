-- Phase 1: Database & Schema Foundation for Production Workflow

-- Create enum for job specification status
CREATE TYPE job_spec_status AS ENUM ('draft', 'confirmed', 'searching', 'completed', 'archived');

-- Create enum for search layer types
CREATE TYPE search_layer AS ENUM ('internal', 'similar_companies', 'external');

-- Create enum for candidate status
CREATE TYPE candidate_status AS ENUM ('pending', 'approved', 'rejected', 'interviewed', 'hired');

-- Create job_specifications table (replaces current chat-based approach)
CREATE TABLE public.job_specifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status job_spec_status NOT NULL DEFAULT 'draft',
    
    -- Job details
    short_description TEXT,
    responsibilities TEXT,
    leadership_responsibilities TEXT,
    key_requirements TEXT,
    business_reasons TEXT,
    
    -- Skills and experience
    primary_skills TEXT[],
    secondary_skills TEXT[],
    experience_years_min INTEGER,
    experience_years_max INTEGER,
    level_raw TEXT,
    
    -- Location and work setup
    preferred_location TEXT,
    other_location TEXT,
    working_mode TEXT,
    
    -- Compensation
    currency CHAR(3) DEFAULT 'USD',
    salary_base_low NUMERIC,
    salary_base_high NUMERIC,
    bonus_low NUMERIC,
    bonus_high NUMERIC,
    ote_low NUMERIC,
    ote_high NUMERIC,
    
    -- Target companies and other filters
    target_companies TEXT,
    excluded_companies JSONB,
    preferred_company_type TEXT,
    preferred_company_size TEXT,
    
    -- AI processing
    original_input TEXT, -- voice transcription or text input
    audio_file_path TEXT, -- reference to uploaded audio
    document_file_path TEXT, -- reference to uploaded document
    embedding VECTOR(1536), -- for similarity search
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    last_confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmation_notes TEXT
);

-- Create search_configurations table (tracks search parameters and costs)
CREATE TABLE public.search_configurations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    job_spec_id UUID NOT NULL REFERENCES public.job_specifications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Search settings
    enabled_layers search_layer[] NOT NULL DEFAULT ARRAY['internal']::search_layer[],
    max_candidates_per_layer INTEGER NOT NULL DEFAULT 25,
    
    -- Scoring weights (0-100)
    skills_weight INTEGER NOT NULL DEFAULT 40,
    experience_weight INTEGER NOT NULL DEFAULT 30,
    location_weight INTEGER NOT NULL DEFAULT 20,
    company_weight INTEGER NOT NULL DEFAULT 10,
    
    -- Cost tracking
    estimated_cost_cents INTEGER NOT NULL DEFAULT 0,
    actual_cost_cents INTEGER,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create candidate_matches table (stores search results and scores)
CREATE TABLE public.candidate_matches (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    search_config_id UUID NOT NULL REFERENCES public.search_configurations(id) ON DELETE CASCADE,
    job_spec_id UUID NOT NULL REFERENCES public.job_specifications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Candidate reference (assumes existing candidates table)
    candidate_id BIGINT REFERENCES public.candidates(id),
    
    -- Search layer that found this candidate
    found_via_layer search_layer NOT NULL,
    
    -- Scoring
    overall_score NUMERIC(5,2) NOT NULL, -- 0-100 with 2 decimal places
    skills_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    experience_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    location_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    company_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    
    -- Score breakdown explanation (for UI display)
    score_breakdown JSONB,
    
    -- Status and ranking
    status candidate_status NOT NULL DEFAULT 'pending',
    rank_position INTEGER,
    
    -- Metadata
    search_metadata JSONB -- store additional search context
);

-- Create recruiter_feedback table (tracks recruiter decisions and learning)
CREATE TABLE public.recruiter_feedback (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_match_id UUID NOT NULL REFERENCES public.candidate_matches(id) ON DELETE CASCADE,
    job_spec_id UUID NOT NULL REFERENCES public.job_specifications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Feedback details
    decision candidate_status NOT NULL,
    feedback_notes TEXT,
    
    -- Weight adjustments (if recruiter modified sliders)
    adjusted_skills_weight INTEGER,
    adjusted_experience_weight INTEGER,
    adjusted_location_weight INTEGER,
    adjusted_company_weight INTEGER,
    
    -- Learning data
    was_interviewed BOOLEAN,
    was_hired BOOLEAN,
    rejection_reason TEXT,
    
    -- Metadata
    feedback_by UUID REFERENCES auth.users(id),
    session_id UUID -- for grouping batch feedback
);

-- Create search_sessions table (tracks workflow iterations)
CREATE TABLE public.search_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    job_spec_id UUID NOT NULL REFERENCES public.job_specifications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Session metadata
    iteration_number INTEGER NOT NULL DEFAULT 1,
    total_candidates_found INTEGER NOT NULL DEFAULT 0,
    approved_candidates INTEGER NOT NULL DEFAULT 0,
    rejected_candidates INTEGER NOT NULL DEFAULT 0,
    
    -- Cost tracking
    total_cost_cents INTEGER NOT NULL DEFAULT 0,
    
    -- Session status
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.job_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for job_specifications
CREATE POLICY "Users can view all job specifications" 
ON public.job_specifications 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create job specifications" 
ON public.job_specifications 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own job specifications" 
ON public.job_specifications 
FOR UPDATE 
USING (created_by = auth.uid() OR auth.uid() IS NOT NULL);

-- Create RLS policies for search_configurations
CREATE POLICY "Users can view all search configurations" 
ON public.search_configurations 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage search configurations" 
ON public.search_configurations 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for candidate_matches
CREATE POLICY "Users can view all candidate matches" 
ON public.candidate_matches 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage candidate matches" 
ON public.candidate_matches 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for recruiter_feedback
CREATE POLICY "Users can view all recruiter feedback" 
ON public.recruiter_feedback 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can provide feedback" 
ON public.recruiter_feedback 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for search_sessions
CREATE POLICY "Users can view all search sessions" 
ON public.search_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage search sessions" 
ON public.search_sessions 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_job_specifications_status ON public.job_specifications(status);
CREATE INDEX idx_job_specifications_created_by ON public.job_specifications(created_by);
CREATE INDEX idx_job_specifications_embedding ON public.job_specifications USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX idx_search_configurations_job_spec ON public.search_configurations(job_spec_id);
CREATE INDEX idx_search_configurations_active ON public.search_configurations(is_active);

CREATE INDEX idx_candidate_matches_search_config ON public.candidate_matches(search_config_id);
CREATE INDEX idx_candidate_matches_job_spec ON public.candidate_matches(job_spec_id);
CREATE INDEX idx_candidate_matches_candidate ON public.candidate_matches(candidate_id);
CREATE INDEX idx_candidate_matches_status ON public.candidate_matches(status);
CREATE INDEX idx_candidate_matches_score ON public.candidate_matches(overall_score DESC);

CREATE INDEX idx_recruiter_feedback_candidate_match ON public.recruiter_feedback(candidate_match_id);
CREATE INDEX idx_recruiter_feedback_job_spec ON public.recruiter_feedback(job_spec_id);
CREATE INDEX idx_recruiter_feedback_decision ON public.recruiter_feedback(decision);

CREATE INDEX idx_search_sessions_job_spec ON public.search_sessions(job_spec_id);
CREATE INDEX idx_search_sessions_active ON public.search_sessions(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_job_specifications_updated_at
    BEFORE UPDATE ON public.job_specifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiter_feedback_updated_at
    BEFORE UPDATE ON public.recruiter_feedback
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();