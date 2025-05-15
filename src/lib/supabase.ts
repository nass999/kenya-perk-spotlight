
import { createClient } from '@supabase/supabase-js';

// Types for our database
export type Database = {
  public: {
    tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          role: 'master_admin' | 'company_admin' | 'employee';
          full_name: string;
          company_id: string | null;
        };
        Insert: {
          email: string;
          role?: 'master_admin' | 'company_admin' | 'employee';
          full_name?: string;
          company_id?: string | null;
        };
        Update: {
          email?: string;
          role?: 'master_admin' | 'company_admin' | 'employee';
          full_name?: string;
          company_id?: string | null;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          website: string | null;
          logo_url: string | null;
          industry: string | null;
          employee_count: number | null;
        };
        Insert: {
          name: string;
          website?: string | null;
          logo_url?: string | null;
          industry?: string | null;
          employee_count?: number | null;
        };
        Update: {
          name?: string;
          website?: string | null;
          logo_url?: string | null;
          industry?: string | null;
          employee_count?: number | null;
        };
      };
      perks: {
        Row: {
          id: string;
          name: string;
          description: string;
          created_at: string;
          image_url: string | null;
          discount_amount: number;
          discount_type: 'percentage' | 'fixed';
          company_id: string | null; // null means available to all
          expiry_date: string | null;
          terms_conditions: string | null;
          category: string | null;
        };
        Insert: {
          name: string;
          description: string;
          image_url?: string | null;
          discount_amount: number;
          discount_type: 'percentage' | 'fixed';
          company_id?: string | null;
          expiry_date?: string | null;
          terms_conditions?: string | null;
          category?: string | null;
        };
        Update: {
          name?: string;
          description?: string;
          image_url?: string | null;
          discount_amount?: number;
          discount_type?: 'percentage' | 'fixed';
          company_id?: string | null;
          expiry_date?: string | null;
          terms_conditions?: string | null;
          category?: string | null;
        };
      };
      redemptions: {
        Row: {
          id: string;
          user_id: string;
          perk_id: string;
          created_at: string;
          redemption_code: string;
          status: 'pending' | 'redeemed' | 'expired';
          redeemed_at: string | null;
        };
        Insert: {
          user_id: string;
          perk_id: string;
          redemption_code: string;
          status?: 'pending' | 'redeemed' | 'expired';
          redeemed_at?: string | null;
        };
        Update: {
          status?: 'pending' | 'redeemed' | 'expired';
          redeemed_at?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          perk_id: string;
          created_at: string;
          rating: number;
          comment: string | null;
          is_approved: boolean;
        };
        Insert: {
          user_id: string;
          perk_id: string;
          rating: number;
          comment?: string | null;
          is_approved?: boolean;
        };
        Update: {
          rating?: number;
          comment?: string | null;
          is_approved?: boolean;
        };
      };
    };
  };
};

// This creates a placeholder Supabase client with dummy values when env vars aren't available
// When connected to real Supabase, these values will be replaced with actual ones
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if environment variables are available and log a message if they're not
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase environment variables are missing. Please connect your project to Supabase using the Supabase button in the top right corner.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth types
export type UserRole = 'master_admin' | 'company_admin' | 'employee';

export interface UserData {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  company_id: string | null;
}

export type AuthState = {
  user: UserData | null;
  session: any | null;
  loading: boolean;
};
