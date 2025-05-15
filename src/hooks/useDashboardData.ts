
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardStats } from '@/types/dashboard';

export const useDashboardData = () => {
  const { authState } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPerks: 0,
    availablePerks: 0,
    redeemedPerks: 0,
    companies: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authState.user) return;
      
      try {
        setLoading(true);
        
        // Fetch different stats based on user role
        if (authState.user.role === 'master_admin') {
          // Platform admin sees global stats
          const [totalPerksResult, companiesResult, usersResult] = await Promise.all([
            supabase.from('perks').select('*', { count: 'exact' }),
            supabase.from('users').select('company_id', { count: 'exact' }).not('company_id', 'is', null).limit(1),
            supabase.from('users').select('*', { count: 'exact' }),
          ]);
          
          setStats({
            totalPerks: totalPerksResult.count || 0,
            availablePerks: totalPerksResult.count || 0,
            redeemedPerks: 0, // Would need another query
            companies: companiesResult.count || 0,
            users: usersResult.count || 0,
          });
        } else if (authState.user.role === 'company_admin') {
          // Company admin sees company stats
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
            redeemedPerks: redeemedPerksResult.count || 0,
            companies: 1,
            users: companyUsersResult.count || 0,
          });
        } else {
          // Employee sees personal stats
          const userRedemptionsResult = await supabase
            .from('redemptions')
            .select('*', { count: 'exact' })
            .eq('user_id', authState.user.id);
            
          // Get available perks for employee
          const availablePerksResult = await supabase
            .from('perks')
            .select('*', { count: 'exact' })
            .or(`company_id.eq.${authState.user.company_id},company_id.is.null`);
          
          setStats({
            totalPerks: availablePerksResult.count || 0,
            availablePerks: availablePerksResult.count || 0,
            redeemedPerks: userRedemptionsResult.count || 0,
            companies: 0,
            users: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authState.user]);

  return { stats, loading, error };
};
