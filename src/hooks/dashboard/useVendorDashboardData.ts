
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/dashboard';
import { useAuth } from '@/contexts/AuthContext';

export const useVendorDashboardData = () => {
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
    const fetchVendorDashboardData = async () => {
      if (!authState.user || authState.user.role !== 'vendor') return;
      
      try {
        setLoading(true);
        
        const [vendorPerksResult, activePerksResult, redemptionsResult] = await Promise.all([
          supabase.from('perks').select('*', { count: 'exact' }).eq('vendor_id', authState.user.id),
          supabase.from('perks').select('*', { count: 'exact' }).eq('vendor_id', authState.user.id).eq('is_enabled', true),
          supabase.from('redemptions').select('*', { count: 'exact' }).eq('vendor_id', authState.user.id),
        ]);

        // Could add a specific query for pending redemptions in a real app
        const pendingRedemptions = 0;
        
        setStats({
          totalPerks: vendorPerksResult.count || 0,
          availablePerks: vendorPerksResult.count || 0,
          activePerks: activePerksResult.count || 0,
          redeemedPerks: 0,
          totalRedemptions: redemptionsResult.count || 0,
          pendingRedemptions: pendingRedemptions,
          companies: 0,
          users: 0,
          totalSavings: 0,
        });
      } catch (err) {
        console.error("Error fetching vendor dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDashboardData();
  }, [authState.user]);

  return { stats, loading, error };
};
