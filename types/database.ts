// Auto-generated types from Supabase
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          gender: "male" | "female" | null;
          preferred_gender: "male" | "female" | "any" | null;
          bio: string | null;
          avatar_url: string | null;
          location_area: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      activities: {
        Row: {
          id: string;
          name: string;
          icon: string;
          category: "solo" | "team" | "both";
        };
        Insert: Omit<Database["public"]["Tables"]["activities"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["activities"]["Insert"]>;
      };
      user_activities: {
        Row: {
          id: string;
          user_id: string;
          activity_id: string;
          schedule_note: string | null;
          skill_level: "beginner" | "intermediate" | "advanced" | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_activities"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["user_activities"]["Insert"]>;
      };
      matches: {
        Row: {
          id: string;
          user_a: string;
          user_b: string;
          activity_id: string;
          status: "pending" | "matched" | "rejected";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matches"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          match_id: string;
          sender_id: string;
          content: string;
          created_at: string;
          read_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      gender: "male" | "female";
      preferred_gender: "male" | "female" | "any";
      skill_level: "beginner" | "intermediate" | "advanced";
      match_status: "pending" | "matched" | "rejected";
      activity_category: "solo" | "team" | "both";
    };
  };
};
