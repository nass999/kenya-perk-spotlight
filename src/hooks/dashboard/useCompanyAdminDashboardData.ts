
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/dashboard';
import { useAuth } from '@/contexts/auth';

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
    totalSavings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyAdminDashboardData = async () => {
      if (!authState.user || authState.user.role !== 'company_admin' || !authState.user.company_id) return;
      
      try {
        setLoading(true);
        
        // Get company perks (perks activated for this company)
        const { data: companyPerks, error: companyPerksError } = await supabase
          .from('company_perks')
          .select(`
            *,
            perks!inner(
              id,
              name,
              is_enabled,
              is_deleted
            )
          `)
          .eq('company_id', authState.user.company_id);

        if (companyPerksError) throw companyPerksError;

        // Filter for active perks (enabled and not deleted at the perk level)
        const activePerks = companyPerks?.filter(cp => 
          cp.perks && 
          cp.perks.is_enabled === true && 
          cp.perks.is_deleted === false
        ) || [];

        // Get company users count
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', authState.user.company_id);

        if (usersError) throw usersError;

        // Get redemptions for this company's users
        const { data: redemptions, error: redemptionsError } = await supabase
          .from('redemptions')
          .select(`
            id,
            status,
            user_id,
            users!inner(company_id)
          `)
          .eq('users.company_id', authState.user.company_id);

        if (redemptionsError) throw redemptionsError;

        const totalRedemptions = redemptions?.length || 0;
        const pendingRedemptions = redemptions?.filter(r => r.status === 'pending').length || 0;
        
        setStats({
          totalPerks: companyPerks?.length || 0,
          availablePerks: activePerks.length,
          activePerks: activePerks.length,
          redeemedPerks: totalRedemptions,
          totalRedemptions: totalRedemptions,
          pendingRedemptions: pendingRedemptions,
          companies: 1,
          users: usersCount || 0,
          totalSavings: 0,
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
