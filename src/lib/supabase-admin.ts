
import { supabase } from '@/lib/supabase';

// Custom admin functions that would typically be edge functions
// These are client-side for development but should be moved to edge functions in production
const createCompany = async (name: string) => {
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
};

// Export the admin functions for use elsewhere
export const adminFunctions = {
  createCompany
};

// Don't modify the GoTrueAdminApi directly as it causes type errors
// Instead, export the functions for direct use
export { createCompany };
