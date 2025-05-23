
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/dashboard';
import { useAuth } from '@/contexts/auth';

export const useEmployeeDashboardData = () => {
  const { authState } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPerks: 0,
    availablePerks: 0,
    activePerks: 0,
    redeemedPerks: 0,
    totalRedemptions: 0,
    pendingRedemptions: 0,
    companies: 0,
    users: 0,
    totalSavings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeDashboardData = async () => {
      if (!authState.user) return;
      
      try {
        setLoading(true);
        
        // Get today's date for comparing with valid_through_date
        const today = new Date().toISOString().split('T')[0];
        
        // For employees, query perks available to them
        // Fix: simplify the query to focus on perks that are enabled and not deleted
        const { data: availablePerks, error: perksError } = await supabase
          .from('perks')
          .select('*')
          .eq('is_enabled', true)
          .eq('is_deleted', false);
        
        if (perksError) {
          console.error("Error fetching employee perks:", perksError);
          throw perksError;
        }
        
        console.log("Employee perks data count:", availablePerks?.length || 0);
        console.log("First few perks:", availablePerks?.slice(0, 3));
        
        // Calculate statistics
        const availablePerksCount = availablePerks?.length || 0;
        
        // We can't calculate redemptions without a redemptions table
        // Instead, just set zeroes for now
        const userRedemptionsCount = 0;
        const estimatedSavings = 0;
        
        setStats({
          totalPerks: availablePerksCount,
          availablePerks: availablePerksCount,
          activePerks: availablePerksCount,
          redeemedPerks: userRedemptionsCount,
          totalRedemptions: userRedemptionsCount,
          pendingRedemptions: 0,
          companies: 0,
          users: 0,
          totalSavings: estimatedSavings,
        });
      } catch (err) {
        console.error("Error fetching employee dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDashboardData();
  }, [authState.user]);

  return { stats, loading, error };
};
