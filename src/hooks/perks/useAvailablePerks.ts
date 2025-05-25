
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
      if (!authState.user || !authState.user.company_id) {
        console.log("No user or company_id available", authState.user);
        setError("No company ID available. Please contact support.");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      console.log("Fetching available perks for company admin to activate");
      
      // Get the current date for comparing with valid_through_date
      const today = new Date().toISOString().split('T')[0];
      
      // Get all global template perks that are not yet activated for this company
      const { data: globalPerks, error: globalError } = await supabase
        .from('perks')
        .select(`
          *,
          company_perks!left (
            id,
            company_id
          )
        `)
        .eq('is_enabled', true)
        .eq('is_deleted', false)
        .or(`valid_through_date.gt.${today},valid_through_date.is.null`)
        .is('company_perks.company_id', null) // Only perks not activated for this company
        .order('name');
      
      if (globalError) {
        console.error('Error fetching available perks:', globalError);
        throw globalError;
      }
      
      // Filter out perks that already have company_perks entries for this company
      const availablePerks = globalPerks?.filter(perk => {
        // Check if this perk is already activated for the company
        return !perk.company_perks || perk.company_perks.length === 0;
      }) || [];
      
      console.log(`Found ${availablePerks.length} available perks to activate for company ${authState.user.company_id}`);
      setPerks(availablePerks as Perk[]);
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
    if (authState.user && authState.user.company_id) {
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
