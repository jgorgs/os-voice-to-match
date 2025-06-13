export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      companies: {
        Row: {
          created_at: string
          founded: string | null
          id: number
          industry: string | null
          last_refreshed: string | null
          linkedin_url: string | null
          location_name: string | null
          name: string | null
          size: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          founded?: string | null
          id?: number
          industry?: string | null
          last_refreshed?: string | null
          linkedin_url?: string | null
          location_name?: string | null
          name?: string | null
          size?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          founded?: string | null
          id?: number
          industry?: string | null
          last_refreshed?: string | null
          linkedin_url?: string | null
          location_name?: string | null
          name?: string | null
          size?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
