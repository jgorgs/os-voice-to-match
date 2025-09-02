export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      candidate_matches: {
        Row: {
          candidate_id: number | null
          company_score: number
          created_at: string
          experience_score: number
          found_via_layer: Database["public"]["Enums"]["search_layer"]
          id: string
          job_spec_id: string
          location_score: number
          overall_score: number
          rank_position: number | null
          score_breakdown: Json | null
          search_config_id: string
          search_metadata: Json | null
          skills_score: number
          status: Database["public"]["Enums"]["candidate_status"]
        }
        Insert: {
          candidate_id?: number | null
          company_score?: number
          created_at?: string
          experience_score?: number
          found_via_layer: Database["public"]["Enums"]["search_layer"]
          id?: string
          job_spec_id: string
          location_score?: number
          overall_score: number
          rank_position?: number | null
          score_breakdown?: Json | null
          search_config_id: string
          search_metadata?: Json | null
          skills_score?: number
          status?: Database["public"]["Enums"]["candidate_status"]
        }
        Update: {
          candidate_id?: number | null
          company_score?: number
          created_at?: string
          experience_score?: number
          found_via_layer?: Database["public"]["Enums"]["search_layer"]
          id?: string
          job_spec_id?: string
          location_score?: number
          overall_score?: number
          rank_position?: number | null
          score_breakdown?: Json | null
          search_config_id?: string
          search_metadata?: Json | null
          skills_score?: number
          status?: Database["public"]["Enums"]["candidate_status"]
        }
        Relationships: [
          {
            foreignKeyName: "candidate_matches_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_matches_job_spec_id_fkey"
            columns: ["job_spec_id"]
            isOneToOne: false
            referencedRelation: "job_specifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_matches_search_config_id_fkey"
            columns: ["search_config_id"]
            isOneToOne: false
            referencedRelation: "search_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          about: string | null
          accomplishments: string | null
          added_bonus: string | null
          badges: Json | null
          budget_over_amount: number | null
          career_goal: string | null
          career_role: string | null
          certifications: string | null
          companies_requested: Json | null
          compensation: string | null
          created_at: string
          current_company: string | null
          cv_embedding: string | null
          cv_url: string | null
          deal_breaker: string | null
          deal_cycle: string | null
          deal_size: number | null
          degree_level: string | null
          degree_title: string | null
          development: string | null
          dream_job: string | null
          education: Json | null
          essentials: string | null
          excluded_companies: Json | null
          experience: Json | null
          field_of_specialty: Json | null
          full_name: string | null
          function: Json | null
          how_did_you_find_us: string | null
          id: number
          ideal_function: string | null
          industry: string | null
          job_company_id: string | null
          job_company_name: string | null
          job_search_status: string | null
          job_title: string | null
          last_modified: string | null
          last_refreshed: string | null
          level: Json | null
          level_of_hire: string | null
          level_text: string | null
          linkedin_url: string | null
          location_name: string | null
          new_business: boolean | null
          new_company: string | null
          open_to_travel: boolean | null
          open_to_try: boolean | null
          os_team_member: Json | null
          personal_email: string | null
          phone_number: string | null
          preferred_company_size: string | null
          preferred_company_type: string | null
          preferred_team_size: number | null
          primary_skill: string | null
          productivity: string | null
          quota: number | null
          quota_engage: number | null
          reason_lost: string | null
          relocation_preference: string | null
          resource_level: string | null
          school: string | null
          secondary_skill: string | null
          skills: string | null
          status: Json | null
          time_frame: string | null
          what_outs: string | null
          work_email: string | null
          work_mode: string | null
        }
        Insert: {
          about?: string | null
          accomplishments?: string | null
          added_bonus?: string | null
          badges?: Json | null
          budget_over_amount?: number | null
          career_goal?: string | null
          career_role?: string | null
          certifications?: string | null
          companies_requested?: Json | null
          compensation?: string | null
          created_at?: string
          current_company?: string | null
          cv_embedding?: string | null
          cv_url?: string | null
          deal_breaker?: string | null
          deal_cycle?: string | null
          deal_size?: number | null
          degree_level?: string | null
          degree_title?: string | null
          development?: string | null
          dream_job?: string | null
          education?: Json | null
          essentials?: string | null
          excluded_companies?: Json | null
          experience?: Json | null
          field_of_specialty?: Json | null
          full_name?: string | null
          function?: Json | null
          how_did_you_find_us?: string | null
          id?: number
          ideal_function?: string | null
          industry?: string | null
          job_company_id?: string | null
          job_company_name?: string | null
          job_search_status?: string | null
          job_title?: string | null
          last_modified?: string | null
          last_refreshed?: string | null
          level?: Json | null
          level_of_hire?: string | null
          level_text?: string | null
          linkedin_url?: string | null
          location_name?: string | null
          new_business?: boolean | null
          new_company?: string | null
          open_to_travel?: boolean | null
          open_to_try?: boolean | null
          os_team_member?: Json | null
          personal_email?: string | null
          phone_number?: string | null
          preferred_company_size?: string | null
          preferred_company_type?: string | null
          preferred_team_size?: number | null
          primary_skill?: string | null
          productivity?: string | null
          quota?: number | null
          quota_engage?: number | null
          reason_lost?: string | null
          relocation_preference?: string | null
          resource_level?: string | null
          school?: string | null
          secondary_skill?: string | null
          skills?: string | null
          status?: Json | null
          time_frame?: string | null
          what_outs?: string | null
          work_email?: string | null
          work_mode?: string | null
        }
        Update: {
          about?: string | null
          accomplishments?: string | null
          added_bonus?: string | null
          badges?: Json | null
          budget_over_amount?: number | null
          career_goal?: string | null
          career_role?: string | null
          certifications?: string | null
          companies_requested?: Json | null
          compensation?: string | null
          created_at?: string
          current_company?: string | null
          cv_embedding?: string | null
          cv_url?: string | null
          deal_breaker?: string | null
          deal_cycle?: string | null
          deal_size?: number | null
          degree_level?: string | null
          degree_title?: string | null
          development?: string | null
          dream_job?: string | null
          education?: Json | null
          essentials?: string | null
          excluded_companies?: Json | null
          experience?: Json | null
          field_of_specialty?: Json | null
          full_name?: string | null
          function?: Json | null
          how_did_you_find_us?: string | null
          id?: number
          ideal_function?: string | null
          industry?: string | null
          job_company_id?: string | null
          job_company_name?: string | null
          job_search_status?: string | null
          job_title?: string | null
          last_modified?: string | null
          last_refreshed?: string | null
          level?: Json | null
          level_of_hire?: string | null
          level_text?: string | null
          linkedin_url?: string | null
          location_name?: string | null
          new_business?: boolean | null
          new_company?: string | null
          open_to_travel?: boolean | null
          open_to_try?: boolean | null
          os_team_member?: Json | null
          personal_email?: string | null
          phone_number?: string | null
          preferred_company_size?: string | null
          preferred_company_type?: string | null
          preferred_team_size?: number | null
          primary_skill?: string | null
          productivity?: string | null
          quota?: number | null
          quota_engage?: number | null
          reason_lost?: string | null
          relocation_preference?: string | null
          resource_level?: string | null
          school?: string | null
          secondary_skill?: string | null
          skills?: string | null
          status?: Json | null
          time_frame?: string | null
          what_outs?: string | null
          work_email?: string | null
          work_mode?: string | null
        }
        Relationships: []
      }
      candidates_bubble_staging: {
        Row: {
          _ingested_at: string | null
          _source_file: string | null
          about: string | null
          Badges: string | null
          "Companies requested": string | null
          contact: string | null
          "Creation Date": string | null
          Creator: string | null
          CV: string | null
          CV_url: string | null
          "CV-available": string | null
          "Date Approved": string | null
          facebook: string | null
          "Field of specialty": string | null
          "Field Of Specialty": string | null
          Function: string | null
          "Hiring Details (deleted)": string | null
          information: string | null
          "Is Chrome Extension": string | null
          "Is Target Profile": string | null
          "Is Visible": string | null
          "Job Title": string | null
          Level: string | null
          "level of hire": string | null
          Linkedin: string | null
          "Modified Date": string | null
          "name-text": string | null
          ProfileIsActive: string | null
          Slug: string | null
          status: string | null
          "status(os)": string | null
          twitter: string | null
          "unique id": string | null
          "What Outscout Should Know": string | null
        }
        Insert: {
          _ingested_at?: string | null
          _source_file?: string | null
          about?: string | null
          Badges?: string | null
          "Companies requested"?: string | null
          contact?: string | null
          "Creation Date"?: string | null
          Creator?: string | null
          CV?: string | null
          CV_url?: string | null
          "CV-available"?: string | null
          "Date Approved"?: string | null
          facebook?: string | null
          "Field of specialty"?: string | null
          "Field Of Specialty"?: string | null
          Function?: string | null
          "Hiring Details (deleted)"?: string | null
          information?: string | null
          "Is Chrome Extension"?: string | null
          "Is Target Profile"?: string | null
          "Is Visible"?: string | null
          "Job Title"?: string | null
          Level?: string | null
          "level of hire"?: string | null
          Linkedin?: string | null
          "Modified Date"?: string | null
          "name-text"?: string | null
          ProfileIsActive?: string | null
          Slug?: string | null
          status?: string | null
          "status(os)"?: string | null
          twitter?: string | null
          "unique id"?: string | null
          "What Outscout Should Know"?: string | null
        }
        Update: {
          _ingested_at?: string | null
          _source_file?: string | null
          about?: string | null
          Badges?: string | null
          "Companies requested"?: string | null
          contact?: string | null
          "Creation Date"?: string | null
          Creator?: string | null
          CV?: string | null
          CV_url?: string | null
          "CV-available"?: string | null
          "Date Approved"?: string | null
          facebook?: string | null
          "Field of specialty"?: string | null
          "Field Of Specialty"?: string | null
          Function?: string | null
          "Hiring Details (deleted)"?: string | null
          information?: string | null
          "Is Chrome Extension"?: string | null
          "Is Target Profile"?: string | null
          "Is Visible"?: string | null
          "Job Title"?: string | null
          Level?: string | null
          "level of hire"?: string | null
          Linkedin?: string | null
          "Modified Date"?: string | null
          "name-text"?: string | null
          ProfileIsActive?: string | null
          Slug?: string | null
          status?: string | null
          "status(os)"?: string | null
          twitter?: string | null
          "unique id"?: string | null
          "What Outscout Should Know"?: string | null
        }
        Relationships: []
      }
      candidates_bubble_staging_OLD: {
        Row: {
          "(new) Company size": string | null
          "(new) Company Type": string | null
          "*WorkMode": string | null
          "Accomplishments/Awards": string | null
          "Added Bonus": string | null
          "Amount of Travel": string | null
          "Budget Overseen": string | null
          Candidate: string | null
          "Career Goal Yr1": string | null
          "Career Goal Yr3": string | null
          "Career Goal Yr5": string | null
          "Career Roles": string | null
          Career_Achievements: string | null
          Certification: string | null
          Certifications: string | null
          city: string | null
          "Company Size": string | null
          "Company Type": string | null
          "Compensation Range": string | null
          created_at: string | null
          "Creation Date": string | null
          "Current Company": string | null
          cv_url: string | null
          "Deal Breakers": string | null
          "Deal Cycle": string | null
          "Deal Size": string | null
          "Degree Level": string | null
          "Degree Title": string | null
          "Development Areas": string | null
          "Dream Job": string | null
          "Education_&_Training": string | null
          Essentials: string | null
          "Excluded companies": string | null
          "Excluded companies (text)": string | null
          "Function (option)": string | null
          "Function (text - deprecated?)": string | null
          "How Did you hear about Us(Other)": string | null
          id: number
          "Ideal function": string | null
          "Ideal next role": string | null
          "Job Search Info": string | null
          "job-experience": string | null
          "Level of Hire": string | null
          "Level-text": string | null
          NewBusinessQuota: string | null
          "open-to-relocation": string | null
          "open-to-travel": string | null
          "open-to-travel-anywhere": string | null
          "Phone Number": string | null
          "Primary Skills": string | null
          "Productivity Indicators ": string | null
          Quota: string | null
          QuotaEngagement: string | null
          "ready-to-relocate": string | null
          "Reason Looking": string | null
          Relocation_Options: string | null
          School: string | null
          "Secondary Skills": string | null
          Slug: string | null
          "Team Size": string | null
          "unique id": string | null
          user: string | null
          Values: string | null
          "What Outscout Should Know": string | null
          "Work Mode": string | null
        }
        Insert: {
          "(new) Company size"?: string | null
          "(new) Company Type"?: string | null
          "*WorkMode"?: string | null
          "Accomplishments/Awards"?: string | null
          "Added Bonus"?: string | null
          "Amount of Travel"?: string | null
          "Budget Overseen"?: string | null
          Candidate?: string | null
          "Career Goal Yr1"?: string | null
          "Career Goal Yr3"?: string | null
          "Career Goal Yr5"?: string | null
          "Career Roles"?: string | null
          Career_Achievements?: string | null
          Certification?: string | null
          Certifications?: string | null
          city?: string | null
          "Company Size"?: string | null
          "Company Type"?: string | null
          "Compensation Range"?: string | null
          created_at?: string | null
          "Creation Date"?: string | null
          "Current Company"?: string | null
          cv_url?: string | null
          "Deal Breakers"?: string | null
          "Deal Cycle"?: string | null
          "Deal Size"?: string | null
          "Degree Level"?: string | null
          "Degree Title"?: string | null
          "Development Areas"?: string | null
          "Dream Job"?: string | null
          "Education_&_Training"?: string | null
          Essentials?: string | null
          "Excluded companies"?: string | null
          "Excluded companies (text)"?: string | null
          "Function (option)"?: string | null
          "Function (text - deprecated?)"?: string | null
          "How Did you hear about Us(Other)"?: string | null
          id?: number
          "Ideal function"?: string | null
          "Ideal next role"?: string | null
          "Job Search Info"?: string | null
          "job-experience"?: string | null
          "Level of Hire"?: string | null
          "Level-text"?: string | null
          NewBusinessQuota?: string | null
          "open-to-relocation"?: string | null
          "open-to-travel"?: string | null
          "open-to-travel-anywhere"?: string | null
          "Phone Number"?: string | null
          "Primary Skills"?: string | null
          "Productivity Indicators "?: string | null
          Quota?: string | null
          QuotaEngagement?: string | null
          "ready-to-relocate"?: string | null
          "Reason Looking"?: string | null
          Relocation_Options?: string | null
          School?: string | null
          "Secondary Skills"?: string | null
          Slug?: string | null
          "Team Size"?: string | null
          "unique id"?: string | null
          user?: string | null
          Values?: string | null
          "What Outscout Should Know"?: string | null
          "Work Mode"?: string | null
        }
        Update: {
          "(new) Company size"?: string | null
          "(new) Company Type"?: string | null
          "*WorkMode"?: string | null
          "Accomplishments/Awards"?: string | null
          "Added Bonus"?: string | null
          "Amount of Travel"?: string | null
          "Budget Overseen"?: string | null
          Candidate?: string | null
          "Career Goal Yr1"?: string | null
          "Career Goal Yr3"?: string | null
          "Career Goal Yr5"?: string | null
          "Career Roles"?: string | null
          Career_Achievements?: string | null
          Certification?: string | null
          Certifications?: string | null
          city?: string | null
          "Company Size"?: string | null
          "Company Type"?: string | null
          "Compensation Range"?: string | null
          created_at?: string | null
          "Creation Date"?: string | null
          "Current Company"?: string | null
          cv_url?: string | null
          "Deal Breakers"?: string | null
          "Deal Cycle"?: string | null
          "Deal Size"?: string | null
          "Degree Level"?: string | null
          "Degree Title"?: string | null
          "Development Areas"?: string | null
          "Dream Job"?: string | null
          "Education_&_Training"?: string | null
          Essentials?: string | null
          "Excluded companies"?: string | null
          "Excluded companies (text)"?: string | null
          "Function (option)"?: string | null
          "Function (text - deprecated?)"?: string | null
          "How Did you hear about Us(Other)"?: string | null
          id?: number
          "Ideal function"?: string | null
          "Ideal next role"?: string | null
          "Job Search Info"?: string | null
          "job-experience"?: string | null
          "Level of Hire"?: string | null
          "Level-text"?: string | null
          NewBusinessQuota?: string | null
          "open-to-relocation"?: string | null
          "open-to-travel"?: string | null
          "open-to-travel-anywhere"?: string | null
          "Phone Number"?: string | null
          "Primary Skills"?: string | null
          "Productivity Indicators "?: string | null
          Quota?: string | null
          QuotaEngagement?: string | null
          "ready-to-relocate"?: string | null
          "Reason Looking"?: string | null
          Relocation_Options?: string | null
          School?: string | null
          "Secondary Skills"?: string | null
          Slug?: string | null
          "Team Size"?: string | null
          "unique id"?: string | null
          user?: string | null
          Values?: string | null
          "What Outscout Should Know"?: string | null
          "Work Mode"?: string | null
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          agent_steps: string[] | null
          audio_file_path: string | null
          created_at: string
          final_job_spec: string | null
          id: string
          user_input_text: string | null
        }
        Insert: {
          agent_steps?: string[] | null
          audio_file_path?: string | null
          created_at?: string
          final_job_spec?: string | null
          id?: string
          user_input_text?: string | null
        }
        Update: {
          agent_steps?: string[] | null
          audio_file_path?: string | null
          created_at?: string
          final_job_spec?: string | null
          id?: string
          user_input_text?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          about: string | null
          bubble_created_at: string | null
          bubble_id: string | null
          bubble_raw: Json | null
          company_slug: string | null
          created_at: string
          domain: string | null
          founded: string | null
          funding_stage: string | null
          headcount: string | null
          id: number
          industry: string | null
          last_refreshed: string | null
          linkedin_url: string | null
          location_name: string | null
          modified_at: string | null
          name: string | null
          office_location: string | null
          phone_number: string | null
          plan: string | null
          score: number | null
          size: string | null
          stage: string | null
          status: string | null
          subsector: string | null
          website: string | null
          year_founded: string | null
        }
        Insert: {
          about?: string | null
          bubble_created_at?: string | null
          bubble_id?: string | null
          bubble_raw?: Json | null
          company_slug?: string | null
          created_at?: string
          domain?: string | null
          founded?: string | null
          funding_stage?: string | null
          headcount?: string | null
          id?: number
          industry?: string | null
          last_refreshed?: string | null
          linkedin_url?: string | null
          location_name?: string | null
          modified_at?: string | null
          name?: string | null
          office_location?: string | null
          phone_number?: string | null
          plan?: string | null
          score?: number | null
          size?: string | null
          stage?: string | null
          status?: string | null
          subsector?: string | null
          website?: string | null
          year_founded?: string | null
        }
        Update: {
          about?: string | null
          bubble_created_at?: string | null
          bubble_id?: string | null
          bubble_raw?: Json | null
          company_slug?: string | null
          created_at?: string
          domain?: string | null
          founded?: string | null
          funding_stage?: string | null
          headcount?: string | null
          id?: number
          industry?: string | null
          last_refreshed?: string | null
          linkedin_url?: string | null
          location_name?: string | null
          modified_at?: string | null
          name?: string | null
          office_location?: string | null
          phone_number?: string | null
          plan?: string | null
          score?: number | null
          size?: string | null
          stage?: string | null
          status?: string | null
          subsector?: string | null
          website?: string | null
          year_founded?: string | null
        }
        Relationships: []
      }
      companies_bubble_staging: {
        Row: {
          about: string | null
          "Account Manager": string | null
          Candidates: string | null
          CEO: string | null
          Company: string | null
          "Company Bio": string | null
          "Compesation Range": string | null
          "Creation Date": string | null
          Crunchbase: string | null
          Email: string | null
          facebook: string | null
          File: string | null
          "Funding Stage": string | null
          Github: string | null
          headcount: string | null
          "Hiring Focus": string | null
          industry: string | null
          Linkedin: string | null
          Logo: string | null
          "Modified Date": string | null
          "new-industry": string | null
          "new-subsector": string | null
          "Office Location": string | null
          "Phone Number": string | null
          plan: string | null
          Positions: string | null
          Revenues: string | null
          Score: string | null
          "Score Google Sheets": string | null
          Slug: string | null
          stage: string | null
          subsector: string | null
          Tag: string | null
          "unique id": string | null
          Website: string | null
          "Working Mode": string | null
          "Year Founded": string | null
        }
        Insert: {
          about?: string | null
          "Account Manager"?: string | null
          Candidates?: string | null
          CEO?: string | null
          Company?: string | null
          "Company Bio"?: string | null
          "Compesation Range"?: string | null
          "Creation Date"?: string | null
          Crunchbase?: string | null
          Email?: string | null
          facebook?: string | null
          File?: string | null
          "Funding Stage"?: string | null
          Github?: string | null
          headcount?: string | null
          "Hiring Focus"?: string | null
          industry?: string | null
          Linkedin?: string | null
          Logo?: string | null
          "Modified Date"?: string | null
          "new-industry"?: string | null
          "new-subsector"?: string | null
          "Office Location"?: string | null
          "Phone Number"?: string | null
          plan?: string | null
          Positions?: string | null
          Revenues?: string | null
          Score?: string | null
          "Score Google Sheets"?: string | null
          Slug?: string | null
          stage?: string | null
          subsector?: string | null
          Tag?: string | null
          "unique id"?: string | null
          Website?: string | null
          "Working Mode"?: string | null
          "Year Founded"?: string | null
        }
        Update: {
          about?: string | null
          "Account Manager"?: string | null
          Candidates?: string | null
          CEO?: string | null
          Company?: string | null
          "Company Bio"?: string | null
          "Compesation Range"?: string | null
          "Creation Date"?: string | null
          Crunchbase?: string | null
          Email?: string | null
          facebook?: string | null
          File?: string | null
          "Funding Stage"?: string | null
          Github?: string | null
          headcount?: string | null
          "Hiring Focus"?: string | null
          industry?: string | null
          Linkedin?: string | null
          Logo?: string | null
          "Modified Date"?: string | null
          "new-industry"?: string | null
          "new-subsector"?: string | null
          "Office Location"?: string | null
          "Phone Number"?: string | null
          plan?: string | null
          Positions?: string | null
          Revenues?: string | null
          Score?: string | null
          "Score Google Sheets"?: string | null
          Slug?: string | null
          stage?: string | null
          subsector?: string | null
          Tag?: string | null
          "unique id"?: string | null
          Website?: string | null
          "Working Mode"?: string | null
          "Year Founded"?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          converted_at: string | null
          converted_from_pipeline_data: Json | null
          converted_from_pipeline_id: string | null
          created_at: string
          customer_name: string
          end_date: string
          id: string
          monthly_amount_cents: number
          start_date: string
          updated_at: string
        }
        Insert: {
          converted_at?: string | null
          converted_from_pipeline_data?: Json | null
          converted_from_pipeline_id?: string | null
          created_at?: string
          customer_name: string
          end_date: string
          id?: string
          monthly_amount_cents: number
          start_date: string
          updated_at?: string
        }
        Update: {
          converted_at?: string | null
          converted_from_pipeline_data?: Json | null
          converted_from_pipeline_id?: string | null
          created_at?: string
          customer_name?: string
          end_date?: string
          id?: string
          monthly_amount_cents?: number
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_converted_from_pipeline_id_fkey"
            columns: ["converted_from_pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipeline"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_converted_from_pipeline_id_fkey"
            columns: ["converted_from_pipeline_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_monthly_max"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_converted_from_pipeline_id_fkey"
            columns: ["converted_from_pipeline_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_monthly_mid"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_converted_from_pipeline_id_fkey"
            columns: ["converted_from_pipeline_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_monthly_min"
            referencedColumns: ["id"]
          },
        ]
      }
      job_specifications: {
        Row: {
          audio_file_path: string | null
          bonus_high: number | null
          bonus_low: number | null
          business_reasons: string | null
          company_name: string
          confirmation_notes: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          document_file_path: string | null
          embedding: string | null
          excluded_companies: Json | null
          experience_years_max: number | null
          experience_years_min: number | null
          id: string
          key_requirements: string | null
          last_confirmed_at: string | null
          leadership_responsibilities: string | null
          level_raw: string | null
          original_input: string | null
          ote_high: number | null
          ote_low: number | null
          other_location: string | null
          preferred_company_size: string | null
          preferred_company_type: string | null
          preferred_location: string | null
          primary_skills: string[] | null
          responsibilities: string | null
          salary_base_high: number | null
          salary_base_low: number | null
          secondary_skills: string[] | null
          short_description: string | null
          status: Database["public"]["Enums"]["job_spec_status"]
          target_companies: string | null
          title: string
          updated_at: string
          working_mode: string | null
        }
        Insert: {
          audio_file_path?: string | null
          bonus_high?: number | null
          bonus_low?: number | null
          business_reasons?: string | null
          company_name: string
          confirmation_notes?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          document_file_path?: string | null
          embedding?: string | null
          excluded_companies?: Json | null
          experience_years_max?: number | null
          experience_years_min?: number | null
          id?: string
          key_requirements?: string | null
          last_confirmed_at?: string | null
          leadership_responsibilities?: string | null
          level_raw?: string | null
          original_input?: string | null
          ote_high?: number | null
          ote_low?: number | null
          other_location?: string | null
          preferred_company_size?: string | null
          preferred_company_type?: string | null
          preferred_location?: string | null
          primary_skills?: string[] | null
          responsibilities?: string | null
          salary_base_high?: number | null
          salary_base_low?: number | null
          secondary_skills?: string[] | null
          short_description?: string | null
          status?: Database["public"]["Enums"]["job_spec_status"]
          target_companies?: string | null
          title: string
          updated_at?: string
          working_mode?: string | null
        }
        Update: {
          audio_file_path?: string | null
          bonus_high?: number | null
          bonus_low?: number | null
          business_reasons?: string | null
          company_name?: string
          confirmation_notes?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          document_file_path?: string | null
          embedding?: string | null
          excluded_companies?: Json | null
          experience_years_max?: number | null
          experience_years_min?: number | null
          id?: string
          key_requirements?: string | null
          last_confirmed_at?: string | null
          leadership_responsibilities?: string | null
          level_raw?: string | null
          original_input?: string | null
          ote_high?: number | null
          ote_low?: number | null
          other_location?: string | null
          preferred_company_size?: string | null
          preferred_company_type?: string | null
          preferred_location?: string | null
          primary_skills?: string[] | null
          responsibilities?: string | null
          salary_base_high?: number | null
          salary_base_low?: number | null
          secondary_skills?: string[] | null
          short_description?: string | null
          status?: Database["public"]["Enums"]["job_spec_status"]
          target_companies?: string | null
          title?: string
          updated_at?: string
          working_mode?: string | null
        }
        Relationships: []
      }
      on_demand_fees: {
        Row: {
          amount_cents: number
          created_at: string
          customer_name: string
          fee_date: string
          id: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          customer_name: string
          fee_date: string
          id?: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          customer_name?: string
          fee_date?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      pipeline: {
        Row: {
          created_at: string | null
          customer_name: string
          expected_start_date: string
          id: string
          max_mrr_cents: number
          mid_mrr_cents: number
          min_mrr_cents: number
          months: number
          owner: string | null
          renewal_probability: number | null
          stage: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name: string
          expected_start_date: string
          id?: string
          max_mrr_cents: number
          mid_mrr_cents: number
          min_mrr_cents: number
          months: number
          owner?: string | null
          renewal_probability?: number | null
          stage?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string
          expected_start_date?: string
          id?: string
          max_mrr_cents?: number
          mid_mrr_cents?: number
          min_mrr_cents?: number
          months?: number
          owner?: string | null
          renewal_probability?: number | null
          stage?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      positions: {
        Row: {
          bonus_high: number | null
          bonus_low: number | null
          business_reasons: string | null
          company_id: number | null
          company_name: string | null
          created_at: string | null
          currency: string | null
          experience_raw: string | null
          experience_years_max: number | null
          experience_years_min: number | null
          external_id: string | null
          function: string | null
          id: string
          jd_embedding: string | null
          key_requirements: string | null
          kickoff_at: string | null
          leadership_responsibilities: string | null
          level_raw: string | null
          offer_made_at: string | null
          ote_high: number | null
          ote_low: number | null
          other_location: string | null
          preferred_location: string | null
          primary_skills: string[] | null
          primary_skills_raw: string | null
          responsibilities: string | null
          salary_base_high: number | null
          salary_base_low: number | null
          secondary_skills: string[] | null
          secondary_skills_raw: string | null
          short_description: string | null
          status: string | null
          target_companies: string | null
          title: string
          updated_at: string | null
          working_mode: string | null
        }
        Insert: {
          bonus_high?: number | null
          bonus_low?: number | null
          business_reasons?: string | null
          company_id?: number | null
          company_name?: string | null
          created_at?: string | null
          currency?: string | null
          experience_raw?: string | null
          experience_years_max?: number | null
          experience_years_min?: number | null
          external_id?: string | null
          function?: string | null
          id?: string
          jd_embedding?: string | null
          key_requirements?: string | null
          kickoff_at?: string | null
          leadership_responsibilities?: string | null
          level_raw?: string | null
          offer_made_at?: string | null
          ote_high?: number | null
          ote_low?: number | null
          other_location?: string | null
          preferred_location?: string | null
          primary_skills?: string[] | null
          primary_skills_raw?: string | null
          responsibilities?: string | null
          salary_base_high?: number | null
          salary_base_low?: number | null
          secondary_skills?: string[] | null
          secondary_skills_raw?: string | null
          short_description?: string | null
          status?: string | null
          target_companies?: string | null
          title: string
          updated_at?: string | null
          working_mode?: string | null
        }
        Update: {
          bonus_high?: number | null
          bonus_low?: number | null
          business_reasons?: string | null
          company_id?: number | null
          company_name?: string | null
          created_at?: string | null
          currency?: string | null
          experience_raw?: string | null
          experience_years_max?: number | null
          experience_years_min?: number | null
          external_id?: string | null
          function?: string | null
          id?: string
          jd_embedding?: string | null
          key_requirements?: string | null
          kickoff_at?: string | null
          leadership_responsibilities?: string | null
          level_raw?: string | null
          offer_made_at?: string | null
          ote_high?: number | null
          ote_low?: number | null
          other_location?: string | null
          preferred_location?: string | null
          primary_skills?: string[] | null
          primary_skills_raw?: string | null
          responsibilities?: string | null
          salary_base_high?: number | null
          salary_base_low?: number | null
          secondary_skills?: string[] | null
          secondary_skills_raw?: string | null
          short_description?: string | null
          status?: string | null
          target_companies?: string | null
          title?: string
          updated_at?: string | null
          working_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      positions_bubble_staging_raw: {
        Row: {
          "base-salary-high": string | null
          "base-salary-low": string | null
          "bonus-high": string | null
          "bonus-low": string | null
          "business-reasons": string | null
          company: string | null
          "Company text": string | null
          "key-requirement (text)": string | null
          "Kickoff Date": string | null
          "leadership-responsibilities": string | null
          level: string | null
          "level-hire": string | null
          Matches: string | null
          notes: string | null
          open: string | null
          "other-benefits": string | null
          "position-id": string | null
          "preferred-location": string | null
          "primary-skills": string | null
          "red-flag": string | null
          responsibilities: string | null
          "role-function": string | null
          "secondary-skills": string | null
          "short-description": string | null
          skills: string | null
          "Target companies": string | null
          title: string | null
          "unique id": string | null
          "work-experience": string | null
          "working-mode": string | null
          "working-mode-list": string | null
        }
        Insert: {
          "base-salary-high"?: string | null
          "base-salary-low"?: string | null
          "bonus-high"?: string | null
          "bonus-low"?: string | null
          "business-reasons"?: string | null
          company?: string | null
          "Company text"?: string | null
          "key-requirement (text)"?: string | null
          "Kickoff Date"?: string | null
          "leadership-responsibilities"?: string | null
          level?: string | null
          "level-hire"?: string | null
          Matches?: string | null
          notes?: string | null
          open?: string | null
          "other-benefits"?: string | null
          "position-id"?: string | null
          "preferred-location"?: string | null
          "primary-skills"?: string | null
          "red-flag"?: string | null
          responsibilities?: string | null
          "role-function"?: string | null
          "secondary-skills"?: string | null
          "short-description"?: string | null
          skills?: string | null
          "Target companies"?: string | null
          title?: string | null
          "unique id"?: string | null
          "work-experience"?: string | null
          "working-mode"?: string | null
          "working-mode-list"?: string | null
        }
        Update: {
          "base-salary-high"?: string | null
          "base-salary-low"?: string | null
          "bonus-high"?: string | null
          "bonus-low"?: string | null
          "business-reasons"?: string | null
          company?: string | null
          "Company text"?: string | null
          "key-requirement (text)"?: string | null
          "Kickoff Date"?: string | null
          "leadership-responsibilities"?: string | null
          level?: string | null
          "level-hire"?: string | null
          Matches?: string | null
          notes?: string | null
          open?: string | null
          "other-benefits"?: string | null
          "position-id"?: string | null
          "preferred-location"?: string | null
          "primary-skills"?: string | null
          "red-flag"?: string | null
          responsibilities?: string | null
          "role-function"?: string | null
          "secondary-skills"?: string | null
          "short-description"?: string | null
          skills?: string | null
          "Target companies"?: string | null
          title?: string | null
          "unique id"?: string | null
          "work-experience"?: string | null
          "working-mode"?: string | null
          "working-mode-list"?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          id: string
          job_spec_markdown: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          job_spec_markdown?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          job_spec_markdown?: string | null
        }
        Relationships: []
      }
      recruiter_feedback: {
        Row: {
          adjusted_company_weight: number | null
          adjusted_experience_weight: number | null
          adjusted_location_weight: number | null
          adjusted_skills_weight: number | null
          candidate_match_id: string
          created_at: string
          decision: Database["public"]["Enums"]["candidate_status"]
          feedback_by: string | null
          feedback_notes: string | null
          id: string
          job_spec_id: string
          rejection_reason: string | null
          session_id: string | null
          updated_at: string
          was_hired: boolean | null
          was_interviewed: boolean | null
        }
        Insert: {
          adjusted_company_weight?: number | null
          adjusted_experience_weight?: number | null
          adjusted_location_weight?: number | null
          adjusted_skills_weight?: number | null
          candidate_match_id: string
          created_at?: string
          decision: Database["public"]["Enums"]["candidate_status"]
          feedback_by?: string | null
          feedback_notes?: string | null
          id?: string
          job_spec_id: string
          rejection_reason?: string | null
          session_id?: string | null
          updated_at?: string
          was_hired?: boolean | null
          was_interviewed?: boolean | null
        }
        Update: {
          adjusted_company_weight?: number | null
          adjusted_experience_weight?: number | null
          adjusted_location_weight?: number | null
          adjusted_skills_weight?: number | null
          candidate_match_id?: string
          created_at?: string
          decision?: Database["public"]["Enums"]["candidate_status"]
          feedback_by?: string | null
          feedback_notes?: string | null
          id?: string
          job_spec_id?: string
          rejection_reason?: string | null
          session_id?: string | null
          updated_at?: string
          was_hired?: boolean | null
          was_interviewed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_feedback_candidate_match_id_fkey"
            columns: ["candidate_match_id"]
            isOneToOne: false
            referencedRelation: "candidate_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiter_feedback_job_spec_id_fkey"
            columns: ["job_spec_id"]
            isOneToOne: false
            referencedRelation: "job_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      search_configurations: {
        Row: {
          actual_cost_cents: number | null
          company_weight: number
          completed_at: string | null
          created_at: string
          enabled_layers: Database["public"]["Enums"]["search_layer"][]
          estimated_cost_cents: number
          experience_weight: number
          id: string
          is_active: boolean
          job_spec_id: string
          location_weight: number
          max_candidates_per_layer: number
          skills_weight: number
        }
        Insert: {
          actual_cost_cents?: number | null
          company_weight?: number
          completed_at?: string | null
          created_at?: string
          enabled_layers?: Database["public"]["Enums"]["search_layer"][]
          estimated_cost_cents?: number
          experience_weight?: number
          id?: string
          is_active?: boolean
          job_spec_id: string
          location_weight?: number
          max_candidates_per_layer?: number
          skills_weight?: number
        }
        Update: {
          actual_cost_cents?: number | null
          company_weight?: number
          completed_at?: string | null
          created_at?: string
          enabled_layers?: Database["public"]["Enums"]["search_layer"][]
          estimated_cost_cents?: number
          experience_weight?: number
          id?: string
          is_active?: boolean
          job_spec_id?: string
          location_weight?: number
          max_candidates_per_layer?: number
          skills_weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "search_configurations_job_spec_id_fkey"
            columns: ["job_spec_id"]
            isOneToOne: false
            referencedRelation: "job_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
      search_sessions: {
        Row: {
          approved_candidates: number
          completed_at: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          iteration_number: number
          job_spec_id: string
          rejected_candidates: number
          total_candidates_found: number
          total_cost_cents: number
        }
        Insert: {
          approved_candidates?: number
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          iteration_number?: number
          job_spec_id: string
          rejected_candidates?: number
          total_candidates_found?: number
          total_cost_cents?: number
        }
        Update: {
          approved_candidates?: number
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          iteration_number?: number
          job_spec_id?: string
          rejected_candidates?: number
          total_candidates_found?: number
          total_cost_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "search_sessions_job_spec_id_fkey"
            columns: ["job_spec_id"]
            isOneToOne: false
            referencedRelation: "job_specifications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      mrr_by_month: {
        Row: {
          month: string | null
          total_mrr_cents: number | null
        }
        Relationships: []
      }
      v_actual_monthly: {
        Row: {
          customer_name: string | null
          id: string | null
          month_begin: string | null
          mrr_cents: number | null
        }
        Relationships: []
      }
      v_companies_rag: {
        Row: {
          about: string | null
          bubble_created_at: string | null
          bubble_id: string | null
          bubble_raw: Json | null
          domain: string | null
          funding_stage: string | null
          headcount: string | null
          industry: string | null
          linkedin_url: string | null
          modified_at: string | null
          name: string | null
          office_location: string | null
          phone_number: string | null
          plan: string | null
          score: number | null
          stage: string | null
          status: string | null
          subsector: string | null
          website: string | null
          year_founded: string | null
        }
        Insert: {
          about?: never
          bubble_created_at?: never
          bubble_id?: string | null
          bubble_raw?: never
          domain?: never
          funding_stage?: string | null
          headcount?: string | null
          industry?: never
          linkedin_url?: never
          modified_at?: never
          name?: string | null
          office_location?: string | null
          phone_number?: string | null
          plan?: string | null
          score?: never
          stage?: never
          status?: string | null
          subsector?: never
          website?: never
          year_founded?: string | null
        }
        Update: {
          about?: never
          bubble_created_at?: never
          bubble_id?: string | null
          bubble_raw?: never
          domain?: never
          funding_stage?: string | null
          headcount?: string | null
          industry?: never
          linkedin_url?: never
          modified_at?: never
          name?: string | null
          office_location?: string | null
          phone_number?: string | null
          plan?: string | null
          score?: never
          stage?: never
          status?: string | null
          subsector?: never
          website?: never
          year_founded?: string | null
        }
        Relationships: []
      }
      v_on_demand_monthly: {
        Row: {
          customer_name: string | null
          fee_cents: number | null
          id: string | null
          month_begin: string | null
        }
        Insert: {
          customer_name?: string | null
          fee_cents?: number | null
          id?: string | null
          month_begin?: never
        }
        Update: {
          customer_name?: string | null
          fee_cents?: number | null
          id?: string | null
          month_begin?: never
        }
        Relationships: []
      }
      v_pipeline_monthly_max: {
        Row: {
          customer_name: string | null
          id: string | null
          month_begin: string | null
          mrr_cents: number | null
        }
        Relationships: []
      }
      v_pipeline_monthly_mid: {
        Row: {
          customer_name: string | null
          id: string | null
          month_begin: string | null
          mrr_cents: number | null
        }
        Relationships: []
      }
      v_pipeline_monthly_min: {
        Row: {
          customer_name: string | null
          id: string | null
          month_begin: string | null
          mrr_cents: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      citext: {
        Args: { "": boolean } | { "": string } | { "": unknown }
        Returns: string
      }
      citext_hash: {
        Args: { "": string }
        Returns: number
      }
      citextin: {
        Args: { "": unknown }
        Returns: string
      }
      citextout: {
        Args: { "": string }
        Returns: unknown
      }
      citextrecv: {
        Args: { "": unknown }
        Returns: string
      }
      citextsend: {
        Args: { "": string }
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      candidate_status:
        | "pending"
        | "approved"
        | "rejected"
        | "interviewed"
        | "hired"
      job_spec_status:
        | "draft"
        | "confirmed"
        | "searching"
        | "completed"
        | "archived"
      search_layer: "internal" | "similar_companies" | "external"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      candidate_status: [
        "pending",
        "approved",
        "rejected",
        "interviewed",
        "hired",
      ],
      job_spec_status: [
        "draft",
        "confirmed",
        "searching",
        "completed",
        "archived",
      ],
      search_layer: ["internal", "similar_companies", "external"],
    },
  },
} as const
