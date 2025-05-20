
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';

export const useAvailablePerks = () => {
  const { authState } = useAuth();
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAvailablePerks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch global perks (no company_id) created by master admins
      // that aren't already associated with this company
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('perks')
        .select('*')
        .is('company_id', null) // Only global perks with no company
        .eq('is_enabled', true) // Only enabled perks
        .eq('is_deleted', false) // Not deleted - now using the column
        .or(`valid_through_date.gt.${today},valid_through_date.is.null`) // Not expired
        .order('name');
      
      if (error) throw error;
      
      // Filter out perks that are already associated with this company
      const { data: companyPerks, error: companyPerksError } = await supabase
        .from('perks')
        .select('id')
        .eq('company_id', authState.user?.company_id);
      
      if (companyPerksError) throw companyPerksError;
      
      const companyPerkIds = companyPerks.map(p => p.id);
      const availablePerks = data.filter(p => !companyPerkIds.includes(p.id));
      
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
  };

  useEffect(() => {
    fetchAvailablePerks();
  }, []);

  return {
    perks,
    loading,
    error,
    fetchAvailablePerks
  };
};
