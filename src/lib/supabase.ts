import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { Database as ImportedDatabase } from '@/integrations/supabase/types';

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
          is_active: boolean;
        };
        Insert: {
          email: string;
          role?: 'master_admin' | 'company_admin' | 'employee';
          full_name?: string;
          company_id?: string | null;
          is_active?: boolean;
        };
        Update: {
          email?: string;
          role?: 'master_admin' | 'company_admin' | 'employee';
          full_name?: string;
          company_id?: string | null;
          is_active?: boolean;
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

// Convert the imported database type to our format and export the supabase client
export const supabase = supabaseClient as unknown as ReturnType<typeof createClient<Database>>;

// Auth types
export type UserRole = 'master_admin' | 'company_admin' | 'employee';

export interface UserData {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  company_id: string | null;
  is_active?: boolean;
}

export type AuthState = {
  user: UserData | null;
  session: any | null;
  loading: boolean;
};
