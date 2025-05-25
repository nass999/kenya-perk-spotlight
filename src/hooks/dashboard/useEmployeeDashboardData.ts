
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
        
        // Only fetch perks if user has a company_id
        if (!authState.user.company_id) {
          console.log("No company_id found for employee dashboard");
          setStats({
            totalPerks: 0,
            availablePerks: 0,
            activePerks: 0,
            redeemedPerks: 0,
            totalRedemptions: 0,
            pendingRedemptions: 0,
            companies: 0,
            users: 0,
            totalSavings: 0,
          });
          setLoading(false);
          return;
        }
        
        console.log("Fetching employee dashboard data for company:", authState.user.company_id);
        
        // For employees, query perks available to their company
        const { data: availablePerks, error: perksError } = await supabase
          .from('perks')
          .select('*')
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .eq('company_id', authState.user.company_id); // Only company's activated perks
        
        if (perksError) {
          console.error("Error fetching employee perks:", perksError);
          throw perksError;
        }
        
        console.log("Employee perks data count:", availablePerks?.length || 0);
        
        const availablePerksCount = availablePerks?.length || 0;
        
        setStats({
          totalPerks: availablePerksCount,
          availablePerks: availablePerksCount,
          activePerks: availablePerksCount,
          redeemedPerks: 0, // Would need redemptions table
          totalRedemptions: 0,
          pendingRedemptions: 0,
          companies: 0,
          users: 0,
          totalSavings: 0,
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
