
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';

interface CompanyUser {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
}

interface CompanyRedemption {
  id: string;
  perk_name: string;
  user_name: string;
  status: string;
  created_at: string;
}

interface RedemptionByCategory {
  name: string;
  value: number;
}

export const useCompanyAdminAnalytics = () => {
  const { authState } = useAuth();
  const [data, setData] = useState<{
    companyUsers: CompanyUser[];
    companyRedemptions: CompanyRedemption[];
    redemptionsByCategory: RedemptionByCategory[];
    loading: boolean;
    error: string | null;
  }>({
    companyUsers: [],
    companyRedemptions: [],
    redemptionsByCategory: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.user?.company_id) return;

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch company users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email, role')
          .eq('company_id', authState.user.company_id)
          .eq('is_active', true);

        if (usersError) throw usersError;

        // Fetch company redemptions with perk and user info
        const { data: redemptionsData, error: redemptionsError } = await supabase
          .from('redemptions')
          .select(`
            id,
            status,
            created_at,
            perks!inner(name),
            users!inner(full_name, company_id)
          `)
          .eq('users.company_id', authState.user.company_id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (redemptionsError) throw redemptionsError;

        // Process redemptions data
        const processedRedemptions = redemptionsData?.map(redemption => ({
          id: redemption.id,
          perk_name: (redemption.perks as any)?.name || 'Unknown Perk',
          user_name: (redemption.users as any)?.full_name || 'Unknown User',
          status: redemption.status,
          created_at: redemption.created_at
        })) || [];

        // Get redemptions by category for this company
        const { data: categoryData, error: categoryError } = await supabase
          .from('redemptions')
          .select(`
            perks!inner(category),
            users!inner(company_id)
          `)
          .eq('users.company_id', authState.user.company_id);

        if (categoryError) throw categoryError;

        // Process category data
        const categoryMap = new Map<string, number>();
        categoryData?.forEach(item => {
          const category = (item.perks as any)?.category || 'Uncategorized';
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });

        const redemptionsByCategory = Array.from(categoryMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setData({
          companyUsers: usersData || [],
          companyRedemptions: processedRedemptions,
          redemptionsByCategory,
          loading: false,
          error: null
        });

      } catch (err: any) {
        console.error("Error fetching company admin analytics:", err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to load analytics data"
        }));
      }
    };

    fetchData();
  }, [authState.user?.company_id]);

  return data;
};
