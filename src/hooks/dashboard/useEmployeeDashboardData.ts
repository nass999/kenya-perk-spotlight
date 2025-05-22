
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

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
        
        // For employees, query perks available to them with the correct filters
        const { data: availablePerks, count: availablePerksCount, error: perksError } = await supabase
          .from('perks')
          .select('*', { count: 'exact' })
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .or(`company_id.eq.${authState.user.company_id},company_id.is.null`)
          .or(`valid_through_date.gt.${today},valid_through_date.is.null`);
        
        if (perksError) {
          console.error("Error fetching employee perks:", perksError);
          throw perksError;
        }
        
        console.log("Employee perks data:", {
          count: availablePerksCount,
          perksLength: availablePerks?.length,
          perks: availablePerks
        });
        
        // Query for redemptions made by this user
        const userRedemptionsResult = await supabase
          .from('redemptions')
          .select('*', { count: 'exact' })
          .eq('user_id', authState.user.id);
        
        // Calculate estimated savings (placeholder calculation)
        const estimatedSavings = (userRedemptionsResult.count || 0) * 100;
        
        setStats({
          totalPerks: availablePerksCount || availablePerks?.length || 0,
          availablePerks: availablePerksCount || availablePerks?.length || 0,
          activePerks: availablePerksCount || availablePerks?.length || 0,
          redeemedPerks: userRedemptionsResult.count || 0,
          totalRedemptions: userRedemptionsResult.count || 0,
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
