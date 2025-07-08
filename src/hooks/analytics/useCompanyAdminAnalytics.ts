
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
  redemption_code: string;
}

interface AvailablePerk {
  id: string;
  name: string;
  description: string;
  category: string | null;
  discount_amount: number;
  discount_type: string;
}

export const useCompanyAdminAnalytics = () => {
  const { authState } = useAuth();
  const [data, setData] = useState<{
    companyUsers: CompanyUser[];
    companyRedemptions: CompanyRedemption[];
    availablePerks: AvailablePerk[];
    stats: {
      activePerks: number;
      totalRedemptions: number;
      userCount: number;
    };
    loading: boolean;
    error: string | null;
  }>({
    companyUsers: [],
    companyRedemptions: [],
    availablePerks: [],
    stats: {
      activePerks: 0,
      totalRedemptions: 0,
      userCount: 0
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.user?.company_id) return;

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch company users (employees belonging to this company)
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email, role')
          .eq('company_id', authState.user.company_id)
          .eq('is_active', true);

        if (usersError) throw usersError;

        // Fetch active perks for this company (enabled company_perks)
        const { data: companyPerksData, error: companyPerksError } = await supabase
          .from('company_perks')
          .select(`
            id,
            is_enabled,
            perks (
              id,
              name,
              description,
              category,
              discount_amount,
              discount_type,
              is_enabled,
              is_deleted
            )
          `)
          .eq('company_id', authState.user.company_id)
          .eq('is_enabled', true);

        if (companyPerksError) throw companyPerksError;

        // Process available perks - fix the data structure access
        const availablePerks = companyPerksData?.filter(cp => 
          cp.perks && 
          cp.perks.is_enabled === true && 
          cp.perks.is_deleted === false
        ).map(cp => ({
          id: cp.perks!.id,
          name: cp.perks!.name,
          description: cp.perks!.description,
          category: cp.perks!.category,
          discount_amount: cp.perks!.discount_amount,
          discount_type: cp.perks!.discount_type
        })) || [];

        // Fetch redemptions by employees of this company
        const { data: redemptionsData, error: redemptionsError } = await supabase
          .from('redemptions')
          .select(`
            id,
            status,
            created_at,
            redemption_code,
            user_id,
            perks (name),
            users!inner (full_name, company_id, role)
          `)
          .eq('users.company_id', authState.user.company_id)
          .eq('users.role', 'employee')
          .order('created_at', { ascending: false });

        if (redemptionsError) throw redemptionsError;

        // Process redemptions data
        const processedRedemptions = redemptionsData?.map(redemption => ({
          id: redemption.id,
          perk_name: redemption.perks?.name || 'Unknown Perk',
          user_name: redemption.users?.full_name || 'Unknown User',
          status: redemption.status,
          created_at: redemption.created_at,
          redemption_code: redemption.redemption_code
        })) || [];

        setData({
          companyUsers: usersData || [],
          companyRedemptions: processedRedemptions,
          availablePerks: availablePerks,
          stats: {
            activePerks: availablePerks.length,
            totalRedemptions: processedRedemptions.length,
            userCount: usersData?.length || 0
          },
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
