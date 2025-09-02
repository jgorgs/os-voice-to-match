// Enhanced types for the production workflow

export type JobSpecStatus = 'draft' | 'confirmed' | 'searching' | 'completed' | 'archived';
export type CandidateStatus = 'pending' | 'approved' | 'rejected' | 'interviewed' | 'hired';

export interface JobSpecification {
  id: string;
  title: string;
  company_name: string;
  created_at: string;
  updated_at: string;
  status: JobSpecStatus;
  
  // Job details
  short_description?: string;
  responsibilities?: string;
  leadership_responsibilities?: string;
  key_requirements?: string;
  business_reasons?: string;
  
  // Skills and experience
  primary_skills?: string[];
  secondary_skills?: string[];
  experience_years_min?: number;
  experience_years_max?: number;
  level_raw?: string;
  
  // Location and work setup
  preferred_location?: string;
  other_location?: string;
  working_mode?: string;
  
  // Compensation
  currency?: string;
  salary_base_low?: number;
  salary_base_high?: number;
  bonus_low?: number;
  bonus_high?: number;
  ote_low?: number;
  ote_high?: number;
  
  // Target companies and filters
  target_companies?: string;
  excluded_companies?: any;
  preferred_company_type?: string;
  preferred_company_size?: string;
  
  // AI processing
  original_input?: string;
  audio_file_path?: string;
  document_file_path?: string;
  
  // Metadata
  created_by?: string;
  last_confirmed_at?: string;
  confirmation_notes?: string;
}

export interface CandidateMatch {
  id: string;
  job_spec_id: string;
  created_at: string;
  
  // Candidate reference
  candidate_id: number;
  
  // Scoring
  overall_score: number;
  skills_score: number;
  experience_score: number;
  location_score: number;
  company_score: number;
  
  // Score breakdown explanation
  score_breakdown?: any;
  
  // Status and ranking
  status: CandidateStatus;
  rank_position?: number;
  
  // Metadata
  search_metadata?: any;
}

export interface RecruiterFeedback {
  id: string;
  candidate_match_id: string;
  job_spec_id: string;
  created_at: string;
  updated_at: string;
  
  // Feedback details
  decision: CandidateStatus;
  feedback_notes?: string;
  
  // Weight adjustments
  adjusted_skills_weight?: number;
  adjusted_experience_weight?: number;
  adjusted_location_weight?: number;
  adjusted_company_weight?: number;
  
  // Learning data
  was_interviewed?: boolean;
  was_hired?: boolean;
  rejection_reason?: string;
  
  // Metadata
  feedback_by?: string;
  session_id?: string;
}

export interface SearchSession {
  id: string;
  job_spec_id: string;
  created_at: string;
  completed_at?: string;
  
  // Session metadata
  iteration_number: number;
  total_candidates_found: number;
  approved_candidates: number;
  rejected_candidates: number;
  
  // Session status
  is_active: boolean;
  created_by?: string;
}