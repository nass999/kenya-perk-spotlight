
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

// Attach the admin functions to the supabase client
supabase.auth.admin = {
  ...supabase.auth.admin,  // Preserve any existing admin methods
  ...adminFunctions        // Add our custom admin functions
};

// Add type declarations
declare module '@supabase/supabase-js' {
  interface SupabaseAuthClient {
    admin: typeof adminFunctions & Record<string, any>;
  }
}
