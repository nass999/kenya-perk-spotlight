
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardStats, VendorWithPerks } from '@/types/dashboard';

export const useDashboardData = () => {
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
  });
  const [activeVendors, setActiveVendors] = useState<VendorWithPerks[]>([]);
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
          
          // Fetch vendors with active perks (for Master Admin)
          const activeVendorsResult = await supabase
            .from('perks')
            .select('name')
            .order('created_at', { ascending: false });
          
          // Process vendor data
          const vendorsMap = new Map<string, number>();
          if (activeVendorsResult.data) {
            activeVendorsResult.data.forEach(perk => {
              if (perk.name) {
                const vendorName = perk.name.split(' ')[0]; // Simple extraction of vendor name
                vendorsMap.set(vendorName, (vendorsMap.get(vendorName) || 0) + 1);
              }
            });
          }
          
          const vendorsList: VendorWithPerks[] = Array.from(vendorsMap.entries())
            .map(([name, perkCount]) => ({ name, perkCount }))
            .sort((a, b) => b.perkCount - a.perkCount)
            .slice(0, 10); // Top 10 vendors
          
          setActiveVendors(vendorsList);
          
          setStats({
            totalPerks: totalPerksResult.count || 0,
            availablePerks: totalPerksResult.count || 0,
            activePerks: totalPerksResult.count || 0, // Added new property
            redeemedPerks: 0, // Would need another query
            totalRedemptions: 0, // Added new property
            pendingRedemptions: 0, // Added new property
            companies: companiesResult.count || 0,
            users: usersResult.count || 0,
            totalSavings: 0,
          });
        } else if (authState.user?.role === 'company_admin') {
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
            activePerks: companyPerksResult.count || 0, // Added new property
            redeemedPerks: redeemedPerksResult.count || 0,
            totalRedemptions: redeemedPerksResult.count || 0, // Added new property
            pendingRedemptions: 0, // Added new property
            companies: 1,
            users: companyUsersResult.count || 0,
            totalSavings: 0,
          });
        } else if (authState.user?.role === 'vendor') {
          // Vendor sees their own perks stats
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
          
          // Calculate estimated savings (placeholder calculation - in a real app you'd use actual redemption values)
          // For now we'll just use 100 as a base value per redemption
          const estimatedSavings = (userRedemptionsResult.count || 0) * 100;
          
          setStats({
            totalPerks: availablePerksResult.count || 0,
            availablePerks: availablePerksResult.count || 0,
            activePerks: availablePerksResult.count || 0, // Added new property
            redeemedPerks: userRedemptionsResult.count || 0,
            totalRedemptions: userRedemptionsResult.count || 0, // Added new property
            pendingRedemptions: 0, // Added new property
            companies: 0,
            users: 0,
            totalSavings: estimatedSavings,
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

  return { stats, activeVendors, loading, error };
};
