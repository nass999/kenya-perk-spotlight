
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

export const useCompanyAdminDashboardData = () => {
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
    totalSavings: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyAdminDashboardData = async () => {
      if (!authState.user || authState.user.role !== 'company_admin') return;
      
      try {
        setLoading(true);
        
        const [companyPerksResult, companyUsersResult, redeemedPerksResult] = await Promise.all([
          supabase
            .from('perks')
            .select('*', { count: 'exact' })
            .eq('company_id', authState.user.company_id),
          supabase
            .from('users')
            .select('*', { count: 'exact' })
            .eq('company_id', authState.user.company_id),
          supabase
            .from('redemptions')
            .select('*', { count: 'exact' })
            .eq('company_id', authState.user.company_id),
        ]);
          
        setStats({
          totalPerks: companyPerksResult.count || 0,
          availablePerks: companyPerksResult.count || 0,
          activePerks: companyPerksResult.count || 0, 
          redeemedPerks: redeemedPerksResult.count || 0,
          totalRedemptions: redeemedPerksResult.count || 0,
          pendingRedemptions: 0,
          companies: 1,
          users: companyUsersResult.count || 0,
          totalSavings: 0,
          recentActivities: []
        });
      } catch (err) {
        console.error("Error fetching company admin dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAdminDashboardData();
  }, [authState.user]);

  return { stats, loading, error };
};
