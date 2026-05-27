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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_candidate_invites: {
        Row: {
          claimed_by: string | null
          created_at: string
          created_by: string
          id: string
          status: string
          submission_data: Json
          token: string
          updated_at: string
        }
        Insert: {
          claimed_by?: string | null
          created_at?: string
          created_by: string
          id?: string
          status?: string
          submission_data?: Json
          token?: string
          updated_at?: string
        }
        Update: {
          claimed_by?: string | null
          created_at?: string
          created_by?: string
          id?: string
          status?: string
          submission_data?: Json
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      cabinet_accounts: {
        Row: {
          cabinet_name: string
          contacts: Json
          created_at: string
          id: string
          is_verified: boolean
          logo_url: string | null
          palier: string | null
          searches: Json
          submission_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          cabinet_name: string
          contacts?: Json
          created_at?: string
          id?: string
          is_verified?: boolean
          logo_url?: string | null
          palier?: string | null
          searches?: Json
          submission_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          cabinet_name?: string
          contacts?: Json
          created_at?: string
          id?: string
          is_verified?: boolean
          logo_url?: string | null
          palier?: string | null
          searches?: Json
          submission_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cabinet_candidate_interests: {
        Row: {
          cabinet_account_id: string
          candidate_user_id: string
          created_at: string
          id: string
          logan_validated: boolean
          notified_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cabinet_account_id: string
          candidate_user_id: string
          created_at?: string
          id?: string
          logan_validated?: boolean
          notified_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          cabinet_account_id?: string
          candidate_user_id?: string
          created_at?: string
          id?: string
          logan_validated?: boolean
          notified_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cabinet_candidate_interests_cabinet_account_id_fkey"
            columns: ["cabinet_account_id"]
            isOneToOne: false
            referencedRelation: "cabinet_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      cabinet_notification_alerts: {
        Row: {
          cabinet_account_id: string
          created_at: string
          id: string
          is_active: boolean
          label: string
          origin_firms: string[]
          practice_criteria: string[]
          seniority_criteria: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          cabinet_account_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          origin_firms?: string[]
          practice_criteria?: string[]
          seniority_criteria?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          cabinet_account_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          origin_firms?: string[]
          practice_criteria?: string[]
          seniority_criteria?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cabinet_notification_alerts_cabinet_account_id_fkey"
            columns: ["cabinet_account_id"]
            isOneToOne: false
            referencedRelation: "cabinet_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_identity_unlocks: {
        Row: {
          cabinet_account_id: string
          candidate_user_id: string
          confirmed_at: string | null
          created_at: string
          cv_unlocked: boolean
          id: string
          identity_unlocked: boolean
          interest_id: string
          status: string
          updated_at: string
        }
        Insert: {
          cabinet_account_id: string
          candidate_user_id: string
          confirmed_at?: string | null
          created_at?: string
          cv_unlocked?: boolean
          id?: string
          identity_unlocked?: boolean
          interest_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          cabinet_account_id?: string
          candidate_user_id?: string
          confirmed_at?: string | null
          created_at?: string
          cv_unlocked?: boolean
          id?: string
          identity_unlocked?: boolean
          interest_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_identity_unlocks_cabinet_account_id_fkey"
            columns: ["cabinet_account_id"]
            isOneToOne: false
            referencedRelation: "cabinet_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_identity_unlocks_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: true
            referencedRelation: "cabinet_candidate_interests"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_registrations: {
        Row: {
          created_at: string
          email_verified_at: string | null
          id: string
          no_go_cabinets: string[]
          status: string
          submission_data: Json
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          created_at?: string
          email_verified_at?: string | null
          id?: string
          no_go_cabinets?: string[]
          status?: string
          submission_data?: Json
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          created_at?: string
          email_verified_at?: string | null
          id?: string
          no_go_cabinets?: string[]
          status?: string
          submission_data?: Json
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      interview_slots: {
        Row: {
          admin_notes: string | null
          cabinet_account_id: string
          candidate_user_id: string
          created_at: string
          ends_at: string
          id: string
          interest_id: string | null
          proposed_by: string
          starts_at: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          cabinet_account_id: string
          candidate_user_id: string
          created_at?: string
          ends_at: string
          id?: string
          interest_id?: string | null
          proposed_by: string
          starts_at: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          cabinet_account_id?: string
          candidate_user_id?: string
          created_at?: string
          ends_at?: string
          id?: string
          interest_id?: string | null
          proposed_by?: string
          starts_at?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_slots_cabinet_account_id_fkey"
            columns: ["cabinet_account_id"]
            isOneToOne: false
            referencedRelation: "cabinet_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_slots_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "cabinet_candidate_interests"
            referencedColumns: ["id"]
          },
        ]
      }
      logan_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          candidate_cabinet: string
          candidate_department: string
          candidate_email: string
          candidate_name: string
          candidate_seniority: string
          created_at: string
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_time: string
          candidate_cabinet?: string
          candidate_department?: string
          candidate_email: string
          candidate_name: string
          candidate_seniority?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string
          candidate_cabinet?: string
          candidate_department?: string
          candidate_email?: string
          candidate_name?: string
          candidate_seniority?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          linkedin_url: string | null
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          linkedin_url?: string | null
          updated_at?: string
          user_id: string
          user_type?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          linkedin_url?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_cabinet_accounts: {
        Args: never
        Returns: {
          auth_email: string
          cabinet_name: string
          contacts: Json
          created_at: string
          full_name: string
          id: string
          is_verified: boolean
          logo_url: string
          palier: string
          searches: Json
          submission_data: Json
          user_id: string
        }[]
      }
      admin_list_candidate_registrations: {
        Args: never
        Returns: {
          auth_email: string
          created_at: string
          email_verified_at: string
          full_name: string
          id: string
          status: string
          submission_data: Json
          user_id: string
          visibility: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
