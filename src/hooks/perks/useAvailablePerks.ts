
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';

export const useAvailablePerks = () => {
  const { authState } = useAuth();
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAvailablePerks = useCallback(async () => {
    try {
      if (!authState.user || !authState.user.company_id || authState.user.role !== 'company_admin') {
        console.log("Only company admins with company_id can view available perks", authState.user);
        setError("Only company admins can activate perks.");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      console.log("Fetching available perks for company admin to activate");
      
      // Get the current date for comparing with valid_through_date
      const today = new Date().toISOString().split('T')[0];
      
      // Get all activated global perks that are not yet enabled for this company
      const { data: availablePerks, error: perksError } = await supabase
        .from('perks')
        .select(`
          *,
          company_perks!left (
            id,
            company_id,
            is_enabled
          )
        `)
        .eq('is_enabled', true) // Only activated perks
        .eq('is_deleted', false)
        .or(`valid_through_date.gt.${today},valid_through_date.is.null`)
        .order('name');
      
      if (perksError) {
        console.error('Error fetching available perks:', perksError);
        throw perksError;
      }
      
      // Filter to only show perks not yet activated for this company
      const filteredPerks = availablePerks?.filter(perk => {
        // Check if this perk is NOT already activated for the company
        const companyPerkEntry = perk.company_perks?.find(
          (cp: any) => cp.company_id === authState.user.company_id
        );
        return !companyPerkEntry; // Only show if no company_perks entry exists
      }) || [];
      
      console.log(`Found ${filteredPerks.length} available perks to activate for company ${authState.user.company_id}`);
      setPerks(filteredPerks as Perk[]);
    } catch (error: any) {
      console.error('Error fetching available perks:', error);
      setError(error.message || 'Failed to load available perks');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available perks. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [authState.user]);

  useEffect(() => {
    if (authState.user && authState.user.company_id && authState.user.role === 'company_admin') {
      fetchAvailablePerks();
    } else {
      setLoading(false);
    }
  }, [authState.user, fetchAvailablePerks]);

  return {
    perks,
    loading,
    error,
    fetchAvailablePerks
  };
};
