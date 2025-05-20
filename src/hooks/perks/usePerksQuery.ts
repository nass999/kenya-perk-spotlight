
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Perk } from '@/components/perks/PerkTypes';
import { useAuth } from '@/contexts/AuthContext';

export const usePerksQuery = () => {
  const { authState } = useAuth();
  const [perks, setPerks] = useState<Perk[]>([]);
  const [deletedPerks, setDeletedPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeleted, setLoadingDeleted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletedError, setDeletedError] = useState<string | null>(null);

  const isMasterAdmin = authState.user?.role === 'master_admin';
  const isCompanyAdmin = authState.user?.role === 'company_admin';

  const fetchPerks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching active perks...");
      let query = supabase.from('perks').select('*').eq('is_deleted', false);
      
      // Filter by company if company admin
      if (isCompanyAdmin && authState.user?.company_id) {
        // Company admins can only see active (enabled and not expired) perks
        const today = new Date().toISOString().split('T')[0];
        query = query
          .eq('company_id', authState.user.company_id)
          .or(`valid_through_date.gt.${today},valid_through_date.is.null`)
          .eq('is_enabled', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching perks:", error);
        setError(error.message);
        throw error;
      }
      
      console.log("Fetched active perks:", data);
      setPerks(data as Perk[] || []);
    } catch (error: any) {
      console.error('Error fetching perks:', error);
      toast({
        variant: "destructive",
        title: "Error fetching perks",
        description: "Failed to load perks. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedPerks = async () => {
    if (!isMasterAdmin) return;
    
    try {
      setLoadingDeleted(true);
      setDeletedError(null);
      
      console.log("Fetching deleted perks...");
      const { data, error } = await supabase
        .from('perks')
        .select('*')
        .eq('is_deleted', true);
      
      if (error) {
        console.error("Error fetching deleted perks:", error);
        setDeletedError(error.message);
        throw error;
      }
      
      console.log("Fetched deleted perks:", data);
      setDeletedPerks(data as Perk[] || []);
    } catch (error: any) {
      console.error('Error fetching deleted perks:', error);
      toast({
        variant: "destructive",
        title: "Error fetching deleted perks",
        description: "Failed to load deleted perks. Please try again.",
      });
    } finally {
      setLoadingDeleted(false);
    }
  };

  useEffect(() => {
    if (authState.user) {
      fetchPerks();
      if (isMasterAdmin) {
        fetchDeletedPerks();
      }
    }
    
    // Listen for refresh events from the PerkSelectList component
    const handleRefreshPerks = () => {
      fetchPerks();
      if (isMasterAdmin) {
        fetchDeletedPerks();
      }
    };
    window.addEventListener('refreshPerks', handleRefreshPerks);
    
    return () => {
      window.removeEventListener('refreshPerks', handleRefreshPerks);
    };
  }, [isMasterAdmin, authState.user]);

  return {
    perks,
    setPerks,
    deletedPerks,
    setDeletedPerks,
    loading,
    loadingDeleted,
    error,
    deletedError,
    fetchPerks,
    fetchDeletedPerks,
    isMasterAdmin,
    isCompanyAdmin,
  };
};
