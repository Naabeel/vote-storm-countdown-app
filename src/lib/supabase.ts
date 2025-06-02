
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          department: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          department?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          department?: string | null;
          created_at?: string;
        };
      };
      ideas: {
        Row: {
          id: string;
          title: string;
          description: string;
          author_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          author_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          author_id?: string;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          idea_id: string;
          voter_id: string;
          voter_name: string;
          target_user_id: string;
          target_user_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          idea_id: string;
          voter_id: string;
          voter_name: string;
          target_user_id: string;
          target_user_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          idea_id?: string;
          voter_id?: string;
          voter_name?: string;
          target_user_id?: string;
          target_user_name?: string;
          created_at?: string;
        };
      };
      voting_sessions: {
        Row: {
          id: string;
          is_active: boolean;
          time_remaining: number;
          total_duration: number;
          has_ended: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          is_active?: boolean;
          time_remaining?: number;
          total_duration?: number;
          has_ended?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          is_active?: boolean;
          time_remaining?: number;
          total_duration?: number;
          has_ended?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
