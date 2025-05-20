
import { supabase } from '@/integrations/supabase/client';
import { Vendor } from '@/types/vendor';

// Function to change vendor status (active/on_hold)
export const updateVendorStatus = async (id: string, currentStatus: string) => {
  const newStatus = currentStatus === 'active' ? 'on_hold' : 'active';
  
  const { error, data } = await supabase
    .from('vendors')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return { newStatus, data };
};

// Function to soft delete vendor
export const deleteVendor = async (id: string) => {
  const { error } = await supabase
    .from('vendors')
    .update({ 
      status: 'deleted',
      updated_at: new Date().toISOString()
    })
    .eq('id', id);
  
  if (error) throw error;
};
