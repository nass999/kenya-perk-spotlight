
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { VendorProfile } from '@/types/vendor';
import { toast } from '@/components/ui/use-toast';

export function useVendorProfile() {
  const { authState } = useAuth();
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorProfile = async () => {
    if (!authState.user || authState.user.role !== 'vendor') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('id', authState.user.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data as VendorProfile);
    } catch (err: any) {
      console.error('Error fetching vendor profile:', err);
      setError(err.message);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load vendor profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<VendorProfile>) => {
    if (!authState.user || !profile) return null;
    
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', authState.user.id)
        .select();

      if (error) {
        throw error;
      }

      setProfile(data[0] as VendorProfile);
      
      toast({
        title: 'Profile updated',
        description: 'Your vendor profile has been updated successfully.'
      });
      
      return data[0];
    } catch (err: any) {
      console.error('Error updating vendor profile:', err);
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update your vendor profile.'
      });
      
      return null;
    }
  };

  useEffect(() => {
    if (authState.user && !authState.loading) {
      fetchVendorProfile();
    }
  }, [authState.user, authState.loading]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    fetchVendorProfile
  };
}
