
import { supabase } from '@/lib/supabase';

// This extension provides admin functions that bypass RLS
// In a production app, these would be secure edge functions
export const adminFunctions = {
  createCompany: async (name: string) => {
    try {
      console.log('Creating company as admin:', name);
      
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name }])
        .select('id')
        .single();
        
      if (error) {
        console.error('Admin company creation error:', error);
        return { error };
      }
      
      return { data };
    } catch (error) {
      console.error('Admin company creation failed:', error);
      return { error };
    }
  }
};

// Extend the supabase client with admin methods
supabase.auth.admin = adminFunctions;

// Add type declarations
declare module '@supabase/supabase-js' {
  interface SupabaseAuthClient {
    admin: {
      createCompany: (name: string) => Promise<{ data?: any; error?: any }>;
    };
  }
}
