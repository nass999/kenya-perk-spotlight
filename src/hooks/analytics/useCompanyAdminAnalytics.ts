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
  image_url: string | null;
  valid_through_date: string | null;
  vendor_name?: string;
  is_enabled: boolean;
  is_activated?: boolean;
  activation_status?: boolean;
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

        // Get the actual company ID from the companies table using the user's company_id
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id, name')
          .eq('id', authState.user.company_id)
          .single();

        if (companyError) throw companyError;

        console.log('Company data:', companyData);

        // Fetch ALL users in the company (including all roles)
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email, role, company_id, is_active')
          .eq('company_id', companyData.id)
          .eq('is_active', true);

        if (usersError) throw usersError;

        console.log('Fetched users data:', usersData);
        console.log('Users count:', usersData ? usersData.length : 0);

        const userCount = usersData ? usersData.length : 0;

        // Fetch all globally enabled perks first
        const { data: globalPerks, error: globalPerksError } = await supabase
          .from('perks')
          .select(`
            id,
            name,
            description,
            category,
            discount_amount,
            discount_type,
            image_url,
            valid_through_date,
            is_enabled,
            is_deleted,
            vendor_id,
            vendors!fk_perks_vendor_id (
              id,
              name
            )
          `)
          .eq('is_enabled', true)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (globalPerksError) throw globalPerksError;

        // Fetch company perks to see which ones are activated for this company
        const { data: companyPerksData, error: companyPerksError } = await supabase
          .from('company_perks')
          .select('perk_id, is_enabled')
          .eq('company_id', companyData.id);

        if (companyPerksError) throw companyPerksError;

        // Create a map for quick lookup of company perk status
        const companyPerkMap = new Map();
        companyPerksData?.forEach(cp => {
          companyPerkMap.set(cp.perk_id, cp);
        });

        // Process available perks to match Manage Perks view
        const availablePerks = globalPerks?.map(perk => {
          // Handle vendor data access safely
          let vendorName = 'Unknown Vendor';
          if (perk.vendors) {
            if (Array.isArray(perk.vendors) && perk.vendors.length > 0) {
              vendorName = perk.vendors[0].name || 'Unknown Vendor';
            } else if (typeof perk.vendors === 'object' && 'name' in perk.vendors) {
              vendorName = (perk.vendors as any).name || 'Unknown Vendor';
            }
          }

          return {
            id: perk.id,
            name: perk.name,
            description: perk.description,
            category: perk.category,
            discount_amount: perk.discount_amount,
            discount_type: perk.discount_type,
            image_url: perk.image_url,
            valid_through_date: perk.valid_through_date,
            vendor_name: vendorName,
            is_enabled: perk.is_enabled,
            is_activated: companyPerkMap.has(perk.id),
            activation_status: companyPerkMap.get(perk.id)?.is_enabled || false
          };
        }) || [];

        // Count active perks (globally enabled AND enabled for this company)
        const activePerksCount = availablePerks.filter(perk => 
          perk.is_activated && perk.activation_status
        ).length;

        // For redemptions, we use the same users we already fetched
        const companyUsersAll = usersData || [];
        
        // Fetch redemptions by all users of this company
        const { data: redemptionsData, error: redemptionsError } = await supabase
          .from('redemptions')
          .select(`
            id,
            status,
            created_at,
            redemption_code,
            user_id,
            perk_id
          `)
          .in('user_id', companyUsersAll.map(user => user.id));

        if (redemptionsError) {
          console.error('Redemptions error:', redemptionsError);
          // Continue without redemptions data instead of failing completely
        }

        // Fetch perk names and user names separately to avoid relationship issues
        let processedRedemptions: CompanyRedemption[] = [];
        
        if (redemptionsData && redemptionsData.length > 0) {
          // Get perk names
          const perkIds = [...new Set(redemptionsData.map(r => r.perk_id))];
          const { data: perksData } = await supabase
            .from('perks')
            .select('id, name')
            .in('id', perkIds);

          // Get user names
          const userIds = [...new Set(redemptionsData.map(r => r.user_id))];
          const { data: usersForRedemptions } = await supabase
            .from('users')
            .select('id, full_name')
            .in('id', userIds);

          // Create lookup maps
          const perkNameMap = new Map(perksData?.map(p => [p.id, p.name]) || []);
          const userNameMap = new Map(usersForRedemptions?.map(u => [u.id, u.full_name]) || []);

          processedRedemptions = redemptionsData.map(redemption => ({
            id: redemption.id,
            perk_name: perkNameMap.get(redemption.perk_id) || 'Unknown Perk',
            user_name: userNameMap.get(redemption.user_id) || 'Unknown User',
            status: redemption.status,
            created_at: redemption.created_at,
            redemption_code: redemption.redemption_code
          }));
        }

        setData({
          companyUsers: usersData || [],
          companyRedemptions: processedRedemptions,
          availablePerks: availablePerks,
          stats: {
            activePerks: activePerksCount,
            totalRedemptions: processedRedemptions.length,
            userCount: userCount
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
